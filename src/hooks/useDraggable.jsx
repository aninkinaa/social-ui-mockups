import { useState, useRef } from "react";

export function useDraggable(initialScale = 1) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(initialScale);
  const [rotation, setRotation] = useState(0);

  const dragInfo = useRef({ isDragging: false, startX: 0, startY: 0 });
  const [isDraggingState, setIsDraggingState] = useState(false);

  const onPointerDown = (e) => {
    if (e.pointerType === 'touch') return;
    
    dragInfo.current = {
      isDragging: true,
      startX: e.clientX - position.x,
      startY: e.clientY - position.y
    };
    setIsDraggingState(true);
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragInfo.current.isDragging) return;
    setPosition({
      x: e.clientX - dragInfo.current.startX,
      y: e.clientY - dragInfo.current.startY
    });
  };

  const onPointerUp = (e) => {
    if (!dragInfo.current.isDragging) return;
    dragInfo.current.isDragging = false;
    setIsDraggingState(false);
    if (e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onWheel = (e) => {
    setScale((prev) => Math.min(Math.max(0.5, prev - e.deltaY * 0.005), 4));
  };

  const resetTransform = () => {
    setPosition({ x: 0, y: 0 });
    setScale(initialScale);
    setRotation(0);
  };

  const updatePosition = (axis, value) => {
    setPosition(prev => ({ ...prev, [axis]: value }));
  };

  return {
    position,
    updatePosition,
    scale,
    setScale,
    rotation,
    setRotation,
    isDragging: isDraggingState,
    handlers: { 
      onPointerDown, 
      onPointerMove, 
      onPointerUp, 
      onPointerCancel: onPointerUp, 
      onWheel 
    },
    resetTransform
  };
}