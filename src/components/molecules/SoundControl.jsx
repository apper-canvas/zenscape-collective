import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';

function SoundControl({ sound, isPlaying = false, volume = 0.5, onPlay, onPause, onVolumeChange }) {
  const [localVolume, setLocalVolume] = useState(volume);

  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setLocalVolume(newVolume);
    onVolumeChange?.(sound.id, newVolume);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      onPause?.(sound.id);
    } else {
      onPlay?.(sound.id, localVolume);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* Sound Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{sound.icon}</div>
            <div>
              <Text variant="body" size="sm" weight="medium" color="primary">
                {sound.name}
              </Text>
              <Text variant="caption" size="xs" color="muted">
                {sound.description}
              </Text>
            </div>
          </div>
          
          <Button
            variant={isPlaying ? 'accent' : 'primary'}
            size="sm"
            icon={isPlaying ? 'Pause' : 'Play'}
            onClick={handleTogglePlay}
            className="flex-shrink-0"
          />
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Text variant="caption" size="xs" color="secondary">
              Volume
            </Text>
            <Text variant="caption" size="xs" color="primary">
              {Math.round(localVolume * 100)}%
            </Text>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localVolume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #4A5D4E 0%, #4A5D4E ${localVolume * 100}%, #E0D7C8 ${localVolume * 100}%, #E0D7C8 100%)`
              }}
            />
          </div>
        </div>

        {/* Playing Indicator */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-success"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 bg-success rounded-full"
            />
            <Text variant="caption" size="xs" color="success">
              Playing
            </Text>
          </motion.div>
        )}
      </div>
    </Card>
  );
}

export default SoundControl;