import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Building2, Mail, Users } from "lucide-react";
import { Helmet } from "react-helmet";

export default function AcceptInvitation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token");
  const [token, setToken] = useState(tokenParam || "");

  const { data: invitation, isLoading } = useQuery({
    queryKey: ["invitation", token],
    queryFn: async () => {
      if (!token) return null;
      const { data, error } = await supabase
        .from("invitations")
        .select("*, orgs(name), teams(name)")
        .eq("token", token)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString())
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!token,
  });

  const acceptInvite = useMutation({
    mutationFn: async () => {
      if (!invitation) throw new Error("Invitation non trouvée");
      
      const { data, error } = await supabase.rpc("accept_invitation", {
        token_param: token,
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Invitation acceptée ! Bienvenue 🎉");
      navigate("/app/home");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de l'acceptation");
    },
  });

  if (!token && !tokenParam) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Accepter une invitation</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="token">Code d'invitation</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Entrez votre code d'invitation"
              />
            </div>
            <Button onClick={() => setToken(token)} className="w-full" disabled={!token}>
              Vérifier l'invitation
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-soft text-primary text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Invitation invalide</h2>
          <p className="text-muted-foreground mb-6">
            Cette invitation n'existe pas ou a expiré.
          </p>
          <Button onClick={() => navigate("/app/home")} className="w-full">
            Retour à l'accueil
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm p-8">
      <Helmet>
        <title>Accepter une invitation - EmotionsCare</title>
      </Helmet>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Invitation en attente</h1>
          <p className="text-muted-foreground">
            Vous avez été invité à rejoindre une organisation
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Building2 className="h-8 w-8 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">
                  {(invitation.orgs as any)?.name || "Organisation"}
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {invitation.email}
                  </p>
                  {invitation.teams && (
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Équipe : {(invitation.teams as any)?.name}
                    </p>
                  )}
                  <p>
                    Rôle : <span className="font-medium">
                      {invitation.role === "manager_b2b" ? "Manager" : "Employé"}
                    </span>
                  </p>
                  <p className="text-xs">
                    Expire le : {new Date(invitation.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => acceptInvite.mutate()}
                disabled={acceptInvite.isPending}
                className="flex-1"
              >
                Accepter l'invitation
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/app/home")}
                className="flex-1"
              >
                Plus tard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
