import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSupportGroups } from '@/hooks/useSupportGroups';
import { Users, Plus, Lock, Globe } from 'lucide-react';

export function SupportGroupsList() {
  const { groups, myGroups, loading, createGroup, joinGroup, leaveGroup } = useSupportGroups();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    groupType: 'general',
    isPrivate: false,
  });

  const handleCreateGroup = async () => {
    await createGroup(
      newGroup.name,
      newGroup.description,
      newGroup.groupType,
      newGroup.isPrivate
    );
    setShowCreateDialog(false);
    setNewGroup({ name: '', description: '', groupType: 'general', isPrivate: false });
  };

  const getGroupTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      anxiety: 'Anxiété',
      depression: 'Dépression',
      stress: 'Stress',
      wellness: 'Bien-être',
      general: 'Général',
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="container mx-auto py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Groupes de soutien</h2>
          <p className="text-muted-foreground">
            Rejoignez ou créez des groupes pour partager et vous soutenir mutuellement
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un groupe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau groupe</DialogTitle>
              <DialogDescription>
                Créez un espace de soutien pour votre communauté
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du groupe</Label>
                <Input
                  id="name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="Ex: Gestion du stress"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="Décrivez l'objectif du groupe..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="type">Type de groupe</Label>
                <select
                  id="type"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newGroup.groupType}
                  onChange={(e) => setNewGroup({ ...newGroup, groupType: e.target.value })}
                >
                  <option value="general">Général</option>
                  <option value="anxiety">Anxiété</option>
                  <option value="depression">Dépression</option>
                  <option value="stress">Stress</option>
                  <option value="wellness">Bien-être</option>
                </select>
              </div>
              <Button onClick={handleCreateGroup} className="w-full">
                Créer le groupe
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* My Groups */}
      {myGroups.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Mes groupes</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    {group.is_private ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {getGroupTypeLabel(group.group_type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.member_count}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => leaveGroup(group.id)}
                    >
                      Quitter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Groups */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Tous les groupes</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.filter(g => !g.is_member).map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  {group.is_private ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getGroupTypeLabel(group.group_type)}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {group.member_count}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => joinGroup(group.id)}
                  >
                    Rejoindre
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {groups.filter(g => !g.is_member).length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun groupe disponible</h3>
              <p className="text-muted-foreground">
                Créez le premier groupe de soutien !
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
