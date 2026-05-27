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

    const handleRemove = (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        onChange("");
    };

    const isCustomPhoto = value && value !== DEFAULT_AVATAR;

    return (
        <>
            <div className={`relative shrink-0 ${className}`}>
                <label className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-[#3f3f46] cursor-pointer block group">
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

                {isCustomPhoto && (
                    <button 
                        onClick={handleRemove}
                        type="button"
                        className="absolute -top-1 -right-1 z-20 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-600 hover:scale-110 transition-all cursor-pointer"
                        title="Remove Photo"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>

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