interface HeatmapCellProps {
  assessment: {
    phrases: string[];
    color_mood: string;
    can_show: boolean;
    response_count: number;
  } | undefined;
  onClick: () => void;
}

export function HeatmapCell({ assessment, onClick }: HeatmapCellProps) {
  if (!assessment || !assessment.can_show) {
    return (
      <div className="h-24 rounded-lg border border-border/40 bg-muted/20 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Données insuffisantes</p>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full h-24 rounded-lg border border-border/40 p-3 text-left transition-all hover:scale-[1.02] hover:shadow-md"
      style={{ backgroundColor: assessment.color_mood }}
      aria-label={`Analyse de l'équipe: ${assessment.phrases[0]}`}
    >
      <p className="text-sm font-medium line-clamp-2">
        {assessment.phrases[0]}
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        {assessment.response_count} réponses
      </p>
    </button>
  );
}