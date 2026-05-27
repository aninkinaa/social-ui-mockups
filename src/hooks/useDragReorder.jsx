import { useState } from "react";

export function useDragReorder(layer) {
    const [dragIndex, setDragIndex] = useState(null);

    const handleDragStart = (e, index) => {
        setDragIndex(index);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", index);
        }
    };

    const handleDragEnter = (index) => {
        if (dragIndex === null || dragIndex === index) return;
        const newItems = [...layer.items];
        const draggedItem = newItems[dragIndex];
        newItems.splice(dragIndex, 1);
        newItems.splice(index, 0, draggedItem);
        layer.setItems(newItems);
        setDragIndex(index);
    };

    const handleDragEnd = () => setDragIndex(null);

    const moveItem = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= layer.items.length) return;
        const newItems = [...layer.items];
        const temp = newItems[index];
        newItems[index] = newItems[newIndex];
        newItems[newIndex] = temp;
        layer.setItems(newItems);
    };

    return { 
        dragIndex, 
        dragProps: (index) => ({
            draggable: true,
            onDragStart: (e) => handleDragStart(e, index),
            onDragEnter: () => handleDragEnter(index),
            onDragEnd: handleDragEnd,
            onDragOver: (e) => e.preventDefault()
        }),
        moveItem 
    };
}