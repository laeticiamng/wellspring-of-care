import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserProgressStats } from '@/hooks/useProgressAnalytics';
import { Trophy, Medal, Award } from 'lucide-react';

interface TopUsersTableProps {
  users: UserProgressStats[];
}

export const TopUsersTable = ({ users }: TopUsersTableProps) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground">#{index + 1}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Utilisateurs</CardTitle>
        <CardDescription>Classement par XP total (Top 10)</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rang</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead className="text-right">XP Total</TableHead>
              <TableHead className="text-right">Niveau Moy.</TableHead>
              <TableHead className="text-right">Modules</TableHead>
              <TableHead className="text-right">Dernière Activité</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.user_id}>
                <TableCell className="font-medium">
                  {getRankIcon(index)}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-muted-foreground">
                    {user.user_id.slice(0, 8)}...
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">
                    {user.total_xp.toLocaleString()} XP
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-medium">
                    Nv. {Math.round(user.average_level * 10) / 10}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">
                    {user.modules_count} module{user.modules_count > 1 ? 's' : ''}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {formatDate(user.last_activity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
