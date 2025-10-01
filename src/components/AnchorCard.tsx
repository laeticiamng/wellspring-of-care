import { motion } from "framer-motion";
import { Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnchorCardProps {
  title: string;
  duration: number;
  category: string;
  onStart: () => void;
  delay?: number;
}

export function AnchorCard({ title, duration, category, onStart, delay = 0 }: AnchorCardProps) {
  const categoryColors = {
    defusion: "hsl(280, 70%, 60%)",
    acceptance: "hsl(150, 60%, 50%)",
    presence: "hsl(200, 70%, 60%)",
    values: "hsl(30, 80%, 60%)"
  };

  const color = categoryColors[category as keyof typeof categoryColors] || categoryColors.presence;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-background/30 backdrop-blur-lg border border-border/50 rounded-2xl p-6 hover:bg-background/40 transition-all"
      style={{
        boxShadow: `0 4px 20px ${color}20`
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(duration / 60)} min</span>
          </div>
        </div>
        
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ 
            background: `${color}20`,
            border: `2px solid ${color}40`
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ background: color }}
          />
        </motion.div>
      </div>

      <Button
        onClick={onStart}
        className="w-full group"
        variant="outline"
      >
        <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
        Commencer
      </Button>
    </motion.div>
  );
}