import { useState, useRef } from "react";

export function useTextLayers() {
  const [texts, setTexts] = useState([]);
  const [inputText, setInputText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [activeTextId, setActiveTextId] = useState(null);

  const dragInfo = useRef({ isDragging: false, startX: 0, startY: 0 });

  const addText = () => {
    if (!inputText.trim()) return;
    const newId = Date.now();
    setTexts([
      ...texts,
      { id: newId, text: inputText, x: 0, y: 0, color: textColor, scale: 1, rotation: 0 },
    ]);
    setInputText("");
    setActiveTextId(newId);
  };

  const removeText = (id) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
    if (activeTextId === id) setActiveTextId(null);
  };

  const updateTextProps = (id, field, value) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const onPointerDown = (e, id) => {
    e.stopPropagation();
    setActiveTextId(id);

    if (e.pointerType === 'touch') return;

    setTexts((currentTexts) => {
      const textObj = currentTexts.find((t) => t.id === id);
      if (textObj) {
        dragInfo.current = {
          isDragging: true,
          startX: e.clientX - textObj.x,
          startY: e.clientY - textObj.y,
        };
      }
      return currentTexts;
    });

    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e, id) => {
    if (!dragInfo.current.isDragging || activeTextId !== id) return;
    
    const newX = e.clientX - dragInfo.current.startX;
    const newY = e.clientY - dragInfo.current.startY;
    
    setTexts((prevTexts) => 
      prevTexts.map((t) => (t.id === id ? { ...t, x: newX, y: newY } : t))
    );
  };

  const onPointerUp = (e) => {
    dragInfo.current.isDragging = false;
    if (e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return {
    texts,
    inputText,
    setInputText,
    textColor,
    setTextColor,
    activeTextId,
    setActiveTextId,
    addText,
    removeText,
    updateTextProps,
    handlers: { onPointerDown, onPointerMove, onPointerUp }
  };
}