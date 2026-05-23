import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function AvatarCropper({ imageSrc, onSave, onCancel }) {
    const [mounted, setMounted] = useState(false);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (imageSrc) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                imageRef.current = img;
                setImgSize({ w: img.width, h: img.height });
                setPosition({ x: 0, y: 0 });
                setScale(1);
                draw();
            };
        }
    }, [imageSrc]);

    const size = 250;
    let maxDx = 0;
    let maxDy = 0;

    if (imgSize.w && imgSize.h) {
        const baseScale = Math.max(size / imgSize.w, size / imgSize.h);
        const finalScale = baseScale * scale;
        maxDx = Math.max(0, (imgSize.w * finalScale - size) / 2);
        maxDy = Math.max(0, (imgSize.h * finalScale - size) / 2);
    }

    useEffect(() => {
        setPosition((prev) => {
            let newX = Math.min(Math.max(prev.x, -maxDx), maxDx);
            let newY = Math.min(Math.max(prev.y, -maxDy), maxDy);

            if (newX !== prev.x || newY !== prev.y) {
                return { x: newX, y: newY };
            }
            return prev;
        });
    }, [scale, maxDx, maxDy]);

    useEffect(() => {
        draw();
    }, [scale, position]);

    const draw = () => {
        if (!imageRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = imageRef.current;

        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);

        const baseScale = Math.max(size / img.width, size / img.height);
        const finalScale = baseScale * scale;
        const drawWidth = img.width * finalScale;
        const drawHeight = img.height * finalScale;

        const dx = (size - drawWidth) / 2 + position.x;
        const dy = (size - drawHeight) / 2 + position.y;

        ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    };

    const handleSave = () => {
        if (canvasRef.current) {
            const croppedBase64 = canvasRef.current.toDataURL("image/png");
            onSave(croppedBase64);
        }
    };

    if (!mounted || !imageSrc) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-2xl w-full max-w-[340px] flex flex-col gap-5 shadow-2xl relative">
                <div>
                    <h3 className="text-white font-bold text-center text-[16px]">Adjust Profile Photo</h3>
                    <p className="text-xs text-neutral-400 text-center mt-1">Use sliders to adjust</p>
                </div>

                <div className="flex justify-center">
                    <div className="w-[250px] h-[250px] rounded-full overflow-hidden border-2 border-[#3f3f46] shadow-inner bg-black">
                        <canvas ref={canvasRef} className="block w-full h-full" />
                    </div>
                </div>

                {/* Controls Area */}
                <div className="flex flex-col gap-3">
                    {/* Zoom Slider */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-neutral-300 flex justify-between">
                            <span>Zoom</span>
                            <span>{Math.round(scale * 100)}%</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.05"
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer"
                        />
                    </div>

                    {/* X-Axis Slider (Left / Right) */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-neutral-300 flex justify-between">
                            <span>Pan Left / Right</span>
                        </label>
                        <input
                            type="range"
                            min={-maxDx}
                            max={maxDx}
                            step="1"
                            value={position.x}
                            onChange={(e) => setPosition(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                            disabled={maxDx === 0}
                            className="w-full accent-indigo-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Y-Axis Slider (Up / Down) */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-neutral-300 flex justify-between">
                            <span>Pan Up / Down</span>
                        </label>
                        <input
                            type="range"
                            min={-maxDy}
                            max={maxDy}
                            step="1"
                            value={position.y}
                            onChange={(e) => setPosition(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                            disabled={maxDy === 0}
                            className="w-full accent-indigo-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-1">
                    <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#27272a] hover:bg-[#3f3f46] transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="flex-[2] py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/30">
                        Crop & Save
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}