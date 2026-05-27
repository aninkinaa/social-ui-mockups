import { useState } from "react";

export const compressImage = (file, maxSize = 1200) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > height && width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                } else if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                
                if (file.type === "image/png") {
                    resolve(canvas.toDataURL("image/png"));
                } else {
                    resolve(canvas.toDataURL("image/jpeg", 0.95));
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
};

export function usePhotoUpload(initialImage) {
    const [image, setImage] = useState(initialImage);

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const compressedBase64 = await compressImage(file);
        setImage(compressedBase64);

        e.target.value = "";
    };

    const handleClear = () => {
        setImage(""); 
    };

    return { image, setImage, handleUpload, handleClear };
}