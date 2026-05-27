import { useState } from "react";

export function useArrayManager(initialData) {
    const [items, setItems] = useState(initialData);
    const [activeId, setActiveId] = useState(null);

    const updateItem = (id, field, value) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const addItem = (newItemTemplate) => {
        setItems([newItemTemplate, ...items]);
    };

    const removeItem = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
        if (activeId === id) setActiveId(null);
    };

    return { items, setItems, activeId, setActiveId, updateItem, addItem, removeItem };
}

export default useArrayManager;