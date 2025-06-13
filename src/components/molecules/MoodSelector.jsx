import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const moods = [
  { id: 'peaceful', label: 'Peaceful', emoji: '😌', color: 'bg-success/20 text-success' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏', color: 'bg-accent/20 text-accent' },
  { id: 'inspired', label: 'Inspired', emoji: '✨', color: 'bg-info/20 text-info' },
  { id: 'mindful', label: 'Mindful', emoji: '🧘', color: 'bg-primary/20 text-primary' },
  { id: 'relieved', label: 'Relieved', emoji: '😮‍💨', color: 'bg-secondary/20 text-secondary' },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-surface-300 text-surface-600' },
  { id: 'stressed', label: 'Stressed', emoji: '😰', color: 'bg-warning/20 text-warning' },
  { id: 'anxious', label: 'Anxious', emoji: '😟', color: 'bg-error/20 text-error' }
];

function MoodSelector({ selectedMood, onMoodChange, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Text variant="body" size="sm" weight="medium" color="primary">
        How are you feeling?
      </Text>
      
      <div className="grid grid-cols-4 gap-2">
        {moods.map((mood) => (
          <motion.button
            key={mood.id}
            type="button"
            onClick={() => onMoodChange(mood.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-400 ${
              selectedMood === mood.id
                ? `${mood.color} border-current shadow-zen`
                : 'bg-surface-100 border-surface-200 hover:border-surface-300 text-secondary'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-2xl mb-1">{mood.emoji}</div>
            <Text variant="caption" size="xs" weight="medium">
              {mood.label}
            </Text>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default MoodSelector;