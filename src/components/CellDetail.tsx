import { X } from 'lucide-react';
import { Button } from './ui/button';
import { ManagerActions } from './ManagerActions';

interface CellDetailProps {
  assessment: {
    id: string;
    team_name: string;
    period_start: string;
    period_end: string;
    phrases: string[];
    hints: Record<string, any>;
    color_mood: string;
  };
  orgId: string;
  onClose: () => void;
}

export function CellDetail({ assessment, orgId, onClose }: CellDetailProps) {
  const getSuggestions = () => {
    const suggestions: string[] = [];
    
    if (assessment.hints.burnout) {
      suggestions.push('Planifier réunion courte sans agenda');
      suggestions.push('Proposer micro-pause commune 5 min');
    }
    
    if (assessment.hints.engagementLow) {
      suggestions.push('Organiser atelier collaboratif court');
      suggestions.push('Proposer challenge équipe ludique');
    }
    
    if (assessment.hints.wellbeingFragile) {
      suggestions.push('Prévoir échange informel individuel');
      suggestions.push('Partager ressources de soutien');
    }

    if (suggestions.length === 0) {
      suggestions.push('Maintenir le rythme actuel');
      suggestions.push('Célébrer les réussites collectives');
    }

    return suggestions;
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l border-border shadow-xl z-50 overflow-y-auto animate-slide-in-right">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{assessment.team_name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Period */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Période</p>
            <p className="text-sm font-medium">
              {new Date(assessment.period_start).toLocaleDateString('fr-FR')} - {new Date(assessment.period_end).toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Phrases */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Observations</h3>
            <div className="space-y-2">
              {assessment.phrases.map((phrase, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: assessment.color_mood }}
                >
                  <p className="text-sm">{phrase}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Suggestions d'actions</h3>
            <div className="space-y-2">
              {getSuggestions().map((suggestion, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-border/40 bg-card"
                >
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Manager Actions */}
          <ManagerActions
            orgId={orgId}
            teamName={assessment.team_name}
            suggestions={getSuggestions()}
          />
        </div>
      </div>
    </div>
  );
}