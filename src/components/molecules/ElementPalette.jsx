import { motion } from 'framer-motion';
import { useState } from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const categories = [
  { id: 'rock', label: 'Rocks', icon: '🗿' },
  { id: 'water', label: 'Water', icon: '💧' },
  { id: 'plant', label: 'Plants', icon: '🌿' }
];

function ElementPalette({ elements = [], onElementSelect, className = '' }) {
  const [activeCategory, setActiveCategory] = useState('rock');

  const filteredElements = elements.filter(element => element.category === activeCategory);

  const handleDragStart = (e, element) => {
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        <Text variant="heading" size="lg" weight="semibold" color="primary">
          Elements
        </Text>

        {/* Category Tabs */}
        <div className="flex space-x-1 bg-surface-200 rounded-lg p-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="flex-1 text-xs"
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Elements Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {filteredElements.map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
              onClick={() => onElementSelect?.(element)}
              className="bg-surface-200 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-surface-300 transition-colors duration-400 text-center drag-none"
            >
              <div 
                className="text-2xl mb-2"
                style={{ filter: `hue-rotate(${element.color ? 0 : 0}deg)` }}
              >
                {element.icon}
              </div>
              <Text variant="caption" size="xs" weight="medium" color="primary">
                {element.name}
              </Text>
            </motion.div>
          ))}
        </div>

        {filteredElements.length === 0 && (
          <div className="text-center py-8">
            <Text variant="body" size="sm" color="muted">
              No elements in this category
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ElementPalette;