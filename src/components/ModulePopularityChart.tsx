import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ModulePopularity } from '@/hooks/useProgressAnalytics';

interface ModulePopularityChartProps {
  data: ModulePopularity[];
}

export const ModulePopularityChart = ({ data }: ModulePopularityChartProps) => {
  const chartData = data.map(m => ({
    name: m.module_name,
    users: m.users_count,
    xp: m.total_xp,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modules les Plus Utilisés</CardTitle>
        <CardDescription>Classement par nombre d'utilisateurs actifs</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              className="text-sm"
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="users" 
              fill="hsl(var(--primary))" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
