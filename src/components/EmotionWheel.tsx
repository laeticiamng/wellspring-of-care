import { motion } from 'framer-motion';

interface EmotionWheelProps {
  emotions: Record<string, number>;
  size?: number;
}

export function EmotionWheel({ emotions, size = 300 }: EmotionWheelProps) {
  const emotionColors: Record<string, string> = {
    joy: 'hsl(var(--primary))',
    sadness: 'hsl(221, 83%, 53%)',
    anger: 'hsl(0, 84%, 60%)',
    fear: 'hsl(280, 65%, 60%)',
    surprise: 'hsl(48, 96%, 53%)',
    disgust: 'hsl(120, 60%, 50%)',
    contempt: 'hsl(30, 70%, 50%)',
    anxiety: 'hsl(340, 80%, 55%)',
    calmness: 'hsl(180, 50%, 60%)',
  };

  const emotionEntries = Object.entries(emotions).sort(([, a], [, b]) => b - a);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {emotionEntries.map(([emotion, value], index) => {
          const angle = (index / emotionEntries.length) * 2 * Math.PI - Math.PI / 2;
          const barLength = value * radius;
          const endX = centerX + Math.cos(angle) * barLength;
          const endY = centerY + Math.sin(angle) * barLength;
          const labelX = centerX + Math.cos(angle) * (radius + 15);
          const labelY = centerY + Math.sin(angle) * (radius + 15);

          return (
            <g key={emotion}>
              <motion.line
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke={emotionColors[emotion] || 'hsl(var(--muted))'}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-foreground"
              >
                {emotion}
              </text>
            </g>
          );
        })}
        <circle
          cx={centerX}
          cy={centerY}
          r="5"
          className="fill-foreground"
        />
      </svg>
    </div>
  );
}
