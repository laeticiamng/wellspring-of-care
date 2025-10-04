import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LevelDistribution } from '@/hooks/useProgressAnalytics';

interface LevelDistributionChartProps {
  data: LevelDistribution[];
  moduleName?: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
];

export const LevelDistributionChart = ({ data, moduleName }: LevelDistributionChartProps) => {
  // Filter by module if specified
  const filteredData = moduleName
    ? data.filter(d => d.module_name === moduleName)
    : data;

  // Aggregate by level
  const levelMap = new Map<number, number>();
  filteredData.forEach(d => {
    const current = levelMap.get(d.level) || 0;
    levelMap.set(d.level, current + d.users_count);
  });

  const chartData = Array.from(levelMap.entries())
    .map(([level, count]) => ({
      name: `Niveau ${level}`,
      value: count,
    }))
    .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution des Niveaux</CardTitle>
        <CardDescription>
          {moduleName ? `Module: ${moduleName}` : 'Tous modules confondus'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
