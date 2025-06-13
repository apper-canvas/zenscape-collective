import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { meditationService } from '@/services';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';
import MeditationTimer from '@/components/organisms/MeditationTimer';

function Meditation() {
  const [sessions, setSessions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('timer');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sessionsResult, historyResult] = await Promise.all([
        meditationService.getAllSessions(),
        meditationService.getHistory()
      ]);
      setSessions(sessionsResult);
      setHistory(historyResult);
    } catch (err) {
      setError(err.message || 'Failed to load meditation data');
      toast.error('Failed to load meditation data');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalMeditationTime = () => {
    return history.reduce((total, session) => total + session.duration, 0);
  };

  const getSessionsThisWeek = () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return history.filter(session => new Date(session.completedAt) > oneWeekAgo).length;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-200 rounded w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-surface-200 rounded-lg"></div>
            <div className="h-96 bg-surface-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <Text variant="heading" size="xl" color="error">
            Something went wrong
          </Text>
          <Text variant="body" size="base" color="muted">
            {error}
          </Text>
          <Button variant="primary" onClick={loadData}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <Text variant="heading" size="3xl" weight="bold" color="primary">
          Meditation
        </Text>
        <Text variant="body" size="base" color="muted">
          Find inner peace through mindful practice
        </Text>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="p-4 text-center">
          <Text variant="heading" size="2xl" weight="bold" color="primary">
            {formatDuration(getTotalMeditationTime())}
          </Text>
          <Text variant="caption" size="sm" color="muted">
            Total meditation time
          </Text>
        </Card>
        
        <Card className="p-4 text-center">
          <Text variant="heading" size="2xl" weight="bold" color="accent">
            {history.length}
          </Text>
          <Text variant="caption" size="sm" color="muted">
            Sessions completed
          </Text>
        </Card>
        
        <Card className="p-4 text-center">
          <Text variant="heading" size="2xl" weight="bold" color="success">
            {getSessionsThisWeek()}
          </Text>
          <Text variant="caption" size="sm" color="muted">
            Sessions this week
          </Text>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <MeditationTimer />
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Guided Sessions */}
          <Card className="p-4">
            <Text variant="heading" size="lg" weight="semibold" color="primary" className="mb-4">
              Guided Sessions
            </Text>
            
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-surface-200 rounded-lg hover:bg-surface-300 transition-colors duration-400 cursor-pointer"
                >
                  <div>
                    <Text variant="body" size="sm" weight="medium" color="primary">
                      {session.name}
                    </Text>
                    <Text variant="caption" size="xs" color="muted">
                      {formatDuration(session.duration)} • {session.type}
                    </Text>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Play"
                    onClick={() => toast.info('Guided sessions coming soon!')}
                  />
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Recent History */}
          <Card className="p-4">
            <Text variant="heading" size="lg" weight="semibold" color="primary" className="mb-4">
              Recent Sessions
            </Text>
            
            {history.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2 opacity-30">🧘</div>
                <Text variant="body" size="sm" color="muted">
                  No sessions yet
                </Text>
                <Text variant="caption" size="xs" color="muted">
                  Start your first meditation above
                </Text>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.slice(0, 10).map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-2 border-b border-surface-200 last:border-b-0"
                  >
                    <div>
                      <Text variant="body" size="sm" weight="medium" color="primary">
                        {formatDuration(session.duration)}
                      </Text>
                      <Text variant="caption" size="xs" color="muted">
                        {formatDate(session.completedAt)}
                      </Text>
                    </div>
                    <div className="text-success">
                      <Text variant="caption" size="xs">
                        ✓ Completed
                      </Text>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default Meditation;