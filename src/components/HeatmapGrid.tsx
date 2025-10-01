import { useState } from 'react';
import { HeatmapCell } from './HeatmapCell';
import { CellDetail } from './CellDetail';

interface Assessment {
  id: string;
  team_name: string;
  period_start: string;
  period_end: string;
  phrases: string[];
  hints: Record<string, any>;
  response_count: number;
  can_show: boolean;
  color_mood: string;
}

interface HeatmapGridProps {
  assessments: Assessment[];
  orgId: string;
}

export function HeatmapGrid({ assessments, orgId }: HeatmapGridProps) {
  const [selectedCell, setSelectedCell] = useState<Assessment | null>(null);

  // Group by team and period
  const teamNames = [...new Set(assessments.map(a => a.team_name))];
  const periods = [...new Set(assessments.map(a => a.period_start))].sort().reverse().slice(0, 6);

  const getAssessment = (team: string, period: string) => {
    return assessments.find(a => a.team_name === team && a.period_start === period);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header with periods */}
          <div className="flex gap-2 mb-4 pl-32">
            {periods.map(period => (
              <div key={period} className="flex-1 min-w-[180px] text-sm font-medium text-center">
                {new Date(period).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
              </div>
            ))}
          </div>

          {/* Rows for each team */}
          {teamNames.map(team => (
            <div key={team} className="flex gap-2 mb-2">
              <div className="w-32 flex items-center text-sm font-medium">
                {team}
              </div>
              {periods.map(period => {
                const assessment = getAssessment(team, period);
                return (
                  <div key={period} className="flex-1 min-w-[180px]">
                    <HeatmapCell
                      assessment={assessment}
                      onClick={() => assessment && setSelectedCell(assessment)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Side panel for cell details */}
      {selectedCell && (
        <CellDetail
          assessment={selectedCell}
          orgId={orgId}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
}