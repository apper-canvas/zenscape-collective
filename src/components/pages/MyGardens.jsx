import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { gardenService } from '@/services';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';
import SearchBar from '@/components/molecules/SearchBar';

function MyGardens() {
  const [gardens, setGardens] = useState([]);
  const [filteredGardens, setFilteredGardens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadGardens();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredGardens(
        gardens.filter(garden =>
          garden.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredGardens(gardens);
    }
  }, [gardens, searchQuery]);

  const loadGardens = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await gardenService.getAll();
      setGardens(result);
    } catch (err) {
      setError(err.message || 'Failed to load gardens');
      toast.error('Failed to load gardens');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGarden = async (gardenId, gardenName) => {
    if (!confirm(`Are you sure you want to delete "${gardenName}"?`)) {
      return;
    }

    try {
      await gardenService.delete(gardenId);
      setGardens(prev => prev.filter(g => g.id !== gardenId));
      toast.success(`Deleted "${gardenName}"`);
    } catch (err) {
      toast.error('Failed to delete garden');
    }
  };

  const handleDuplicateGarden = async (gardenId, gardenName) => {
    try {
      const duplicated = await gardenService.duplicate(gardenId);
      setGardens(prev => [duplicated, ...prev]);
      toast.success(`Duplicated "${gardenName}"`);
    } catch (err) {
      toast.error('Failed to duplicate garden');
    }
  };

  const handleCreateNew = () => {
    navigate('/garden');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-200 rounded w-48"></div>
          <div className="h-10 bg-surface-200 rounded w-80"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-surface-200 rounded-lg"></div>
            ))}
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
          <Button variant="primary" onClick={loadGardens}>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <Text variant="heading" size="3xl" weight="bold" color="primary">
            My Gardens
          </Text>
          <Text variant="body" size="base" color="muted">
            Your collection of zen gardens
          </Text>
        </div>

        <Button
          variant="primary"
          icon="Plus"
          onClick={handleCreateNew}
        >
          Create New Garden
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-md"
      >
        <SearchBar
          placeholder="Search your gardens..."
          onSearch={setSearchQuery}
        />
      </motion.div>

      {/* Garden Grid */}
      <AnimatePresence mode="wait">
        {filteredGardens.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-6xl mb-6 opacity-30"
            >
              🌸
            </motion.div>
            <Text variant="heading" size="xl" color="secondary" className="mb-4">
              {searchQuery ? 'No gardens found' : 'No gardens yet'}
            </Text>
            <Text variant="body" size="base" color="muted" className="mb-6">
              {searchQuery 
                ? `No gardens match "${searchQuery}"`
                : 'Create your first zen garden to get started'
              }
            </Text>
            {!searchQuery && (
              <Button
                variant="primary"
                icon="Plus"
                onClick={handleCreateNew}
              >
                Create Your First Garden
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredGardens.map((garden, index) => (
              <GardenCard
                key={garden.id}
                garden={garden}
                index={index}
                onDelete={handleDeleteGarden}
                onDuplicate={handleDuplicateGarden}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GardenCard({ garden, index, onDelete, onDuplicate }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      <Card hover className="overflow-hidden group">
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-surface-50 to-surface-100 zen-texture overflow-hidden">
          {/* Garden Elements Preview */}
          <div className="absolute inset-0 p-4">
            {garden.elements?.slice(0, 6).map((element, i) => (
              <div
                key={element.id}
                className="absolute text-lg opacity-70 transition-all duration-600 group-hover:scale-110"
                style={{
                  left: `${(element.position?.x || 0) / 500 * 100}%`,
                  top: `${(element.position?.y || 0) / 400 * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${element.rotation || 0}deg) scale(${element.scale || 1})`,
                  transitionDelay: `${i * 0.1}s`
                }}
              >
                {element.icon || '🌿'}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-2 right-2 flex space-x-1"
              >
                <Button
                  variant="surface"
                  size="sm"
                  icon="Copy"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(garden.id, garden.name);
                  }}
                  className="opacity-90 hover:opacity-100"
                >
                </Button>
                <Button
                  variant="error"
                  size="sm"
                  icon="Trash2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(garden.id, garden.name);
                  }}
                  className="opacity-90 hover:opacity-100"
                >
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Element Count Badge */}
          <div className="absolute bottom-2 left-2">
            <div className="bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
              <Text variant="caption" size="xs" color="white">
                {garden.elements?.length || 0} elements
              </Text>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <Text variant="heading" size="lg" weight="semibold" color="primary">
              {garden.name}
            </Text>
            <Text variant="caption" size="sm" color="muted">
              Created {formatDate(garden.createdAt)}
            </Text>
          </div>

          {/* Sounds */}
          {garden.sounds && garden.sounds.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {garden.sounds.slice(0, 3).map((soundId) => (
                <div
                  key={soundId}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  <Text variant="caption" size="xs">
                    🔊 {soundId.replace('-', ' ')}
                  </Text>
                </div>
              ))}
              {garden.sounds.length > 3 && (
                <div className="bg-surface-200 text-secondary px-2 py-1 rounded-full">
                  <Text variant="caption" size="xs">
                    +{garden.sounds.length - 3} more
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default MyGardens;