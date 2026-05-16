"use client";
import { useState, useRef, useEffect } from "react";
import { toPng, toJpeg } from "html-to-image";

export default function IGStory() {
  const defaultProfile = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";
  
  // === STATE FOR CONTENT ===
  const [bgImage, setBgImage] = useState("");
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [username, setUsername] = useState("yerimiese");
  const [postedTime, setPostedTime] = useState("10h");
  const [storyCount, setStoryCount] = useState(3);
  const [currentStory, setCurrentStory] = useState(1);
  const [replyText, setReplyText] = useState("");

  // === STATE FOR HEADER ADDON (NONE / MUSIC / REPOST) ===
  const [headerMode, setHeaderMode] = useState("music");
  const [musicArtist, setMusicArtist] = useState("Daniel Caesar");
  const [musicTitle, setMusicTitle] = useState("Always");
  const [repostImage, setRepostImage] = useState(defaultProfile);
  const [repostUsername, setRepostUsername] = useState("archived.post");

  // === STATE FOR STATUS BAR & PROFILE ===
  const [profileScale, setProfileScale] = useState(1);
  const [timeText, setTimeText] = useState("00.04");
  const [batteryLevel, setBatteryLevel] = useState(65);
  const [signalText, setSignalText] = useState("5G");
  const [signalBars, setSignalBars] = useState(4);

  // === STATE FOR DYNAMIC ISLAND ===
  const [showDynamicIsland, setShowDynamicIsland] = useState(true);
  const [diImage, setDiImage] = useState(
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%231db954'/%3E%3C/svg%3E"
  );
  const [diWaveColor, setDiWaveColor] = useState("#6366f1");

  // === STATE FOR COMMENT BUBBLE ===
  const [showComment, setShowComment] = useState(true);
  const [senderImage, setSenderImage] = useState(defaultProfile);
  const [commentBadgeImage, setCommentBadgeImage] = useState(""); 
  const [commentText, setCommentText] = useState("gehdhs");

  // === STATE FOR TEXT ===
  const [storyTexts, setStoryTexts] = useState([]);
  const [inputText, setInputText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [draggingTextId, setDraggingTextId] = useState(null);

  // Refs
  const fileInputRef = useRef(null);
  const profileInputRef = useRef(null);
  const repostInputRef = useRef(null);
  const diInputRef = useRef(null);
  const senderInputRef = useRef(null);
  const commentBadgeInputRef = useRef(null); 
  const phoneFrameRef = useRef(null);

  // === STATE FOR IMAGE EDITING ===
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (currentStory > storyCount) setCurrentStory(storyCount);
  }, [storyCount, currentStory]);

  // --- Upload Logic ---
  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result);
        setPosition({ x: 0, y: 0 });
        setScale(1);
        setRotation(0);
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setProfileScale(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRepostUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRepostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDiImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSenderUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSenderImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCommentBadgeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentBadgeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = (e) => {
    if (e.key === "Enter" && replyText.trim() !== "") {
      alert(`Message sent: ${replyText}`);
      setReplyText("");
    }
  };

  // --- Image Dragging & Scaling Logic ---
  const handlePointerDown = (e) => {
    if (!isEditing) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e) => {
    if (!isDragging || !isEditing) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const handleWheel = (e) => {
    if (!isEditing) return;
    setScale((prev) => Math.min(Math.max(0.5, prev - e.deltaY * 0.005), 4));
  };

  // --- Text Logic (Add, Drag, Format, Resize, Rotate) ---
  const handleAddText = () => {
    if (!inputText.trim()) return;
    setStoryTexts([
      ...storyTexts,
      { id: Date.now(), text: inputText, x: 0, y: 0, color: textColor, scale: 1, rotation: 0 },
    ]);
    setInputText("");
  };
  const handleRemoveText = (id) => setStoryTexts(storyTexts.filter((t) => t.id !== id));
  const handleUpdateTextProps = (id, field, value) => {
    setStoryTexts(storyTexts.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };
  const handleTextDragStart = (e, id) => {
    e.stopPropagation();
    const textObj = storyTexts.find((t) => t.id === id);
    setDraggingTextId(id);
    setDragStart({ x: e.clientX - textObj.x, y: e.clientY - textObj.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleTextDragMove = (e) => {
    if (!draggingTextId) return;
    setStoryTexts((prev) =>
      prev.map((t) => (t.id === draggingTextId ? { ...t, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y } : t))
    );
  };
  const handleTextDragEnd = (e) => {
    setDraggingTextId(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const renderFormattedText = (text) => {
    const parts = text.split(/(@[\w._]+)/g);
    return parts.map((part, i) =>
      part.startsWith("@") ? <span key={i} className="underline decoration-2 underline-offset-4">{part}</span> : <span key={i}>{part}</span>
    );
  };

  // --- Export Image Logic ---
  const downloadImage = async (format = "png") => {
    if (!phoneFrameRef.current) return;
    const elementsToHide = phoneFrameRef.current.querySelectorAll(".export-hide");
    const elementsToShow = phoneFrameRef.current.querySelectorAll(".export-show");
    
    elementsToHide.forEach((el) => el.style.setProperty("display", "none", "important"));
    elementsToShow.forEach((el) => el.style.setProperty("display", "flex", "important"));
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const options = { quality: 1, pixelRatio: 3, style: { borderRadius: "0px", boxShadow: "none", outline: "none" } };
      let dataUrl = format === "jpg" ? await toJpeg(phoneFrameRef.current, options) : await toPng(phoneFrameRef.current, options);
      const link = document.createElement("a");
      link.download = `IG_Story_Export.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
      alert("Oops, failed to export image.");
    } finally {
      elementsToHide.forEach((el) => el.style.removeProperty("display"));
      elementsToShow.forEach((el) => el.style.removeProperty("display"));
    }
  };

  return (
    <div className="bg-[#09090b] min-h-screen w-full flex flex-col xl:flex-row items-center justify-start xl:justify-center py-10 px-4 gap-10 font-sans overflow-x-hidden">
      
      {/* === CONTROL PANEL === */}
      <div className="w-full max-w-[420px] bg-[#18181b] rounded-[24px] border border-[#27272a] shadow-2xl flex flex-col xl:mt-0 mt-4 h-[85vh] xl:max-h-[852px] overflow-hidden relative shrink-0">
        
        {/* Header Panel */}
        <div className="px-6 py-5 border-b border-[#27272a] bg-[#18181b] z-20 flex justify-between items-center relative shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-white tracking-tight">Story Creator</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Customize your perfect IG Story.</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </div>
        </div>
        
        {/* Scrollable Body */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 pb-28 relative z-10">
          
          {/* 1. Canvas Media */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Canvas Media
            </label>
            <div className="bg-[#27272a]/30 p-4 rounded-2xl border border-[#3f3f46]/30">
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleBgUpload} />
              <div className="flex gap-2">
                <button onClick={() => fileInputRef.current.click()} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex-1 shadow-sm shadow-indigo-900/50">
                  Upload Background
                </button>
                {bgImage && !isEditing && (
                  <button onClick={() => setIsEditing(true)} className="bg-[#3f3f46] hover:bg-[#52525b] px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center">
                    Edit Position
                  </button>
                )}
                {bgImage && (
                  <button onClick={() => { setBgImage(""); setIsEditing(false); }} className="bg-[#3f3f46] hover:bg-red-500/20 text-neutral-300 hover:text-red-500 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. Story Header */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Story Header
            </label>
            <div className="bg-[#27272a]/30 p-4 rounded-2xl border border-[#3f3f46]/30 flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <div className="relative group shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#3f3f46] cursor-pointer" onClick={() => profileInputRef.current.click()}>
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                  </div>
                  <input type="file" accept="image/*" className="hidden" ref={profileInputRef} onChange={handleProfileUpload} />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full transition-all placeholder-neutral-600" />
                  <input type="text" value={postedTime} onChange={(e) => setPostedTime(e.target.value)} placeholder="Time (e.g., 10h)" className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full transition-all placeholder-neutral-600" />
                </div>
              </div>
              
              <div className="h-px bg-[#3f3f46]/50 w-full my-1"></div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs text-neutral-400">
                  <span>Story Lines: <span className="font-bold text-white">{storyCount}</span></span>
                </div>
                <input type="range" min="1" max="15" value={storyCount} onChange={(e) => setStoryCount(parseInt(e.target.value))} className="w-full accent-indigo-500 touch-none" />
                
                <div className="flex justify-between items-center text-xs text-neutral-400 mt-1">
                  <span>Active Position: <span className="font-bold text-white">{currentStory}</span></span>
                </div>
                <input type="range" min="1" max={storyCount} value={currentStory} onChange={(e) => setCurrentStory(parseInt(e.target.value))} className="w-full accent-indigo-500 touch-none" />
                
                <div className="flex justify-between items-center text-xs text-neutral-400 mt-1">
                  <span>Avatar Zoom: <span className="font-bold text-white">{Math.round(profileScale * 100)}%</span></span>
                </div>
                <input type="range" min="0.5" max="3" step="0.1" value={profileScale} onChange={(e) => setProfileScale(parseFloat(e.target.value))} className="w-full accent-indigo-500 touch-none" />
              </div>
            </div>
          </div>

          {/* 3. Header Add-on (MUSIC / REPOST / NONE) */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              Header Extension
            </label>
            <div className="bg-[#27272a]/30 p-4 rounded-2xl border border-[#3f3f46]/30 flex flex-col gap-4">
              
              {/* Toggle Switch */}
              <div className="flex bg-[#18181b] p-1 rounded-lg border border-[#3f3f46]">
                {['none', 'music', 'repost'].map((mode) => (
                  <button 
                    key={mode}
                    onClick={() => setHeaderMode(mode)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${headerMode === mode ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Music Settings */}
              {headerMode === 'music' && (
                <div className="flex flex-col gap-2">
                  <input type="text" value={musicArtist} onChange={(e) => setMusicArtist(e.target.value)} placeholder="Artist Name" className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full" />
                  <input type="text" value={musicTitle} onChange={(e) => setMusicTitle(e.target.value)} placeholder="Song Title" className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full" />
                </div>
              )}

              {/* Repost Settings */}
              {headerMode === 'repost' && (
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 shrink-0 rounded-md overflow-hidden border border-[#3f3f46] cursor-pointer relative group" onClick={() => repostInputRef.current.click()}>
                    <img src={repostImage} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                  </div>
                  <input type="file" accept="image/*" className="hidden" ref={repostInputRef} onChange={handleRepostUpload} />
                  <input type="text" value={repostUsername} onChange={(e) => setRepostUsername(e.target.value)} placeholder="Repost Username" className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 flex-1" />
                </div>
              )}

            </div>
          </div>

          {/* 4. Device Settings */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Device Settings
            </label>
            <div className="bg-[#27272a]/30 p-4 rounded-2xl border border-[#3f3f46]/30 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-400">Time</label>
                  <input type="text" value={timeText} onChange={(e) => setTimeText(e.target.value)} className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-400">Signal Text</label>
                  <input type="text" value={signalText} onChange={(e) => setSignalText(e.target.value)} className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs text-neutral-400">
                  <span>Battery (%)</span><span className="font-bold text-white">{batteryLevel}</span>
                </div>
                <input type="range" min="0" max="100" value={batteryLevel} onChange={(e) => setBatteryLevel(parseInt(e.target.value))} className="w-full accent-indigo-500 touch-none" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs text-neutral-400">
                  <span>Signal Bars (No Island)</span><span className="font-bold text-white">{showDynamicIsland ? '-' : signalBars}</span>
                </div>
                <input type="range" min="0" max="4" value={signalBars} onChange={(e) => setSignalBars(parseInt(e.target.value))} className="w-full accent-white disabled:opacity-50 touch-none" disabled={showDynamicIsland} />
              </div>
              <div className="h-px bg-[#3f3f46]/50 w-full my-1"></div>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowDynamicIsland(!showDynamicIsland)}>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Dynamic Island</span>
                  <span className="text-xs text-neutral-500">Show modern notch</span>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${showDynamicIsland ? 'bg-indigo-500' : 'bg-neutral-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${showDynamicIsland ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </div>
              </div>
              {showDynamicIsland && (
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex gap-3 items-end mt-2">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[11px] text-neutral-400">Album Art</label>
                    <input type="file" accept="image/*" className="hidden" ref={diInputRef} onChange={handleDiUpload} />
                    <button onClick={() => diInputRef.current.click()} className="bg-[#3f3f46] hover:bg-[#52525b] px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all w-full">Upload Photo</button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-neutral-400">Wave Color</label>
                    <div className="bg-[#18181b] border border-[#3f3f46] rounded-lg p-1 flex items-center justify-center">
                      <input type="color" value={diWaveColor} onChange={(e) => setDiWaveColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Comment Reply Bubble Control */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              Comment Reply
            </label>
            <div className="bg-[#27272a]/30 p-4 rounded-2xl border border-[#3f3f46]/30 flex flex-col gap-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowComment(!showComment)}>
                <span className="text-sm font-semibold text-white">Show Comment Bubble</span>
                <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${showComment ? 'bg-indigo-500' : 'bg-neutral-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${showComment ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </div>
              </div>
              {showComment && (
                <>
                  <div className="h-px bg-[#3f3f46]/50 w-full my-1"></div>
                  <div className="flex gap-4 items-center">
                    <div className="relative shrink-0 w-12 h-12">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#3f3f46] cursor-pointer group" onClick={() => senderInputRef.current.click()} title="Upload Sender Image">
                        <img src={senderImage} alt="Sender" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                      </div>
                      <input type="file" accept="image/*" className="hidden" ref={senderInputRef} onChange={handleSenderUpload} />
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full overflow-hidden border-2 border-[#18181b] cursor-pointer z-10 bg-neutral-800 group/badge" onClick={(e) => { e.stopPropagation(); commentBadgeInputRef.current.click(); }} title="Upload Badge Image">
                        <img src={commentBadgeImage || profileImage} alt="Badge" className="w-full h-full object-cover group-hover/badge:opacity-50 transition-opacity" />
                      </div>
                      <input type="file" accept="image/*" className="hidden" ref={commentBadgeInputRef} onChange={handleCommentBadgeUpload} />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Type comment..." className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full transition-all placeholder-neutral-600 min-h-[44px] max-h-[100px] resize-y custom-scrollbar" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 6. Text Overlays */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              Text Overlays
            </label>
            <div className="bg-[#27272a]/30 p-4 rounded-2xl border border-[#3f3f46]/30 flex flex-col gap-4">
              <div className="flex gap-2">
                <textarea placeholder="Type something... (Supports Enter & @mention)" value={inputText} onChange={(e) => setInputText(e.target.value)} className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-xl flex-1 px-3 py-2 outline-none focus:border-indigo-500 min-h-[44px] max-h-[120px] resize-y custom-scrollbar placeholder-neutral-600" />
                <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl p-1.5 shrink-0 flex items-center justify-center h-[44px]">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0" />
                </div>
              </div>
              <button onClick={handleAddText} className="bg-indigo-600 hover:bg-indigo-500 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm shadow-indigo-900/50 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Add Text
              </button>
              {storyTexts.length > 0 && (
                <div className="flex flex-col gap-3 mt-1">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold border-b border-[#3f3f46]/50 pb-1">Text Layers</span>
                  {storyTexts.map((t) => (
                    <div key={t.id} className="bg-[#18181b] p-3 rounded-xl border border-[#3f3f46]/50 flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-sm font-medium text-white line-clamp-2 leading-tight">"{t.text}"</span>
                        <button onClick={() => handleRemoveText(t.id)} className="text-neutral-500 hover:text-red-400 p-1 bg-[#27272a] hover:bg-red-500/10 rounded-md transition-colors shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/5">
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-neutral-400"><span>Size</span><span>{Math.round(t.scale * 100)}%</span></div>
                          <input type="range" min="0.5" max="3" step="0.05" value={t.scale} onChange={(e) => handleUpdateTextProps(t.id, 'scale', parseFloat(e.target.value))} className="w-full accent-indigo-400 h-1 touch-none" />
                        </div>
                        <div className="w-px h-6 bg-[#3f3f46]/50"></div>
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-neutral-400"><span>Rotate</span><span>{t.rotation}°</span></div>
                          <input type="range" min="-180" max="180" value={t.rotation} onChange={(e) => handleUpdateTextProps(t.id, 'rotation', parseFloat(e.target.value))} className="w-full accent-indigo-400 h-1 touch-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>

        {/* Sticky Export Area */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-[#18181b]/90 backdrop-blur-md border-t border-[#27272a] flex gap-3 z-30">
          <button onClick={() => downloadImage("jpg")} className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-3 rounded-xl text-sm font-bold transition-all border border-[#3f3f46]">Save JPG</button>
          <button onClick={() => downloadImage("png")} className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-900/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Save High-Res
          </button>
        </div>
      </div>

      {/* === PHONE FRAME === */}
      <div ref={phoneFrameRef} className="w-[393px] max-w-[100vw] h-[852px] bg-[#0F0F0F] flex flex-col overflow-hidden relative shadow-2xl ring-1 ring-white/10 sm:rounded-[40px] shrink-0">
        
        {/* Status Bar */}
        <div className="flex flex-row h-[58px] w-full text-white px-[38px] pt-1 z-40 shrink-0 pointer-events-none items-center">
          <div className={`flex-1 flex ${showDynamicIsland ? 'justify-start' : 'justify-center'} items-center text-[16px] font-[500] tracking-tight`}><span>{timeText}</span></div>
          <div className="flex-[2] flex justify-center items-center relative"></div>
          <div className={`flex-1 flex ${showDynamicIsland ? 'justify-end' : 'justify-center'} items-center gap-1.5 font-semibold`}>
            {!showDynamicIsland && (
              <div className="flex items-end gap-[2px] mb-[1px]">
                <div className={`w-[3px] h-[6px] rounded-[1px] ${signalBars >= 1 ? 'bg-white' : 'bg-white/40'}`}></div>
                <div className={`w-[3px] h-[8px] rounded-[1px] ${signalBars >= 2 ? 'bg-white' : 'bg-white/40'}`}></div>
                <div className={`w-[3px] h-[10px] rounded-[1px] ${signalBars >= 3 ? 'bg-white' : 'bg-white/40'}`}></div>
                <div className={`w-[3px] h-[12px] rounded-[1px] ${signalBars >= 4 ? 'bg-white' : 'bg-white/40'}`}></div>
              </div>
            )}
            <span className="text-sm font-medium items-center tracking-tight">{signalText}</span>
            <div className="flex items-center">
              <div className="relative flex items-center justify-center w-[27px] h-[14px]">
                <svg width="27" height="14" viewBox="0 0 27 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 z-0">
                  <clipPath id="battery-clip"><rect width="27" height="14" rx="4.5" /></clipPath>
                  <rect width="27" height="14" rx="4.5" fill="rgba(255, 255, 255, 0.25)" />
                  <rect width={`${batteryLevel}%`} height="14" fill="white" clipPath="url(#battery-clip)" style={{ transition: "width 300ms ease" }} />
                </svg>
                <span className={`relative z-10 text-[12px] font-bold tracking-tighter ${batteryLevel > 45 ? 'text-black' : 'text-white drop-shadow-sm'}`}>{batteryLevel}</span>
              </div>
              <div className="w-[2px] h-[5px] bg-white/50 rounded-r-[2px]"></div>
            </div>
          </div>
        </div>

        {/* Dynamic Island */}
        {showDynamicIsland && (
          <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[185px] h-[37px] bg-black rounded-full border border-white/10 z-50 flex items-center justify-between px-[3px] shadow-lg transition-all duration-300 pointer-events-none">
            <div className="w-[20px] h-[20px] overflow-hidden shrink-0 rounded-sm mx-[5px] bg-neutral-800 flex items-center justify-center">
              <img src={diImage} alt="Album Art" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-[2px] items-center h-[14px] mr-1.5">
              <div className="w-[2px] h-[5px] rounded-sm animate-pulse" style={{ backgroundColor: diWaveColor }}></div>

              <div className="w-[2px] h-[8px] rounded-sm animate-pulse" style={{ backgroundColor: diWaveColor }}></div>
              <div className="w-[2px] h-[14px] rounded-sm animate-pulse" style={{ backgroundColor: diWaveColor, animationDelay: '150ms' }}></div>
              <div className="w-[2px] h-[10px] rounded-sm animate-pulse" style={{ backgroundColor: diWaveColor, animationDelay: '300ms' }}></div>
              <div className="w-[2px] h-[6px] rounded-sm animate-pulse" style={{ backgroundColor: diWaveColor, animationDelay: '450ms' }}></div>
            </div>
          </div>
        )}

        {/* === MAIN STORY CANVAS === */}
        <div className="flex-1 w-full px-0 relative overflow-hidden">
          <div className={`w-full h-full bg-neutral-900 rounded-[10px] overflow-hidden relative ${isEditing ? 'touch-none' : ''}`}>
            
            {bgImage && <div className="absolute inset-0 w-full h-full bg-cover bg-center blur-2xl scale-125 opacity-50 z-0 pointer-events-none" style={{ backgroundImage: `url(${bgImage})` }} />}

            {/* Draggable Media */}
            <div className="w-full h-full absolute inset-0 transition-none z-10" style={{ transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`, transformOrigin: "center" }}>
              {bgImage && <img src={bgImage} alt="Story Background" draggable={false} onWheel={handleWheel} className="w-full h-full object-cover" style={{ cursor: isEditing ? (isDragging ? 'grabbing' : 'grab') : 'default' }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} />}
            </div>

            {/* Text Overlays */}
            {storyTexts.map((item) => (
              <div
                key={item.id}
                style={{ transform: `translate(calc(-50% + ${item.x}px), calc(-50% + ${item.y}px)) scale(${item.scale}) rotate(${item.rotation}deg)`, color: item.color, top: '50%', left: '50%', transformOrigin: 'center' }}
                className={`absolute z-20 font-bold text-[22px] leading-[1.2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-grab max-w-[340px] text-center whitespace-pre-wrap break-words ${draggingTextId === item.id ? 'active:cursor-grabbing' : ''}`}
                onPointerDown={(e) => handleTextDragStart(e, item.id)} onPointerMove={handleTextDragMove} onPointerUp={handleTextDragEnd} onPointerCancel={handleTextDragEnd}
              >
                {renderFormattedText(item.text)}
              </div>
            ))}

            {/* Editor Grid & Controls */}
            <div className={`absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center export-hide ${isEditing ? 'flex' : 'hidden'}`}>
              <div className="border border-white/30 w-full h-full absolute inset-0 flex">
                <div className="border-r border-white/20 w-1/3 h-full"></div>
                <div className="border-r border-white/20 w-1/3 h-full"></div>
                <div className="border-t border-white/20 w-full h-1/3 absolute top-1/3 left-0"></div>
                <div className="border-t border-white/20 w-full h-1/3 absolute top-2/3 left-0"></div>
              </div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className={`absolute top-[80px] left-1/2 -translate-x-1/2 z-30 export-hide ${isEditing ? 'block' : 'hidden'}`}>
              <button onClick={() => setIsEditing(false)} className="bg-white text-black px-8 py-2.5 rounded-full font-bold shadow-lg hover:bg-gray-200 transition-colors">✔ Done</button>
            </div>

            <div className={`absolute bottom-[20px] left-1/2 -translate-x-1/2 z-30 w-[90%] bg-black/70 backdrop-blur-md px-5 py-4 rounded-3xl flex flex-col gap-4 shadow-xl border border-white/10 export-hide ${isEditing ? 'flex' : 'hidden'}`}>
              <div className="flex items-center gap-3 w-full">
                <svg className="w-5 h-5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                <input type="range" min="0.5" max="4" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="flex-1 h-1.5 bg-[#3f3f46] rounded-lg appearance-none cursor-pointer accent-white touch-none" />
                <span className="text-white/80 text-[11px] font-medium w-9 text-right shrink-0">{Math.round(scale * 100)}%</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <svg className="w-5 h-5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <input type="range" min="-180" max="180" step="1" value={rotation} onChange={(e) => setRotation(parseFloat(e.target.value))} className="flex-1 h-1.5 bg-[#3f3f46] rounded-lg appearance-none cursor-pointer accent-white touch-none" />
                <button onClick={() => setRotation(0)} className="text-black bg-white hover:bg-gray-200 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">0°</button>
              </div>
            </div>

            {/* Story Header */}
            <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-20 ${isEditing ? 'hidden export-show' : 'block'}`}></div>
            <div className={`absolute top-0 inset-x-0 pt-2.5 px-3 flex flex-col gap-1.5 z-30 ${isEditing ? 'hidden export-show' : 'flex'}`}>
              <div className="flex gap-1 w-full">
                {Array.from({ length: storyCount }).map((_, index) => (
                  <div key={index} className={`h-[2px] rounded-full flex-1 transition-colors duration-300 ${index < currentStory ? 'bg-white' : 'bg-white/40'}`}></div>
                ))}
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 p-0">
                  <div className="w-[32px] h-[32px] rounded-full overflow-hidden p-0 shrink-0 bg-neutral-800 flex items-center justify-center">
                    <img src={profileImage} alt="Avatar" className="w-full h-full object-cover transition-transform duration-200" style={{ transform: `scale(${profileScale})` }} />
                  </div>
                  
                  <div className=" flex flex-col justify-center tracking-[0.02em]">
                    
                    <div className="flex items-center gap-2 drop-shadow-md leading-none">
                      <span className="text-white font-semibold text-[14px]">{username || "username"}</span>
                      <span className="text-white/70 text-[13px] font-medium">{postedTime}</span>
                    </div>
                    
                    {headerMode === 'music' && (
                      <div className="flex text-[12px] text-white/95 drop-shadow-md gap-1.5 items-center mt-[1px]">
                        <div className="flex gap-0.5 items-center">
                          <div className="w-0.5 h-2 bg-white rounded-lg"></div>
                          <div className="w-0.5 h-1.5 bg-white rounded-lg"></div>
                          <div className="w-0.5 h-2 bg-white rounded-lg pr-0.5"></div>
                        </div>
                        <span className="font-semibold">{musicArtist}</span>
                        <div className="w-0.5 h-0.5 items-center bg-white rounded-full"></div>
                        <span className="flex items-center gap-0.5">{musicTitle}
                          <span className="flex items-center ml-0.5">
                            <svg className="w-[10px] h-[10px] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </span>
                      </div>
                    )}

                    {headerMode === 'repost' && (
                      <div className="flex text-[12px] text-white drop-shadow-md gap-1.5 items-center mt-[1px]">
                        <svg className="w-[12px] h-[12px]" fill="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z" />
                        </svg>
                        <img src={repostImage} className="w-[12.5px] h-[12.5px] rounded-full" />
                        <span className="font-semibold text-[12px]">{repostUsername}</span>
                      </div>
                    )}

                  </div>
                </div>

                <div className="flex gap-4 text-white drop-shadow-md ">
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

        {showComment && (
          <div className="absolute bottom-[90px] left-4 flex items-end gap-2 z-30 export-show px-4 py-2">
            
            <div className="relative shrink-0">
              <img src={senderImage} className="w-[25px] h-[25px] rounded-full object-cover shadow-sm" alt="User 1" />
              <img src={commentBadgeImage || profileImage} className="w-[12px] h-[12px] rounded-full absolute -top-3 -left-1 object-cover shadow-sm" alt="User 2" />
            </div>

            <div className="relative max-w-[260px] mb-[5px]">
              
              <div className="absolute inset-0 backdrop-blur-lg rounded-[20px] z-0"></div>

              <div className="absolute inset-0 opacity-25 z-0">
                <div className="w-full h-full bg-white rounded-[20px]"></div>
                <svg className="absolute -left-[4px] bottom-[0px] w-[14px] h-[14px] rounded-sm text-white" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 15 0 V 12 C 9 14 4 14 1 14 C 4 10 6 5 5 0 H 15 Z" />
                </svg>
              </div>

              <div className="absolute inset-0 opacity-50 z-0">
                <div className="w-full h-full bg-black rounded-[20px]"></div>
                <svg className="absolute -left-[4px] bottom-[0px] w-[14px] h-[14px] rounded-sm text-black" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 15 0 V 12 C 9 14 4 14 1 14 C 4 10 6 5 5 0 H 15 Z" />
                </svg>
              </div>

              <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] pointer-events-none z-0"></div>

              <div className="relative z-10 px-3.5 py-2 text-white text-[15px] font-medium whitespace-pre-wrap break-words">
                {commentText}
              </div>

            </div>

          </div>
        )}

        {/* Footer Area */}
        <div className="bg-[#0F0F0F] pt-4 pb-2 px-4 flex items-center gap-4 shrink-0">
          <div className="flex-1 h-[44px] border border-white/30 rounded-full flex items-center px-4 -translate-y-[5px]">
            <input 
              type="text" 
              placeholder="Send message..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleSendMessage}
              className="bg-transparent w-full outline-none text-[17px] text-white placeholder-white/80"
            />
          </div>
          <div className="flex items-center gap-4 text-white shrink-0 pr-1 -translate-y-[5px]">
            <button className="hover:scale-110 transition-transform">
              <svg aria-label="Notifications" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Notifications</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
            </button>
            <button className="hover:scale-110 transition-transform">
              <svg aria-label="Comment" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Comment</title><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </button>
            <button className="hover:scale-110 transition-transform">
              <svg aria-label="Messages" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Messages</title><path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"></line></svg>
            </button>
          </div>
        </div>
        <div className="h-[24px] bg-[#0F0F0F] flex justify-center items-end pb-2 w-full shrink-0">
          <div className="w-[134px] h-[5px] bg-white rounded-full"></div>
        </div>
      </div>

    </div>
  );
}