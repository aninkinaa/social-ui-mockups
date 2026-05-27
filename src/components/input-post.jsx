import React, { useState } from "react";
import AvatarCropper from "./avatar-cropper"; 

export default function InputPost({ value, onChange, className = "w-full aspect-[130/171]" }) {
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
        e.stopPropagation(); // Biar pas klik remove, gak ngebuka galeri
        onChange(""); 
    };

    return (
        <>
            {/* Tambahin overflow-hidden di container terluar biar bar remove-nya rapi di bawah */}
            <div className={`relative shrink-0 overflow-hidden rounded-md border-2 border-[#3f3f46] group ${className}`}>
                
                <label className="relative z-10 w-full h-full cursor-pointer block bg-[#27272a] hover:bg-[#3f3f46] transition-colors">
                    {value ? (
                        <img
                            src={value} 
                            alt="Post" 
                            className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </label>

                {value && (
                    <button 
                        onClick={handleRemove}
                        type="button"
                        className="absolute bottom-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-sm text-neutral-300 hover:bg-red-500 hover:text-white py-1.5 text-[10px] font-bold flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
                        title="Remove Photo"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Remove
                    </button>
                )}
            </div>

            {rawImage && (
                <AvatarCropper
                    imageSrc={rawImage}
                    onSave={handleSaveCrop}
                    onCancel={() => setRawImage(null)}
                    cropWidth={260}
                    cropHeight={342}
                    isCircular={false}
                />
            )}
        </>
    );
}