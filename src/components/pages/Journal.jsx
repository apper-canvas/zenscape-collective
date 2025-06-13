import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { journalService } from '@/services';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import SearchBar from '@/components/molecules/SearchBar';
import MoodSelector from '@/components/molecules/MoodSelector';

function Journal() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredEntries(
        entries.filter(entry =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    } else {
      setFilteredEntries(entries);
    }
  }, [entries, searchQuery]);

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await journalService.getAll();
      setEntries(result);
    } catch (err) {
      setError(err.message || 'Failed to load journal entries');
      toast.error('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWriting = () => {
    setIsWriting(true);
    setEditingEntry(null);
    resetForm();
  };

  const handleEditEntry = (entry) => {
    setIsWriting(true);
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setTags(entry.tags.join(', '));
  };

  const handleSaveEntry = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter both title and content');
      return;
    }

    setSaving(true);
    try {
      const entryData = {
        title: title.trim(),
        content: content.trim(),
        mood,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      let savedEntry;
      if (editingEntry) {
        savedEntry = await journalService.update(editingEntry.id, entryData);
        setEntries(prev => prev.map(e => e.id === editingEntry.id ? savedEntry : e));
        toast.success('Journal entry updated');
      } else {
        savedEntry = await journalService.create(entryData);
        setEntries(prev => [savedEntry, ...prev]);
        toast.success('Journal entry saved');
      }

      setIsWriting(false);
      resetForm();
    } catch (err) {
      toast.error('Failed to save journal entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId, entryTitle) => {
    if (!confirm(`Are you sure you want to delete "${entryTitle}"?`)) {
      return;
    }

    try {
      await journalService.delete(entryId);
      setEntries(prev => prev.filter(e => e.id !== entryId));
      toast.success('Journal entry deleted');
    } catch (err) {
      toast.error('Failed to delete journal entry');
    }
  };

  const handleCancel = () => {
    setIsWriting(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('neutral');
    setTags('');
    setEditingEntry(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (moodId) => {
    const moodMap = {
      peaceful: '😌',
      grateful: '🙏',
      inspired: '✨',
      mindful: '🧘',
      relieved: '😮‍💨',
      neutral: '😐',
      stressed: '😰',
      anxious: '😟'
    };
    return moodMap[moodId] || '😐';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-200 rounded w-48"></div>
          <div className="h-10 bg-surface-200 rounded w-80"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-200 rounded-lg"></div>
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
          <Button variant="primary" onClick={loadEntries}>
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
            Mindfulness Journal
          </Text>
          <Text variant="body" size="base" color="muted">
            Reflect on your thoughts and experiences
          </Text>
        </div>

        <Button
          variant="primary"
          icon="PenTool"
          onClick={handleStartWriting}
          disabled={isWriting}
        >
          {isWriting ? 'Writing...' : 'New Entry'}
        </Button>
      </motion.div>

      {/* Writing Interface */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Text variant="heading" size="lg" weight="semibold" color="primary">
                  {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
                </Text>
                <Button
                  variant="ghost"
                  icon="X"
                  onClick={handleCancel}
                  className="text-secondary hover:text-primary"
                />
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Entry title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium"
                />

                <textarea
                  placeholder="What's on your mind? Reflect on your thoughts, feelings, or experiences..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 text-base border-0 border-b-2 border-surface-300 bg-transparent focus:border-primary focus:outline-none transition-colors duration-400 placeholder-secondary/60 resize-none"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MoodSelector
                    selectedMood={mood}
                    onMoodChange={setMood}
                  />

                  <div className="space-y-2">
                    <Text variant="body" size="sm" weight="medium" color="primary">
                      Tags (optional)
                    </Text>
                    <Input
                      placeholder="meditation, gratitude, reflection..."
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="text-sm"
                    />
                    <Text variant="caption" size="xs" color="muted">
                      Separate tags with commas
                    </Text>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    icon="Save"
                    onClick={handleSaveEntry}
                    loading={saving}
                    disabled={!title.trim() || !content.trim()}
                  >
                    {editingEntry ? 'Update Entry' : 'Save Entry'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      {!isWriting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md"
        >
          <SearchBar
            placeholder="Search your journal entries..."
            onSearch={setSearchQuery}
          />
        </motion.div>
      )}

      {/* Entries List */}
      {!isWriting && (
        <AnimatePresence mode="wait">
          {filteredEntries.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="text-6xl mb-6 opacity-30"
              >
                📔
              </motion.div>
              <Text variant="heading" size="xl" color="secondary" className="mb-4">
                {searchQuery ? 'No entries found' : 'Start your mindful journey'}
              </Text>
              <Text variant="body" size="base" color="muted" className="mb-6">
                {searchQuery 
                  ? `No entries match "${searchQuery}"`
                  : 'Capture your thoughts, feelings, and insights in your personal journal'
                }
              </Text>
              {!searchQuery && (
                <Button
                  variant="primary"
                  icon="PenTool"
                  onClick={handleStartWriting}
                >
                  Write Your First Entry
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="entries"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredEntries.map((entry, index) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  index={index}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                  formatDate={formatDate}
                  getMoodEmoji={getMoodEmoji}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function JournalEntryCard({ entry, index, onEdit, onDelete, formatDate, getMoodEmoji }) {
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      <Card className="p-6 hover:shadow-zen-lg transition-all duration-400">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                <div className="flex-1 min-w-0">
                  <Text variant="heading" size="lg" weight="semibold" color="primary">
                    {entry.title}
                  </Text>
                  <Text variant="caption" size="sm" color="muted">
                    {formatDate(entry.createdAt)}
                  </Text>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex space-x-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={() => onEdit(entry)}
                    className="opacity-70 hover:opacity-100"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => onDelete(entry.id, entry.title)}
                    className="opacity-70 hover:opacity-100 text-error hover:text-error"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <Text variant="body" size="base" color="primary" className="leading-relaxed">
              {isExpanded ? entry.content : truncateContent(entry.content)}
            </Text>

            {entry.content.length > 200 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-secondary hover:text-primary"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </Button>
            )}
          </div>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  <Text variant="caption" size="xs" weight="medium">
                    #{tag}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default Journal;