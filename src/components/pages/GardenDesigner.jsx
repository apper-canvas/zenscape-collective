import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { gardenService, elementService } from '@/services';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';
import ElementPalette from '@/components/molecules/ElementPalette';
import GardenCanvas from '@/components/organisms/GardenCanvas';
import SoundPanel from '@/components/organisms/SoundPanel';

function GardenDesigner() {
  const [elements, setElements] = useState([]);
  const [gardenElements, setGardenElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [gardenName, setGardenName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadElements();
  }, []);

  const loadElements = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await elementService.getAll();
      setElements(result);
    } catch (err) {
      setError(err.message || 'Failed to load elements');
      toast.error('Failed to load elements');
    } finally {
      setLoading(false);
    }
  };

  const handleElementAdd = (element) => {
    setGardenElements(prev => [...prev, element]);
    toast.success(`Added ${element.name} to garden`);
  };

  const handleElementUpdate = (elementId, updatedElement) => {
    setGardenElements(prev => 
      prev.map(el => el.id === elementId ? updatedElement : el)
    );
  };

  const handleElementRemove = (elementId) => {
    const element = gardenElements.find(el => el.id === elementId);
    setGardenElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElement(null);
    toast.success(`Removed ${element?.name || 'element'} from garden`);
  };

  const handleElementSelect = (element) => {
    setSelectedElement(element);
  };

  const handleSaveGarden = async () => {
    if (!gardenName.trim()) {
      toast.error('Please enter a garden name');
      return;
    }

    if (gardenElements.length === 0) {
      toast.error('Please add at least one element to your garden');
      return;
    }

    setSaving(true);
    try {
      await gardenService.create({
        name: gardenName,
        elements: gardenElements.map(el => ({
          id: el.id,
          type: el.type,
          elementId: el.elementId,
          position: el.position,
          rotation: el.rotation || 0,
          scale: el.scale || 1
        }))
      });
      
      toast.success('Garden saved successfully!');
      setGardenName('');
    } catch (err) {
      toast.error('Failed to save garden');
    } finally {
      setSaving(false);
    }
  };

  const handleClearGarden = () => {
    setGardenElements([]);
    setSelectedElement(null);
    toast.info('Garden cleared');
  };

  const handleNewGarden = () => {
    setGardenElements([]);
    setSelectedElement(null);
    setGardenName('');
    toast.info('Started new garden');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-200 rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 h-96 bg-surface-200 rounded-lg"></div>
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
          <Button variant="primary" onClick={loadElements}>
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
            Garden Designer
          </Text>
          <Text variant="body" size="base" color="muted">
            Create your personal zen sanctuary
          </Text>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Trash2"
            onClick={handleClearGarden}
            disabled={gardenElements.length === 0}
          >
            Clear
          </Button>
          <Button
            variant="secondary"
            icon="Plus"
            onClick={handleNewGarden}
          >
            New Garden
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Garden Canvas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-3"
        >
          <GardenCanvas
            elements={gardenElements}
            selectedElement={selectedElement}
            onElementAdd={handleElementAdd}
            onElementUpdate={handleElementUpdate}
            onElementRemove={handleElementRemove}
            onElementSelect={handleElementSelect}
            className="h-full min-h-[500px]"
          />
        </motion.div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Element Palette */}
          <ElementPalette
            elements={elements}
            onElementSelect={handleElementAdd}
          />

          {/* Save Garden */}
          <div className="bg-surface-100 rounded-lg p-4 space-y-4">
            <Text variant="heading" size="lg" weight="semibold" color="primary">
              Save Garden
            </Text>
            
            <Input
              placeholder="Enter garden name..."
              value={gardenName}
              onChange={(e) => setGardenName(e.target.value)}
              className="w-full"
            />
            
            <Button
              variant="primary"
              icon="Save"
              onClick={handleSaveGarden}
              loading={saving}
              disabled={!gardenName.trim() || gardenElements.length === 0}
              className="w-full"
            >
              Save Garden
            </Button>

            <div className="text-center pt-2 border-t border-surface-200">
              <Text variant="caption" size="xs" color="muted">
                {gardenElements.length} element{gardenElements.length !== 1 ? 's' : ''} in garden
              </Text>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sound Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SoundPanel />
      </motion.div>
    </div>
  );
}

export default GardenDesigner;