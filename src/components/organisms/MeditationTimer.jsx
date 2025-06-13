import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { meditationService } from '@/services';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function MeditationTimer({ className = '' }) {
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('5min');
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const presets = [
    { id: '1min', label: '1 min', duration: 60 },
    { id: '5min', label: '5 min', duration: 300 },
    { id: '10min', label: '10 min', duration: 600 },
    { id: '15min', label: '15 min', duration: 900 },
    { id: '20min', label: '20 min', duration: 1200 },
    { id: '30min', label: '30 min', duration: 1800 }
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    setIsPaused(false);
    
    // Play completion sound (simulated)
    toast.success('🔔 Meditation session complete!', {
      autoClose: 5000,
      className: 'zen-completion-toast'
    });

    // Record session
    try {
      await meditationService.recordSession({
        duration: duration,
        type: 'timer'
      });
    } catch (err) {
      console.error('Failed to record meditation session:', err);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    toast.success('Meditation session started');
  };

  const handlePause = () => {
    setIsPaused(true);
    toast.info('Meditation paused');
  };

  const handleResume = () => {
    setIsPaused(false);
    toast.success('Meditation resumed');
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(duration);
    toast.info('Timer reset');
  };

  const handlePresetChange = (preset) => {
    if (!isActive) {
      setSelectedPreset(preset.id);
      setDuration(preset.duration);
      setTimeRemaining(preset.duration);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((duration - timeRemaining) / duration) * 100;
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <Text variant="heading" size="2xl" weight="semibold" color="primary">
            Meditation Timer
          </Text>
          <Text variant="body" size="sm" color="muted" className="mt-2">
            Find your inner peace
          </Text>
        </div>

        {/* Timer Display */}
        <div className="relative">
          {/* Progress Circle */}
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-surface-200"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-primary"
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}`,
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - getProgress() / 100)}`
                }}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 45 * (1 - getProgress() / 100)
                }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                key={timeRemaining}
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <Text variant="display" size="4xl" weight="bold" color="primary">
                  {formatTime(timeRemaining)}
                </Text>
                <Text variant="caption" size="sm" color="muted">
                  {isActive ? (isPaused ? 'Paused' : 'Meditating') : 'Ready'}
                </Text>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Duration Presets */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Text variant="body" size="sm" weight="medium" color="primary" className="text-center">
              Choose Duration
            </Text>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.id}
                  variant={selectedPreset === preset.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handlePresetChange(preset)}
                  className="text-sm"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <AnimatePresence mode="wait">
            {!isActive ? (
              <motion.div
                key="start"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  icon="Play"
                  onClick={handleStart}
                  className="px-8"
                >
                  Start Meditation
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="controls"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex space-x-3"
              >
                <Button
                  variant="accent"
                  size="lg"
                  icon={isPaused ? 'Play' : 'Pause'}
                  onClick={isPaused ? handleResume : handlePause}
                  className="px-6"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon="RotateCcw"
                  onClick={handleReset}
                  className="px-6"
                >
                  Reset
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Breathing Guide */}
        {isActive && !isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="space-y-2">
              <Text variant="body" size="sm" color="primary">
                Focus on your breath
              </Text>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4,
                    ease: "easeInOut"
                  }}
                  className="w-8 h-8 bg-primary/30 rounded-full"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}

export default MeditationTimer;