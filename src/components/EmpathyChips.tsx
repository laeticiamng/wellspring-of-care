import { motion } from 'framer-motion';
import { EmpathyTemplate } from '@/hooks/useCommunity';

interface EmpathyChipsProps {
  templates: EmpathyTemplate[];
  onSelect: (text: string) => void;
  selectedText?: string;
}

export const EmpathyChips = ({ templates, onSelect, selectedText }: EmpathyChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {templates.slice(0, 5).map((template, index) => (
        <motion.button
          key={template.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(template.text_fr)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
            selectedText === template.text_fr
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary/50 hover:bg-secondary text-secondary-foreground border border-border/50'
          }`}
        >
          <span>{template.emoji}</span>
          <span className="font-medium">{template.text_fr}</span>
        </motion.button>
      ))}
    </div>
  );
};
