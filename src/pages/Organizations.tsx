import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Building2, Users, Mail, Trash2, Plus } from "lucide-react";
import { Helmet } from "react-helmet";

interface Invitation {
  id: string;
  email: string;
  role: string;
  org_id: string;
  team_id: string | null;
  token: string;
  status: string;
  expires_at: string;
  created_at: string;
  invited_by: string | null;
  accepted_at: string | null;
}

export default function Organizations() {
  const queryClient = useQueryClient();
  const [newOrgName, setNewOrgName] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"user_b2b" | "manager_b2b">("user_b2b");
  const [inviteTeamId, setInviteTeamId] = useState<string>("");

  const { data: orgs = [] } = useQuery({
    queryKey: ["orgs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orgs").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["teams", selectedOrgId],
    queryFn: async () => {
      if (!selectedOrgId) return [];
      const { data, error } = await supabase.from("teams").select("*").eq("org_id", selectedOrgId).order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedOrgId,
  });

  const fetchInvitations = async (): Promise<Invitation[]> => {
    if (!selectedOrgId) return [];
    const result = await (supabase as any)
      .from("invitations")
      .select("*")
      .eq("org_id", selectedOrgId);
    if (result.error) throw result.error;
    return result.data as Invitation[] || [];
  };

  const { data: invitations = [] as Invitation[] } = useQuery({
    queryKey: ["invitations", selectedOrgId],
    queryFn: fetchInvitations,
    enabled: !!selectedOrgId,
  });

  const createOrg = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase.from("orgs").insert({ name, settings: { modules: ["weekly", "coach", "breathwork"] } }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
      setNewOrgName("");
      toast.success("Organisation créée ✅");
    },
  });

  const createTeam = useMutation({
    mutationFn: async ({ name, orgId }: { name: string; orgId: string }) => {
      const { data, error } = await supabase.from("teams").insert({ name, org_id: orgId }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setNewTeamName("");
      toast.success("Équipe créée ✅");
    },
  });

  const sendInvitation = useMutation({
    mutationFn: async ({ email, role, orgId, teamId }: any) => {
      // Valider avec Zod
      const { invitationSchema } = await import("@/lib/validations");
      const validated = invitationSchema.parse({
        email,
        role,
        orgId,
        teamId,
      });
      
      const token = crypto.randomUUID();
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.from("invitations").insert({
        email: validated.email,
        role: validated.role,
        org_id: validated.orgId,
        team_id: validated.teamId || null,
        invited_by: user?.id,
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }).select().single();
      
      if (error) throw error;
      
      // Envoyer l'email d'invitation via edge function
      try {
        await supabase.functions.invoke("send-invitation-email", {
          body: { invitationId: data.id },
        });
      } catch (emailError) {
        console.error("Erreur envoi email:", emailError);
        // Ne pas bloquer si l'email échoue
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      setInviteEmail("");
      toast.success("Invitation envoyée par email ✅");
    },
  });

  const deleteInvitation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invitations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Invitation supprimée");
    },
  });

  return (
    <div className="min-h-screen bg-gradient-calm p-8">
      <Helmet>
        <title>Gestion Organisations - EmotionsCare</title>
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Gestion Organisations</h1>
          <p className="text-muted-foreground">Administration des entreprises et équipes</p>
        </div>

        <Tabs defaultValue="orgs" className="w-full">
          <TabsList>
            <TabsTrigger value="orgs">Organisations</TabsTrigger>
            <TabsTrigger value="teams" disabled={!selectedOrgId}>Équipes</TabsTrigger>
            <TabsTrigger value="invitations" disabled={!selectedOrgId}>Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="orgs" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="orgName">Nouvelle organisation</Label>
                  <Input id="orgName" value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} placeholder="Nom de l'organisation" />
                </div>
                <Button onClick={() => createOrg.mutate(newOrgName)} disabled={!newOrgName}>
                  <Plus className="h-4 w-4 mr-2" />Créer
                </Button>
              </div>
            </Card>

            <div className="grid gap-4">
              {orgs.map((org) => (
                <Card key={org.id} className={`p-6 cursor-pointer transition-all ${selectedOrgId === org.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedOrgId(org.id)}>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">{org.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {org.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            {selectedOrgId && (
              <>
                <Card className="p-6">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Label htmlFor="teamName">Nouvelle équipe</Label>
                      <Input id="teamName" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Nom de l'équipe" />
                    </div>
                    <Button onClick={() => createTeam.mutate({ name: newTeamName, orgId: selectedOrgId })} disabled={!newTeamName}>
                      <Plus className="h-4 w-4 mr-2" />Créer
                    </Button>
                  </div>
                </Card>

                <div className="grid gap-4">
                  {teams.map((team) => (
                    <Card key={team.id} className="p-6">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {team.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            {selectedOrgId && (
              <>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@exemple.com" />
                      </div>
                      <div>
                        <Label htmlFor="role">Rôle</Label>
                        <select id="role" className="w-full h-10 px-3 rounded-md border border-input bg-background" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as any)}>
                          <option value="user_b2b">Employé</option>
                          <option value="manager_b2b">Manager</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="team">Équipe (optionnel)</Label>
                      <select id="team" className="w-full h-10 px-3 rounded-md border border-input bg-background" value={inviteTeamId} onChange={(e) => setInviteTeamId(e.target.value)}>
                        <option value="">Aucune équipe</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>
                    <Button onClick={() => sendInvitation.mutate({ email: inviteEmail, role: inviteRole, orgId: selectedOrgId, teamId: inviteTeamId || null })} disabled={!inviteEmail} className="w-full">
                      <Mail className="h-4 w-4 mr-2" />Créer l'invitation
                    </Button>
                  </div>
                </Card>

                <div className="space-y-2">
                  {invitations.map((inv) => (
                    <Card key={inv.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{inv.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {inv.role} • {inv.status} • {new Date(inv.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Token: {inv.token.slice(0, 8)}... • Expire: {new Date(inv.expires_at).toLocaleDateString()}
                          </p>
                        </div>
                        {inv.status === "pending" && (
                          <Button variant="ghost" size="sm" onClick={() => deleteInvitation.mutate(inv.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
