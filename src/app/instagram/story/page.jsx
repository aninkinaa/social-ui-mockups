"use client";
import { useState, useRef, useEffect } from "react";
import StatusBar from "@/components/status-bar";
import ControlPanel from "./control-panel";
import { useExport } from "@/hooks/useExport";
import { useDraggable } from "@/hooks/useDraggable";
import { useTextLayers } from "@/hooks/useTextLayers";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { initialHeader, initialAddon, initialFloatingComment, initialStoryComment, initialStatusBar } from "@/data/instagram";

const DEFAULT_PROFILE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

export default function IGStory() {
    const bgEditor = useDraggable(1);
    const profileEditor = useDraggable(1);
    const textEditor = useTextLayers();

    const { downloadImage, isExporting } = useExport();

    // === GROUPED STATES ===
    const [deviceSettings, setDeviceSettings] = useState(initialStatusBar);
    const [header, setHeader] = useState(initialHeader);
    const [addon, setAddon] = useState(initialAddon);
    const [comment, setComment] = useState(initialFloatingComment);

    const [isEditingBg, setIsEditingBg] = useState(false);
    const [bgGradient, setBgGradient] = useState("linear-gradient(to bottom, #1a1a1a, #1a1a1a)");

    // === PHOTO UPLOAD HOOKS ===
    const bgPhoto = usePhotoUpload("");
    const profilePhoto = usePhotoUpload(DEFAULT_PROFILE);
    const viewerPhoto = usePhotoUpload(DEFAULT_PROFILE);
    const repostPhoto = usePhotoUpload(DEFAULT_PROFILE);
    const user1Photo = usePhotoUpload(DEFAULT_PROFILE);
    const user2Photo = usePhotoUpload(DEFAULT_PROFILE);

    // === REFS ===
    const fileInputRef = useRef(null);
    const phoneFrameRef = useRef(null);

    // === COMMENT SHEET ===
    const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
    const [storyComments, setStoryComments] = useState(initialStoryComment);
    const [activeCommentId, setActiveCommentId] = useState(null);

    const handleAddStoryComment = () => {
        setStoryComments(prev => [
            ...prev,
            { id: Date.now(), username: "username", text: "New comment", isAuthor: false, avatar: DEFAULT_PROFILE }
        ]);
    };
    const updateStoryComment = (id, field, value) => {
        setStoryComments(prev => prev.map(c => (c.id === id ? { ...c, [field]: value } : c)));
    };
    const removeStoryComment = (id) => {
        setStoryComments(prev => prev.filter(c => c.id !== id));
    };

    const handleExportClick = async (format) => {
        if (isExporting || !phoneFrameRef.current) return;
        await downloadImage(phoneFrameRef, format, `igs-${header.username || "story"}`, "server");
    };

    const [isStandalone, setIsStandalone] = useState(false);
    const [mobileTab, setMobileTab] = useState("preview");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
                setIsStandalone(true);
            }
        }
    }, []);

    useEffect(() => {
        if (header.currentStory > header.storyCount) {
            setHeader(prev => ({ ...prev, currentStory: prev.storyCount }));
        }
    }, [header.storyCount, header.currentStory]);

    useEffect(() => {
        if (!bgPhoto.image) {
            setBgGradient("linear-gradient(to bottom, #1a1a1a, #1a1a1a)");
            return;
        }

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = bgPhoto.image;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const w = 64;
            const h = 64;
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });

            ctx.drawImage(img, 0, 0, w, h);

            const getDominant = (sy, sh) => {
                const imgData = ctx.getImageData(0, sy, w, sh).data;
                const counts = {};
                let maxCount = 0;
                let domColor = { r: 26, g: 26, b: 26 };

                for (let i = 0; i < imgData.length; i += 4) {
                    const r = imgData[i];
                    const g = imgData[i + 1];
                    const b = imgData[i + 2];

                    const qR = Math.round(r / 24) * 24;
                    const qG = Math.round(g / 24) * 24;
                    const qB = Math.round(b / 24) * 24;
                    const key = `${qR},${qG},${qB}`;

                    counts[key] = (counts[key] || 0) + 1;

                    if (counts[key] > maxCount) {
                        maxCount = counts[key];
                        domColor = { r, g, b };
                    }
                }
                return `rgb(${domColor.r}, ${domColor.g}, ${domColor.b})`;
            };

            const colorTop = getDominant(0, Math.floor(h * 0.25));
            const colorBottom = getDominant(Math.floor(h * 0.75), Math.floor(h * 0.25));

            setBgGradient(`linear-gradient(to bottom, ${colorTop}, ${colorBottom})`);
        };
    }, [bgPhoto.image]);

    const renderStoryText = (text) => {
        if (!text) return null;
        const parts = text.split(/(@[\w._]+)/g);
        return parts.map((part, i) =>
            part.startsWith("@") ? <span key={i} className="underline underline-offset-[3px] decoration-2">{part}</span> : <span key={i}>{part}</span>
        );
    };

    const renderCommentText = (text) => {
        if (!text) return null;
        const parts = text.split(/(@[\w._]+)/g);
        return parts.map((part, i) =>
            part.startsWith("@") ? <span key={i} className="text-[#7EA2FF] text-shadow-2xs">{part}</span> : <span key={i}>{part}</span>
        );
    };

    const renderTextEditorSliders = () => {
        if (textEditor.activeTextId === null || isEditingBg) return null;
        const activeText = textEditor.texts.find(t => t.id === textEditor.activeTextId);
        if (!activeText) return null;

        return (
            <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 z-50 w-[90%] bg-black/70 backdrop-blur-md px-5 py-4 rounded-3xl flex flex-col gap-4 shadow-xl border border-white/10 export-hide">
                <div className="flex items-center gap-3 w-full">
                    <svg className="w-5 h-5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    <input type="range" min="0.5" max="4" step="0.05" value={activeText.scale} onChange={(e) => textEditor.updateTextProps(activeText.id, 'scale', parseFloat(e.target.value))} className="flex-1 h-1.5 bg-[#3f3f46] rounded-lg appearance-none cursor-pointer accent-white touch-none" />
                    <span className="text-white/80 text-[11px] font-medium w-9 text-right shrink-0">{Math.round(activeText.scale * 100)}%</span>
                </div>
                <div className="flex items-center gap-3 w-full">
                    <svg className="w-5 h-5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    <input type="range" min="-180" max="180" step="1" value={activeText.rotation} onChange={(e) => textEditor.updateTextProps(activeText.id, 'rotation', parseFloat(e.target.value))} className="flex-1 h-1.5 bg-[#3f3f46] rounded-lg appearance-none cursor-pointer accent-white touch-none" />
                    <button onClick={() => textEditor.updateTextProps(activeText.id, 'rotation', 0)} className="text-black bg-white hover:bg-gray-200 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">0°</button>
                </div>
                <div className="flex md:hidden items-center gap-3 w-full">
                    <svg className="w-5 h-5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" /></svg>
                    <input type="range" min="-200" max="200" step="1" value={activeText.x} onChange={(e) => textEditor.updateTextProps(activeText.id, 'x', parseFloat(e.target.value))} className="flex-1 h-1.5 bg-[#3f3f46] rounded-lg appearance-none cursor-pointer accent-white touch-none" />
                    <button onClick={() => textEditor.updateTextProps(activeText.id, 'x', 0)} className="text-black bg-white hover:bg-gray-200 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">0</button>
                </div>
                <div className="flex md:hidden items-center gap-3 w-full">
                    <svg className="w-5 h-5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16M12 4l-4 4M12 4l4 4M12 20l-4-4M12 20l4-4" /></svg>
                    <input type="range" min="-400" max="400" step="1" value={activeText.y} onChange={(e) => textEditor.updateTextProps(activeText.id, 'y', parseFloat(e.target.value))} className="flex-1 h-1.5 bg-[#3f3f46] rounded-lg appearance-none cursor-pointer accent-white touch-none" />
                    <button onClick={() => textEditor.updateTextProps(activeText.id, 'y', 0)} className="text-black bg-white hover:bg-gray-200 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">0</button>
                </div>
            </div>
        );
    };

    return (
        <div className={`bg-[#09090b] min-h-screen w-full flex flex-col xl:flex-row font-sans overflow-x-hidden relative`}>

            {/* === MOBILE TABS === */}
            <div className="xl:hidden w-full fixed top-0 z-[100] bg-[#18181b] flex p-2 gap-2 shadow-md border-b border-[#27272a]">
                <button onClick={() => setMobileTab("preview")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mobileTab === "preview" ? 'bg-indigo-600 text-white' : 'bg-[#27272a] text-gray-400'}`}>Preview Result</button>
                <button onClick={() => setMobileTab("edit")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mobileTab === "edit" ? 'bg-indigo-600 text-white' : 'bg-[#27272a] text-gray-400'}`}>Edit Data</button>
            </div>

            {/* === PHONE FRAME === */}
            <div className={`flex-1 w-full justify-center items-center min-h-screen pt-[65px] xl:pt-10 pb-24 xl:pb-10 ${mobileTab === "preview" ? 'flex' : 'hidden xl:flex'}`}>

                <div ref={phoneFrameRef} className={isStandalone ? "w-full h-[100dvh] bg-[#0F0F0F] flex flex-col overflow-hidden relative" : "w-[393px] max-w-[100vw] h-[852px] bg-[#0F0F0F] flex flex-col overflow-hidden relative shadow-2xl ring-1 ring-white/10 sm:rounded-[40px] shrink-0 my-auto"}>

                    <div className="relative z-[110] w-full shrink-0 pointer-events-none">
                        <StatusBar
                            showDynamicIsland={deviceSettings.showDynamicIsland}
                            timeText={deviceSettings.timeText}
                            batteryLevel={deviceSettings.batteryLevel}
                            signalBars={deviceSettings.signalBars || 4}
                            waveColor={deviceSettings.diWaveColor}
                            theme="dark"
                            image={deviceSettings.diPhotoUrl}
                        />
                    </div>

                    <div className="flex-1 w-full px-0 relative overflow-hidden z-10">
                        <div
                            className={`w-full h-full rounded-[10px] overflow-hidden relative z-10 transition-colors duration-500 ${isEditingBg ? 'touch-none' : ''}`}
                            style={{ background: bgGradient }}
                        >

                            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                                <div className="w-full h-full absolute inset-0 transition-none z-10 pointer-events-auto" style={{ transform: `translate(${bgEditor.position.x}px, ${bgEditor.position.y}px) rotate(${bgEditor.rotation}deg) scale(${bgEditor.scale})`, transformOrigin: "center" }}>
                                    {bgPhoto.image && <img src={bgPhoto.image} alt="Story Background" draggable={false} className="w-full h-full object-contain" style={{ cursor: isEditingBg ? (bgEditor.isDragging ? 'grabbing' : 'grab') : 'default' }} {...(isEditingBg ? bgEditor.handlers : {})} />}
                                </div>
                            </div>

                            {textEditor.texts.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        transform: `translate(calc(-50% + ${item.x}px), calc(-50% + ${item.y}px)) scale(${item.scale}) rotate(${item.rotation}deg)`,
                                        color: item.color, top: '50%', left: '50%', transformOrigin: 'center'
                                    }}
                                    className={`absolute z-40 font-bold text-[22px] leading-[1.2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-[340px] text-center whitespace-pre-wrap break-words 
                                        ${textEditor.activeTextId === item.id ? 'border border-white/50 cursor-grabbing bg-black/10 rounded-lg p-2 touch-none' : 'cursor-grab'}
                                    `}
                                    onPointerDown={(e) => textEditor.handlers.onPointerDown(e, item.id)}
                                    onPointerMove={(e) => textEditor.handlers.onPointerMove(e, item.id)}
                                    onPointerUp={textEditor.handlers.onPointerUp}
                                    onPointerCancel={textEditor.handlers.onPointerUp}
                                >
                                    {renderStoryText(item.text)}
                                </div>
                            ))}

                            <div className={`absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center export-hide ${isEditingBg ? 'flex' : 'hidden'}`}>
                                <div className="border border-white/30 w-full h-full absolute inset-0 flex">
                                    <div className="border-r border-white/20 w-1/3 h-full"></div>
                                    <div className="border-r border-white/20 w-1/3 h-full"></div>
                                    <div className="border-t border-white/20 w-full h-1/3 absolute top-1/3 left-0"></div>
                                    <div className="border-t border-white/20 w-full h-1/3 absolute top-2/3 left-0"></div>
                                </div>
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>

                            <div className={`absolute top-[80px] left-1/2 -translate-x-1/2 z-30 export-hide ${isEditingBg ? 'block' : 'hidden'}`}>
                                <button onClick={() => setIsEditingBg(false)} className="bg-white text-black px-8 py-2.5 rounded-full font-bold shadow-lg hover:bg-gray-200 transition-colors">✔ Done</button>
                            </div>

                            <div className={`absolute top-[80px] left-1/2 -translate-x-1/2 z-50 export-hide ${textEditor.activeTextId !== null && !isEditingBg ? 'block' : 'hidden'}`}>
                                <button onClick={() => textEditor.setActiveTextId(null)} className="bg-white text-black px-8 py-2.5 rounded-full font-bold shadow-lg hover:bg-gray-200 transition-colors">✔ Done</button>
                            </div>

                            <div className={`absolute bottom-[20px] left-1/2 -translate-x-1/2 z-30 w-[90%] bg-black/70 backdrop-blur-md px-5 py-4 rounded-3xl flex flex-col gap-4 shadow-xl border border-white/10 export-hide ${isEditingBg ? 'flex' : 'hidden'}`}>
                                <div className="flex items-center gap-3 w-full">
                                    <svg className="w-5 h-5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    <input type="range" min="0.5" max="4" step="0.05" value={bgEditor.scale} onChange={(e) => bgEditor.setScale(parseFloat(e.target.value))} className="flex-1 h-1.5 bg-[#3f3f46] rounded-lg appearance-none cursor-pointer accent-white touch-none" />
                                    <span className="text-white/80 text-[11px] font-medium w-9 text-right shrink-0">{Math.round(bgEditor.scale * 100)}%</span>
                                </div>
                                <div className="flex items-center gap-3 w-full">
                                    <svg className="w-5 h-5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    <input type="range" min="-180" max="180" step="1" value={bgEditor.rotation} onChange={(e) => bgEditor.setRotation(parseFloat(e.target.value))} className="flex-1 h-1.5 bg-[#3f3f46] rounded-lg appearance-none cursor-pointer accent-white touch-none" />
                                    <button onClick={() => bgEditor.setRotation(0)} className="text-black bg-white hover:bg-gray-200 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">0°</button>
                                </div>
                            </div>

                            {renderTextEditorSliders()}

                            <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-20 ${isEditingBg ? 'hidden export-show' : 'block'}`}></div>
                            <div className={`absolute top-0 inset-x-0 pt-1.5 px-3 flex flex-col gap-1.5 z-30 ${isEditingBg ? 'hidden export-show' : 'flex'}`}>
                                <div className="flex gap-1 w-full">
                                    {Array.from({ length: header.storyCount }).map((_, index) => (
                                        <div key={index} className={`h-[2px] rounded-full flex-1 transition-colors duration-300 ${index < header.currentStory ? 'bg-white' : 'bg-white/40'}`}></div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3 p-0">
                                        <div className="w-[32px] h-[32px] rounded-full overflow-hidden p-0 shrink-0 bg-neutral-800 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto" {...profileEditor.handlers}>
                                            <img src={profilePhoto.image || DEFAULT_PROFILE } alt="Avatar" className="w-full h-full object-cover transition-transform duration-200" style={{ transform: `scale(${profileEditor.scale}) translate(${profileEditor.position.x}px, ${profileEditor.position.y}px)` }} draggable={false} />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <div className="flex items-center gap-2 drop-shadow-md leading-none">
                                                <span className="text-white font-semibold text-[14px]">{header.username || "username"}</span>
                                                <span className="text-white/70 text-[13px] font-medium">{header.postedTime}</span>
                                            </div>
                                            {addon.mode === 'music' && (
                                                <div className="flex text-[12px] text-white/95 drop-shadow-md gap-1.5 items-center mt-[1px]">
                                                    <div className="flex gap-0.5 items-center">
                                                        <div className="w-0.5 h-2 bg-white rounded-lg"></div>
                                                        <div className="w-0.5 h-1 bg-white rounded-lg"></div>
                                                        <div className="w-0.5 h-2 bg-white rounded-lg pr-0.5"></div>
                                                    </div>
                                                    <span className="font-semibold">{addon.musicArtist}</span>
                                                    <div className="w-0.5 h-0.5 items-center bg-white rounded-full"></div>
                                                    <span className="flex items-center gap-0.5">{addon.musicTitle}
                                                        <span className="flex items-center ml-0.5">
                                                            <svg className="w-[10px] h-[10px] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </span>
                                                    </span>
                                                </div>
                                            )}
                                            {addon.mode === 'repost' && (
                                                <div className="flex text-[12px] text-white drop-shadow-md gap-1.5 items-center mt-[1px]">
                                                    <svg className="w-[12px] h-[12px]" fill="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z" />
                                                    </svg>
                                                    <img src={repostPhoto.image} className="w-[12.5px] h-[12.5px] rounded-full" />
                                                    <span className="font-semibold text-[12px]">{addon.repostUsername}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-white drop-shadow-md items-center">

                                        {header.isCF && (
                                            <div className="flex bg-[#00d535] items-center h-[25px] px-2 rounded-full gap-0.5">
                                                <svg aria-label="Close friends icon" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16">
                                                    <title>Close friends icon</title>
                                                    <path d="M18.18 22.51a.99.99 0 0 1-.513-.142L12 18.975l-5.667 3.393a1 1 0 0 1-1.492-1.062l1.37-6.544-4.876-4.347a.999.999 0 0 1 .536-1.737l6.554-.855 2.668-5.755a1 1 0 0 1 1.814 0l2.668 5.755 6.554.855a.999.999 0 0 1 .536 1.737l-4.876 4.347 1.37 6.544a1 1 0 0 1-.978 1.205Z" />
                                                </svg>
                                                <svg aria-label="Down chevron" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" height="12" width="13">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className="flex gap-[3px] items-center mt-0.5 mb-1">
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                        </div>
                                        <button className="text-white">
                                            <svg className="w-[40px] h-[40px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {comment.show && !isCommentSheetOpen && (
                        <div
                            onClick={() => setIsCommentSheetOpen(true)}
                            className="absolute bottom-[90px] left-4 flex items-end gap-2 z-30 export-show px-4 py-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
                        >
                            <div className="relative shrink-0">
                                <img src={user1Photo.image || DEFAULT_PROFILE } className="w-[25px] h-[25px] rounded-full object-cover shadow-sm" alt="User 1" />
                                <img src={user2Photo.image || DEFAULT_PROFILE } className="w-[12px] h-[12px] rounded-full absolute -top-3 -left-1 object-cover shadow-sm" alt="User 2" />
                            </div>
                            <div className="relative max-w-[260px] mb-[5px]">
                                <div className="absolute inset-0 backdrop-blur-lg rounded-[20px] z-0"></div>
                                <div className="absolute inset-0 opacity-25 z-0"><div className="w-full h-full bg-white rounded-[20px]"></div><svg className="absolute -left-[4px] bottom-[0px] w-[14px] h-[14px] rounded-sm text-white" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M 15 0 V 12 C 9 14 4 14 1 14 C 4 10 6 5 5 0 H 15 Z" /></svg></div>
                                <div className="absolute inset-0 opacity-50 z-0"><div className="w-full h-full bg-black rounded-[20px]"></div><svg className="absolute -left-[4px] bottom-[0px] w-[14px] h-[14px] rounded-sm text-black" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M 15 0 V 12 C 9 14 4 14 1 14 C 4 10 6 5 5 0 H 15 Z" /></svg></div>
                                <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] pointer-events-none z-0"></div>
                                <div className="relative z-10 px-3.5 py-2 text-white text-[15px] font-medium whitespace-pre-wrap break-words">{renderCommentText(comment.text)}</div>
                            </div>
                        </div>
                    )}

                    <div className="bg-[#0F0F0F] pt-4 pb-2 px-4 flex items-center gap-4 shrink-0 relative z-20">
                        <div className="flex-1 h-[44px] border border-white/30 rounded-full flex items-center px-4 -translate-y-[5px]">
                            <input type="text" placeholder="Send message..." value={comment.replyText} onChange={(e) => setComment({ ...comment, replyText: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter" && comment.replyText.trim() !== "") { alert(`Message sent: ${comment.replyText}`); setComment({ ...comment, replyText: "" }); } }} className="bg-transparent w-full outline-none text-[17px] text-white placeholder-white/80" />
                        </div>
                        <div className="flex items-center gap-4 text-white shrink-0 pr-1 -translate-y-[5px]">
                            <button className="hover:scale-110 transition-transform"><svg aria-label="Notifications" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg></button>

                            {!header.isCF && (
                                <>
                                    <button onClick={() => setIsCommentSheetOpen(true)} className="hover:scale-110 transition-transform cursor-pointer"><svg aria-label="Comment" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg></button>
                                    <button className="hover:scale-110 transition-transform"><svg aria-label="Messages" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"></line></svg></button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="h-[24px] bg-[#0F0F0F] flex justify-center items-end pb-2 w-full shrink-0 relative z-20">
                        <div className="w-[134px] h-[5px] bg-white rounded-full"></div>
                    </div>

                    {isCommentSheetOpen && (
                        <div className="absolute inset-0 z-[100] flex flex-col justify-end overflow-hidden export-show">

                            <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={() => setIsCommentSheetOpen(false)} />

                            <div className="relative w-full rounded-t-[30px] flex flex-col z-10 min-h-[70%] max-h-[85%] pt-3 animate-in slide-in-from-bottom-10 duration-200 overflow-hidden bg-white/25 backdrop-blur-[45px]">
                                <div className="relative z-10 flex flex-col w-full h-full">
                                    <div className="w-[36px] h-[2px] bg-gray-400 rounded-full mx-auto mb-6 mt-0.5 shrink-0" />

                                    {/* Comments List */}
                                    <div
                                        className="flex-1 overflow-y-auto px-4 custom-scrollbar flex flex-col gap-2 pb-2 relative z-10"
                                        style={{
                                            maskImage: "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",
                                            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)"
                                        }}
                                    >
                                        {storyComments.map((c) => (
                                            <div key={c.id} className="flex gap-3 items-start">
                                                <img src={c.avatar || DEFAULT_PROFILE} className="w-[34px] h-[34px] rounded-full object-cover shrink-0" />
                                                <div className="flex flex-col mt-[2px]">
                                                    <div className="flex items-center gap-1.5 leading-none mb-1">
                                                        <span className="text-white/90 text-[12px] font-semibold">{c.username}</span>
                                                        {c.isAuthor && (
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-[2px] h-[2px] bg-[#a8a8a8] rounded-full" />
                                                                <span className="text-[#a8a8a8] text-[12px]">Author</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-white text-[13px] leading-[1.3] whitespace-pre-wrap break-words pr-4">{renderCommentText(c.text)}</span>
                                                    <span className="text-gray-400 text-[11px] font-semibold mt-1 cursor-pointer hover:text-white/80 transition-colors">Reply</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="shrink-0 flex flex-col p-4 pt-0 gap-2 bg-transparent">
                                        <div className="flex justify-between items-center px-1">
                                            {['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'].map(e => (
                                                <span key={e} className="text-[24px] drop-shadow-md hover:scale-110 cursor-pointer transition-transform">{e}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <img src={viewerPhoto.image} className="w-[43px] h-[43px] rounded-full object-cover shrink-0 opacity-90" />
                                            <div className="flex-1 h-[43px] rounded-full px-4 flex items-center bg-black/30">
                                                <span className="text-white/60 text-[14px]">Add a comment or @mention friends...</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-[24px] flex justify-center items-end pb-2 pt-1 w-full shrink-0 relative z-20">
                                        <div className="w-[134px] h-[5px] bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Mobile Export Buttons */}
                <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#18181b]/95 backdrop-blur-md border-t border-[#27272a] flex gap-3 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <button
                        onClick={() => handleExportClick("jpg")}
                        disabled={isExporting}
                        className={`flex-1 ${isExporting ? 'bg-[#3f3f46] cursor-not-allowed' : 'bg-[#27272a] hover:bg-[#3f3f46]'} text-white py-3 rounded-xl text-sm font-bold transition-all border border-[#3f3f46] flex justify-center items-center`}
                    >
                        {isExporting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" stroke="rgba(255,255,255,0.3)"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Saving...
                            </span>
                        ) : 'Save JPG'}
                    </button>
                </div>
            </div>

            {/* === CONTROL PANEL === */}
            <div className={`w-full xl:w-[480px] shrink-0 xl:h-screen xl:sticky xl:top-0 z-40 ${mobileTab === "edit" ? 'block' : 'hidden xl:block'}`}>
                <ControlPanel
                    media={{
                        bgImage: bgPhoto.image,
                        handleBgUpload: async (e) => {
                            await bgPhoto.handleUpload(e);
                            bgEditor.resetTransform();
                            setIsEditingBg(true);
                        },
                        handleBgClear: () => {
                            bgPhoto.setImage("");
                            setIsEditingBg(false);
                            bgEditor.resetTransform();
                        },
                        isEditingBg, setIsEditingBg, bgEditor, fileInputRef
                    }}
                    headerData={header}
                    setHeaderData={setHeader}
                    profilePhoto={profilePhoto}
                    profileEditor={profileEditor}
                    addonData={addon}
                    setAddonData={setAddon}
                    repostPhoto={repostPhoto}
                    statusBar={{
                        ...deviceSettings,
                        setTimeText: (val) => setDeviceSettings(prev => ({ ...prev, timeText: val })),
                        setBatteryLevel: (val) => setDeviceSettings(prev => ({ ...prev, batteryLevel: val })),
                        setSignalBars: (val) => setDeviceSettings(prev => ({ ...prev, signalBars: val })),
                        setShowDynamicIsland: (val) => setDeviceSettings(prev => ({ ...prev, showDynamicIsland: val })),
                        setDiWaveColor: (val) => setDeviceSettings(prev => ({ ...prev, diWaveColor: val })),
                        diPhoto: {
                            image: deviceSettings.diPhotoUrl,
                            handleUpload: (base64) => setDeviceSettings(prev => ({ ...prev, diPhotoUrl: base64 }))
                        }
                    }}
                    commentData={comment}
                    setCommentData={setComment}
                    user1Photo={user1Photo}
                    user2Photo={user2Photo}
                    viewerPhoto={viewerPhoto}
                    commentSheet={{
                        isOpen: isCommentSheetOpen,
                        setIsOpen: setIsCommentSheetOpen,
                        comments: storyComments,
                        setComments: setStoryComments,
                        activeId: activeCommentId,
                        setActiveId: setActiveCommentId,
                        addComment: handleAddStoryComment,
                        updateComment: updateStoryComment,
                        removeComment: removeStoryComment
                    }}
                    textLayer={textEditor}
                    exportData={{
                        downloadImage: (ref, format) => handleExportClick(format),
                        phoneFrameRef,
                        isExporting
                    }} />
            </div>
        </div>
    );
}