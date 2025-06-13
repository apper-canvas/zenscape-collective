import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function GardenCanvas({ 
  elements = [], 
  onElementAdd, 
  onElementUpdate, 
  onElementRemove,
  onElementSelect,
  selectedElement = null,
  className = '' 
}) {
  const canvasRef = useRef(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const elementData = JSON.parse(e.dataTransfer.getData('application/json'));
    const rect = canvasRef.current.getBoundingClientRect();
    
    const x = (e.clientX - rect.left - pan.x) / scale;
    const y = (e.clientY - rect.top - pan.y) / scale;
    
    const newElement = {
      id: `element-${Date.now()}`,
      type: elementData.category,
      elementId: elementData.id,
      name: elementData.name,
      icon: elementData.icon,
      color: elementData.color,
      position: { x: Math.max(0, Math.min(500, x)), y: Math.max(0, Math.min(400, y)) },
      rotation: 0,
      scale: elementData.defaultScale || 1
    };
    
    onElementAdd?.(newElement);
  }, [onElementAdd, pan, scale]);

  const handleElementDragStart = (e, element) => {
    setDraggedElement(element);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleElementDrag = useCallback((element, newPosition) => {
    onElementUpdate?.(element.id, {
      ...element,
      position: {
        x: Math.max(0, Math.min(500, newPosition.x)),
        y: Math.max(0, Math.min(400, newPosition.y))
      }
    });
  }, [onElementUpdate]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`relative ${className}`}>
      <Card className="h-full min-h-[500px] overflow-hidden">
        {/* Canvas Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-200">
          <Text variant="heading" size="lg" weight="semibold" color="primary">
            Zen Garden Canvas
          </Text>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="ZoomOut"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
            />
            <Text variant="body" size="sm" color="secondary">
              {Math.round(scale * 100)}%
            </Text>
            <Button
              variant="ghost"
              size="sm"
              icon="ZoomIn"
              onClick={handleZoomIn}
              disabled={scale >= 3}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="RotateCcw"
              onClick={handleResetView}
            />
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-surface-50 to-surface-100 zen-texture">
          <div
            ref={canvasRef}
            className="w-full h-full relative cursor-crosshair"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'center center'
            }}
          >
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(74, 93, 78, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(74, 93, 78, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Garden Elements */}
            <AnimatePresence>
              {elements.map((element) => (
                <GardenElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElement?.id === element.id}
                  onDrag={handleElementDrag}
                  onSelect={() => onElementSelect?.(element)}
                  onRemove={() => onElementRemove?.(element.id)}
                />
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {elements.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center space-y-4">
                  <div className="text-6xl opacity-20">🎋</div>
                  <div>
                    <Text variant="heading" size="xl" color="secondary" className="mb-2">
                      Create Your Zen Garden
                    </Text>
                    <Text variant="body" size="sm" color="muted">
                      Drag elements from the palette to begin designing
                    </Text>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function GardenElement({ element, isSelected, onDrag, onSelect, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.position.x,
      y: e.clientY - element.position.y
    });
    onSelect();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    
    onDrag(element, newPosition);
  }, [isDragging, dragStart, element, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

// Attach global mouse events when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: element.scale || 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className={`absolute cursor-move select-none ${isSelected ? 'z-10' : 'z-0'}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        transform: `rotate(${element.rotation || 0}deg)`,
        transformOrigin: 'center center'
      }}
      onMouseDown={handleMouseDown}
      whileHover={{ scale: (element.scale || 1) * 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Element Display */}
      <div
        className={`text-4xl transition-all duration-400 ${
          isSelected ? 'ring-2 ring-primary ring-offset-2 rounded-lg' : ''
        }`}
        style={{ 
          filter: element.color ? `drop-shadow(2px 2px 4px rgba(0,0,0,0.2))` : 'none'
        }}
      >
        {element.icon}
      </div>

      {/* Selection Controls */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1"
        >
          <Button
            variant="error"
            size="sm"
            icon="Trash2"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="h-6 w-6 p-0 text-xs"
          />
        </motion.div>
      )}
    </motion.div>
  );
}

export default GardenCanvas;