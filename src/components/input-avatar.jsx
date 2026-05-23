import React, { useState } from "react";
import AvatarCropper from "./avatar-cropper";

const DEFAULT_AVATAR = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

export default function AvatarInput({ value, onChange, className = "w-12 h-12" }) {
    const [rawImage, setRawImage] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setRawImage(event.target.result);
            reader.readAsDataURL(file);
        }
        e.target.value = null;
    };

    const handleSaveCrop = (croppedBase64) => {
        onChange(croppedBase64); 
        setRawImage(null);
    };

    return (
        <>
            <label className={`relative z-[999] shrink-0 rounded-full overflow-hidden border-2 border-[#3f3f46] cursor-pointer block group ${className}`}>
                <img
                    src={value || DEFAULT_AVATAR} 
                    alt="Avatar" 
                    className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" 
                />
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </label>

            {rawImage && (
                <AvatarCropper
                    imageSrc={rawImage}
                    onSave={handleSaveCrop}
                    onCancel={() => setRawImage(null)}
                />
            )}
        </>
    );
}