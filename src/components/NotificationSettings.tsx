import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Bell, BellOff, Clock, Sparkles, TrendingUp } from "lucide-react";
import { useSmartNotifications } from "@/hooks/useSmartNotifications";
import { useState } from "react";

export const NotificationSettings = () => {
  const { 
    permission, 
    requestPermission,
    sendContextualNudge 
  } = useSmartNotifications();
  
  const [enabledTypes, setEnabledTypes] = useState({
    weeklyCard: true,
    wellness: true,
    milestones: true,
    contextual: true,
  });

  const handleToggle = (type: keyof typeof enabledTypes) => {
    setEnabledTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {permission === 'granted' ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          Notifications intelligentes
        </CardTitle>
        <CardDescription>
          Reçois des rappels personnalisés basés sur tes habitudes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demande de permission */}
        {permission !== 'granted' && (
          <div className="p-4 bg-primary/10 rounded-lg space-y-3">
            <p className="text-sm">
              Active les notifications pour recevoir des rappels intelligents et des nudges personnalisés
            </p>
            <Button onClick={requestPermission} className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Activer les notifications
            </Button>
          </div>
        )}

        {/* Types de notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Carte de la semaine
              </Label>
              <p className="text-xs text-muted-foreground">
                Rappels matinaux avec ton mantra du jour
              </p>
            </div>
            <Switch
              checked={enabledTypes.weeklyCard}
              onCheckedChange={() => handleToggle('weeklyCard')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Bien-être & tendances
              </Label>
              <p className="text-xs text-muted-foreground">
                Nudges basés sur ton état émotionnel
              </p>
            </div>
            <Switch
              checked={enabledTypes.wellness}
              onCheckedChange={() => handleToggle('wellness')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                🎉 Milestones
              </Label>
              <p className="text-xs text-muted-foreground">
                Célébrations de tes progrès
              </p>
            </div>
            <Switch
              checked={enabledTypes.milestones}
              onCheckedChange={() => handleToggle('milestones')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Rappels contextuels
              </Label>
              <p className="text-xs text-muted-foreground">
                Messages adaptés à l'heure et au jour
              </p>
            </div>
            <Switch
              checked={enabledTypes.contextual}
              onCheckedChange={() => handleToggle('contextual')}
            />
          </div>
        </div>

        {/* Test notification */}
        {permission === 'granted' && (
          <Button 
            variant="outline" 
            onClick={sendContextualNudge}
            className="w-full"
          >
            Tester les notifications
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
