import { motion } from 'framer-motion';
import { Sparkles, Wind, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HelpsListProps {
  helps: string[];
}

const helpIcons: Record<string, any> = {
  'Respiration': Wind,
  'Musique': Sparkles,
  'Journal': BookOpen,
};

const helpRoutes: Record<string, string> = {
  'Respiration 60s quand ça monte': '/breathwork',
  'Respiration 60s ce soir': '/breathwork',
  'Musique ambient 2 min après 22h': '/music-therapy',
  'Journal 1 phrase post-repas': '/journal/new',
};

export function HelpsList({ helps = [] }: HelpsListProps) {
  const navigate = useNavigate();

  const getIcon = (help: string) => {
    const key = Object.keys(helpIcons).find(k => help.includes(k));
    return key ? helpIcons[key] : Sparkles;
  };

  const getRoute = (help: string) => {
    return helpRoutes[help] || '/dashboard';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-foreground">
        3 petites choses qui aident
      </h3>

      <div className="space-y-3">
        {helps.slice(0, 3).map((help, index) => {
          const Icon = getIcon(help);
          const route = getRoute(help);

          return (
            <motion.button
              key={help}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(route)}
              className="
                w-full p-4 rounded-lg
                bg-card border border-border
                hover:bg-accent hover:border-accent-foreground/20
                transition-all duration-200
                flex items-center gap-4
                text-left
              "
            >
              <div className="
                p-2 rounded-full
                bg-primary/10 text-primary
              ">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-card-foreground">
                {help}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
