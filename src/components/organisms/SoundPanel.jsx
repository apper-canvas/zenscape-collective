import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { soundService } from '@/services';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import SoundControl from '@/components/molecules/SoundControl';

function SoundPanel({ className = '' }) {
  const [sounds, setSounds] = useState([]);
  const [activeSounds, setActiveSounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadSounds();
  }, []);

  const loadSounds = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await soundService.getAll();
      setSounds(result);
    } catch (err) {
      setError(err.message || 'Failed to load sounds');
      toast.error('Failed to load sounds');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySound = async (soundId, volume) => {
    try {
      await soundService.playSound(soundId, volume);
      const sound = sounds.find(s => s.id === soundId);
      setActiveSounds(prev => [
        ...prev.filter(s => s.id !== soundId),
        { ...sound, volume, isPlaying: true }
      ]);
      toast.success(`Playing ${sound.name}`);
    } catch (err) {
      toast.error('Failed to play sound');
    }
  };

  const handlePauseSound = async (soundId) => {
    try {
      await soundService.pauseSound(soundId);
      setActiveSounds(prev => prev.filter(s => s.id !== soundId));
      const sound = sounds.find(s => s.id === soundId);
      toast.success(`Paused ${sound.name}`);
    } catch (err) {
      toast.error('Failed to pause sound');
    }
  };

  const handleVolumeChange = async (soundId, volume) => {
    try {
      await soundService.setVolume(soundId, volume);
      setActiveSounds(prev => prev.map(s => 
        s.id === soundId ? { ...s, volume } : s
      ));
    } catch (err) {
      toast.error('Failed to adjust volume');
    }
  };

  const handleStopAll = async () => {
    try {
      await soundService.stopAllSounds();
      setActiveSounds([]);
      toast.success('All sounds stopped');
    } catch (err) {
      toast.error('Failed to stop sounds');
    }
  };

  const isSoundPlaying = (soundId) => {
    return activeSounds.some(s => s.id === soundId && s.isPlaying);
  };

  const getSoundVolume = (soundId) => {
    const activeSound = activeSounds.find(s => s.id === soundId);
    return activeSound?.volume || 0.5;
  };

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-200 rounded w-32"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-surface-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-center space-y-4">
          <Text variant="body" size="sm" color="error">
            {error}
          </Text>
          <Button variant="outline" size="sm" onClick={loadSounds}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-200">
          <div className="flex items-center space-x-3">
            <Text variant="heading" size="lg" weight="semibold" color="primary">
              Ambient Sounds
            </Text>
            {activeSounds.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-success/20 text-success px-2 py-1 rounded-full"
              >
                <Text variant="caption" size="xs" weight="medium">
                  {activeSounds.length} playing
                </Text>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {activeSounds.length > 0 && (
              <Button
                variant="accent"
                size="sm"
                icon="Square"
                onClick={handleStopAll}
              >
                Stop All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={isExpanded ? 'ChevronUp' : 'ChevronDown'}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>

        {/* Active Sounds Summary */}
        {activeSounds.length > 0 && !isExpanded && (
          <div className="p-4 bg-surface-50">
            <div className="flex flex-wrap gap-2">
              {activeSounds.map((sound) => (
                <motion.div
                  key={sound.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-2 rounded-full"
                >
                  <span className="text-sm">{sound.icon}</span>
                  <Text variant="caption" size="xs" weight="medium">
                    {sound.name}
                  </Text>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 bg-success rounded-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Sound Controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {sounds.map((sound, index) => (
                  <motion.div
                    key={sound.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SoundControl
                      sound={sound}
                      isPlaying={isSoundPlaying(sound.id)}
                      volume={getSoundVolume(sound.id)}
                      onPlay={handlePlaySound}
                      onPause={handlePauseSound}
                      onVolumeChange={handleVolumeChange}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {sounds.length === 0 && !loading && (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4 opacity-50">🔇</div>
            <Text variant="body" size="sm" color="muted">
              No sounds available
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
}

export default SoundPanel;