import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from 'lucide-react';
import { useTeamAggregate } from '@/hooks/useTeamAggregate';

interface ManagerActionsProps {
  orgId: string;
  teamName: string;
  suggestions: string[];
}

export function ManagerActions({ orgId, teamName, suggestions }: ManagerActionsProps) {
  const { scheduleAction } = useTeamAggregate(orgId);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [customAction, setCustomAction] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  const handleSchedule = () => {
    const description = selectedSuggestion || customAction;
    if (!description.trim()) return;

    scheduleAction({
      teamName,
      actionType: selectedSuggestion ? 'suggestion' : 'custom',
      description,
      scheduledAt: scheduledDate || undefined
    });

    // Reset form
    setSelectedSuggestion('');
    setCustomAction('');
    setScheduledDate('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Planifier une action</h3>

      {/* Quick actions from suggestions */}
      <div className="space-y-2">
        {suggestions.slice(0, 2).map((suggestion, i) => (
          <Button
            key={i}
            variant={selectedSuggestion === suggestion ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start text-left h-auto py-2"
            onClick={() => setSelectedSuggestion(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      {/* Custom action */}
      <div className="space-y-2">
        <Label htmlFor="custom-action" className="text-sm">Ou action personnalisée</Label>
        <Input
          id="custom-action"
          placeholder="Décrire l'action..."
          value={customAction}
          onChange={(e) => {
            setCustomAction(e.target.value);
            setSelectedSuggestion('');
          }}
        />
      </div>

      {/* Schedule date */}
      <div className="space-y-2">
        <Label htmlFor="schedule-date" className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Programmer (optionnel)
        </Label>
        <Input
          id="schedule-date"
          type="date"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
        />
      </div>

      <Button
        onClick={handleSchedule}
        disabled={!selectedSuggestion && !customAction.trim()}
        className="w-full"
      >
        Planifier l'action
      </Button>
    </div>
  );
}