import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface ManagerAction {
  id: string;
  action_type: string;
  action_description: string;
  scheduled_at: string | null;
  completed: boolean;
  completed_at: string | null;
  team_name: string;
  created_at?: string;
}

interface ManagerActionsHistoryProps {
  actions: ManagerAction[];
  onComplete: (actionId: string) => void;
}

export function ManagerActionsHistory({ actions, onComplete }: ManagerActionsHistoryProps) {
  if (!actions || actions.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground text-center">
          Aucune action planifiée pour le moment
        </p>
      </Card>
    );
  }

  const pendingActions = actions.filter(a => !a.completed);
  const completedActions = actions.filter(a => a.completed);

  return (
    <div className="space-y-6">
      {/* Pending Actions */}
      {pendingActions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Actions en cours</h3>
          <div className="space-y-2">
            {pendingActions.map(action => (
              <Card key={action.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{action.action_description}</p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">
                      Équipe : {action.team_name}
                    </p>
                    {action.scheduled_at && (
                      <div className="flex items-center gap-1 ml-6 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {new Date(action.scheduled_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onComplete(action.id)}
                  >
                    Marquer fait
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Actions */}
      {completedActions.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="completed">
            <AccordionTrigger>
              <span className="text-sm font-semibold">
                Actions complétées ({completedActions.length})
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {completedActions.map(action => (
                  <Card key={action.id} className="p-4 opacity-60">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">{action.action_description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Équipe : {action.team_name} · Complétée le{' '}
                          {action.completed_at && new Date(action.completed_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}