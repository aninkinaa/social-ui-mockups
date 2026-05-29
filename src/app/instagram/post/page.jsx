"use client";
import React, { useState, useRef, useEffect } from "react";
import StatusBar from "@/components/status-bar";
import { useExport } from "@/hooks/useExport";
import { useArrayManager } from "@/hooks/useArrayManager";
import { initialPost, initialStatusBar } from "@/data/instagram";
import FeedsControlPanel from "./control-panel";
import renderTextWithMentions from "@/app/utils/renderTextWithMention";


const DEFAULT_AVATAR = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

export default function IGpost() {
    const { downloadImage, isExporting } = useExport();

    const [deviceSettings, setDeviceSettings] = useState(initialStatusBar);
    const [pageSettings, setPageSettings] = useState({
        headerUsername: "username",
        viewerAvatar: DEFAULT_AVATAR
    });

    const postsLayer = useArrayManager(initialPost);
    const phoneFrameRef = useRef(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [mobileTab, setMobileTab] = useState("preview");
    const [activeCommentSheet, setActiveCommentSheet] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
                setIsStandalone(true);
            }
        }
    }, []);

    const getAspectRatioStyle = (ratio) => {
        switch (ratio) {
            case 'square': return '1 / 1';
            case 'landscape': return '1080 / 566';
            case 'portrait': return '3 / 4';
            default: return '1 / 1';
        }
    };

    const renderPaginationDots = (currentStr, totalStr) => {
        const current = parseInt(currentStr) || 1;
        const total = parseInt(totalStr) || 1;

        let dots = [];
        if (total <= 5) {
            for (let i = 1; i <= total; i++) {
                dots.push({ id: i, size: i === current ? 'active' : 'normal' });
            }
        } else {
            if (current <= 3) {
                dots.push({ id: 1, size: current === 1 ? 'active' : 'normal' });
                dots.push({ id: 2, size: current === 2 ? 'active' : 'normal' });
                dots.push({ id: 3, size: current === 3 ? 'active' : 'normal' });
                dots.push({ id: 4, size: 'small' });
                dots.push({ id: 5, size: 'smallest' });
            } else if (current >= total - 2) {
                dots.push({ id: total - 4, size: 'smallest' });
                dots.push({ id: total - 3, size: 'small' });
                dots.push({ id: total - 2, size: current === total - 2 ? 'active' : 'normal' });
                dots.push({ id: total - 1, size: current === total - 1 ? 'active' : 'normal' });
                dots.push({ id: total, size: current === total ? 'active' : 'normal' });
            } else {
                dots.push({ id: current - 2, size: 'smallest' });
                dots.push({ id: current - 1, size: 'small' });
                dots.push({ id: current, size: 'active' });
                dots.push({ id: current + 1, size: 'small' });
                dots.push({ id: current + 2, size: 'smallest' });
            }
        }

        return (
            <div className="flex justify-center items-center py-3 min-h-[30px] gap-1.5">
                {dots.map((dot) => {
                    let sizeClass = "";
                    if (dot.size === 'active') sizeClass = "w-[5.5px] h-[5.5px] bg-[#0095f6]";
                    else if (dot.size === 'normal') sizeClass = "w-[5.5px] h-[5.5px] bg-gray-300";
                    else if (dot.size === 'small') sizeClass = "w-[4px] h-[4px] bg-gray-300";
                    else if (dot.size === 'smallest') sizeClass = "w-[2.5px] h-[2.5px] bg-gray-300";

                    return <div key={dot.id} className={`rounded-full transition-all duration-300 ${sizeClass}`}></div>;
                })}
            </div>
        );
    };

    const handleRepliesPagination = (postId, cIdx) => {
        const post = postsLayer.items.find(p => p.id === postId);
        const newComments = [...post.commentsList];
        const currentComment = newComments[cIdx];

        const totalReplies = currentComment.replies ? currentComment.replies.length : 0;
        const currentVisible = currentComment.visibleRepliesCount || 0;

        if (currentVisible >= totalReplies) currentComment.visibleRepliesCount = 0;
        else currentComment.visibleRepliesCount = Math.min(currentVisible + 8, totalReplies);

        postsLayer.updateItem(postId, 'commentsList', newComments);
    };

    const activePostForSheet = activeCommentSheet ? postsLayer.items.find(p => p.id === activeCommentSheet) : null;

    return (
        <div className="bg-[#09090b] min-h-screen w-full flex flex-col xl:flex-row font-sans overflow-x-hidden relative">

            {/* MOBILE TABS NAVIGATION */}
            <div className="xl:hidden w-full fixed top-0 z-[100] bg-[#09090b]/90 backdrop-blur-md flex p-2 gap-2 shadow-md border-b border-zinc-800/50">
                <button
                    onClick={() => setMobileTab("preview")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mobileTab === "preview" ? 'bg-brand text-white shadow-md' : 'bg-zinc-900 text-zinc-400 border border-zinc-800/30'}`}
                >
                    Preview Result
                </button>
                <button
                    onClick={() => setMobileTab("edit")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mobileTab === "edit" ? 'bg-brand text-white shadow-md' : 'bg-zinc-900 text-zinc-400 border border-zinc-800/30'}`}
                >
                    Edit Data
                </button>
            </div>

            <div className={`flex-1 w-full justify-center items-center min-h-screen pt-[65px] xl:pt-10 pb-24 xl:pb-10 ${mobileTab === "preview" ? 'flex' : 'hidden xl:flex'}`}>

                <div className={isStandalone ? "w-full h-[100dvh] bg-white flex flex-col overflow-hidden relative" : "w-[393px] max-w-[100vw] h-[852px] bg-white flex flex-col overflow-hidden relative shadow-2xl ring-1 ring-black/5 sm:rounded-[40px] shrink-0 my-auto"}>

                    <div ref={phoneFrameRef} className="w-full h-full bg-white flex flex-col relative overflow-hidden">

                        <div className="z-[110]">
                            <StatusBar showDynamicIsland={deviceSettings.showDynamicIsland} timeText={deviceSettings.timeText} signalBars={deviceSettings.signalBars} batteryLevel={deviceSettings.batteryLevel} theme={activeCommentSheet ? "dark" : "light"} waveColor={deviceSettings.diWaveColor} image={deviceSettings.diPhotoUrl} />
                        </div>
                        <div className="flex justify-between text-black px-2 pb-1 items-center bg-white z-10 shrink-0 border-b border-gray-200/30">
                            <div className="w-8 flex items-center cursor-pointer"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></div>
                            <div className="flex flex-col justify-center items-center"><div className="font-bold text-[16px] leading-tight">Posts</div><div className="text-[12px] font-medium">{pageSettings.headerUsername}</div></div>
                            <div className="w-8"></div>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            {postsLayer.items.map((post, postIndex) => (
                                <div key={post.id} className={`${postIndex > 0 ? 'mt-3' : ''}`}>

                                    <div className="flex px-3 justify-between items-center py-3">
                                        <div className="flex text-black gap-2.5 items-center">
                                            <img src={post.avatar || DEFAULT_AVATAR} className="w-[33px] h-[33px] rounded-full object-cover" />
                                            <div className={`flex flex-col leading-tight ${!post.audio.show ? 'justify-center h-[34px]' : ''}`}>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[14px] font-semibold">{post.username}</span>
                                                    {post.isVerified && <svg fill="rgb(0, 149, 246)" height="12" role="img" viewBox="0 0 40 40" width="12"><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"></path></svg>}
                                                </div>
                                                {post.audio.show && <div className="text-[12px] text-gray-800 flex items-center gap-1 mt-0.5"><svg className="w-4 h-4" viewBox="0 0 640 640" fill="currentColor"><path d="M532 71C539.6 77.1 544 86.3 544 96L544 400C544 444.2 501 480 448 480C395 480 352 444.2 352 400C352 355.8 395 320 448 320C459.2 320 470 321.6 480 324.6L480 207.9L256 257.7L256 464C256 508.2 213 544 160 544C107 544 64 508.2 64 464C64 419.8 107 384 160 384C171.2 384 182 385.6 192 388.6L192 160C192 145 202.4 132 217.1 128.8L505.1 64.8C514.6 62.7 524.5 65 532.1 71.1z" /></svg>{post.audio.artist} · {post.audio.title}</div>}
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5 items-center text-black cursor-pointer"><svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg></div>
                                    </div>

                                    <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: getAspectRatioStyle(post.aspectRatio) }}>
                                        <img
                                            src={post.image || DEFAULT_AVATAR}
                                            alt="Post Content"
                                            crossOrigin="anonymous"
                                            className="w-full h-full object-cover block"
                                        />
                                        <img src={post.image || DEFAULT_AVATAR} alt="Post Content" className="absolute top-0 left-0 w-full h-full object-cover" />
                                        {post.slider.show && post.slider.showBadge && <div className="absolute top-4 right-4 bg-black/60 text-white text-[12px] px-2.5 py-1 rounded-full font-medium tracking-wide">{post.slider.current}/{post.slider.total}</div>}
                                        {post.showTag && <div className="absolute bottom-4 left-4 bg-black/60 p-1.5 rounded-full text-white flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg></div>}
                                        {post.audio.show && (
                                            <div className="absolute bottom-4 right-4 bg-black/60 p-1.5 rounded-full text-white flex items-center justify-center">
                                                {post.audio.isMuted ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>}
                                            </div>
                                        )}
                                    </div>

                                    {post.slider.show && renderPaginationDots(post.slider.current, post.slider.total)}

                                    <div className={`text-black flex justify-between mx-4 mb-3 items-center ${!post.slider.show ? 'mt-3' : 'mt-0'}`}>
                                        <div className="flex gap-3 items-center">
                                            <div className="flex items-center gap-1.5 cursor-pointer">
                                                {post.isLiked ? <svg fill="#ff3040" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg> : <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>}
                                                <div className="text-[14px] font-semibold">{post.likes}</div>
                                            </div>
                                            {post.comment.show && (
                                                <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveCommentSheet(post.id)}>
                                                    <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                                    <div className="text-[14px] font-semibold">{post.comment.count}</div>
                                                </div>
                                            )}
                                            {post.repost.show && <div className="flex items-center gap-1.5 cursor-pointer"><svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"></path></svg><div className="text-[14px] font-semibold">{post.repost.count}</div></div>}
                                            {post.share.show && <div className="flex items-center gap-1.5 cursor-pointer"><svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"></line></svg><div className="text-[14px] font-semibold">{post.share.count}</div></div>}
                                        </div>
                                        <div className="cursor-pointer"><svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg></div>
                                    </div>

                                    {post.likedBy.show && (
                                        <div className="mx-3 flex items-center gap-0.5">
                                            {(() => {
                                                const activeLikerAvatars = post.likedBy.users.filter(u => u.avatar && u.avatar !== "").slice(0, 3);
                                                if (activeLikerAvatars.length === 0) return null;
                                                return (
                                                    <div className="flex items-center shrink-0">
                                                        {activeLikerAvatars.map((u, idx) => (
                                                            <img key={idx} src={u.avatar || DEFAULT_AVATAR} className={`w-[26px] h-[26px] rounded-full border-2 border-white relative object-cover ${idx > 0 ? '-ml-2' : ''}`} style={{ zIndex: 30 - idx }} alt={`Liker`} />
                                                        ))}
                                                    </div>
                                                );
                                            })()}
                                            {(() => {
                                                const activeLikerNames = post.likedBy.users.filter(u => u.username.trim() !== "");
                                                if (activeLikerNames.length === 0 && !post.likedBy.othersCount) return null;
                                                return (
                                                    <div className="text-black text-[14px] leading-snug truncate">
                                                        Liked by <span className="font-semibold">
                                                            {activeLikerNames.map((user, idx, arr) => {
                                                                let separator = "";
                                                                if (idx !== arr.length - 1) separator = (idx === arr.length - 2 && !post.likedBy.othersCount) ? <span className="font-normal"> and </span> : ", ";
                                                                else if (post.likedBy.othersCount) separator = <span className="font-normal"> and </span>;
                                                                return <React.Fragment key={user.id || idx}>{user.username}{separator}</React.Fragment>;
                                                            })}
                                                            {post.likedBy.othersCount && <>{post.likedBy.othersCount}</>}
                                                        </span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    <div className="text-black mx-4 leading-[18px] text-[14px] whitespace-pre-wrap">
                                        <span className="font-semibold">{post.username} </span>
                                        {renderTextWithMentions(post.caption.text)}
                                    </div>

                                    {post.commentsList && post.commentsList.some(c => c.showInFeed) && (
                                        <div className="mx-4 mt-1 flex flex-col gap-1">
                                            {post.commentsList.filter(c => c.showInFeed).map((c) => (
                                                <div key={c.id} className="text-[14px] leading-[18px] text-black flex justify-between items-start">
                                                    <div className="pr-4">
                                                        <span className="font-semibold">{c.username}</span> {renderTextWithMentions(c.text)}
                                                    </div>
                                                    <div className="shrink-0 mt-0.5">
                                                        {c.isLiked ? (
                                                            <svg fill="#ff3040" height="14" viewBox="0 0 48 48" width="14"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                                                        ) : (
                                                            <svg fill="gray" stroke="gray" strokeWidth="0.5" height="14" viewBox="0 0 24 24" width="14" className="text-gray-400"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="text-[12px] text-gray-500 mx-4 mt-1.5">
                                        {post.caption.date}
                                    </div>

                                </div>
                            ))}
                        </div>

                        {activeCommentSheet && activePostForSheet && (
                            <div className="absolute inset-0 z-[100] flex flex-col justify-end overflow-hidden export-show">
                                <div className="absolute inset-0 bg-black/70 transition-opacity" onClick={() => setActiveCommentSheet(null)} />

                                <div className="relative w-full rounded-t-[35px] flex flex-col z-10 h-[70%] bg-white animate-in slide-in-from-bottom-10 duration-200 shadow-[0_-5px_20px_rgba(0,0,0,0.15)]">
                                    <div className="flex flex-col items-center pt-4 pb-2 border-b border-gray-200/20 shrink-0">
                                        <div className="w-8 h-0.5 bg-gray-500 rounded-full mb-3" />
                                        <div className="font-bold text-[16px] text-black">Comments</div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-2 pb-4 flex flex-col gap-4">

                                        {activePostForSheet.commentsList.map((c, cIdx) => {
                                            const totalReplies = c.replies ? c.replies.length : 0;
                                            const visibleCount = c.visibleRepliesCount || 0;
                                            const remainingReplies = totalReplies - visibleCount;

                                            return (
                                                <div key={c.id} className="flex flex-col gap-1 w-full">

                                                    <div className="flex gap-2 w-full">
                                                        <img src={c.avatar || DEFAULT_AVATAR} className="w-8 h-8 rounded-full object-cover shrink-0" />
                                                        <div className="w-full flex items-center">
                                                            <div className=" flex flex-col w-full min-w-0">
                                                                <div className="flex items-center gap-0.5 text-[12px] text-black">
                                                                    <span className="font-semibold">{c.username}</span>
                                                                    <span className="text-gray-500 ml-0.5">{c.time}</span>
                                                                </div>
                                                                <div className="flex w-full justify-between items-center">
                                                                    <div>
                                                                        <div className="text-[13px] leading-[16px] text-black whitespace-pre-wrap">
                                                                            {renderTextWithMentions(c.text)}
                                                                        </div>
                                                                        <div className="text-[12px] font-semibold text-gray-500 mt-1.5 flex gap-4">
                                                                            <span>Reply</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col items-center justify-center gap-1.5 shrink-0 px-2">
                                                                        {c.isLiked ? (
                                                                            <svg fill="#ff3040" height="18" viewBox="0 0 48 48" width="18"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                                                                        ) : (
                                                                            <svg fill="gray" stroke="gray" strokeWidth="0.5" height="18" viewBox="0 0 24 24" width="16" className="text-gray-500"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                                                                        )}
                                                                        <span className="text-[13px] font-semibold text-gray-500">{c.likes}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    {totalReplies > 0 && (
                                                        <div className="pl-[44px] flex flex-col gap-2.5 w-full mt-1">
                                                            {visibleCount > 0 && c.replies.slice(0, visibleCount).map(r => (
                                                                <div key={r.id} className="flex gap-2.5 items-start w-full">
                                                                    <img src={r.avatar || DEFAULT_AVATAR} className="w-6 h-6 rounded-full object-cover shrink-0" />
                                                                    <div className="flex-1 flex flex-col w-full min-w-0">
                                                                        <div className="flex items-center gap-0.5 text-[12px] text-black">
                                                                            <span className="font-semibold">{r.username}</span>
                                                                            <span className="text-gray-500 ml-0.5">{r.time}</span>
                                                                        </div>
                                                                        <div className="flex w-full justify-between">
                                                                            <div>
                                                                                <div className="text-[13px] leading-[16px] text-black mt-0.5 whitespace-pre-wrap">
                                                                                    {renderTextWithMentions(r.text)}
                                                                                </div>
                                                                                <div className="text-[12px] font-semibold text-gray-500 mt-1.5">Reply</div>
                                                                            </div>
                                                                            <div className="flex flex-col items-center justify-center gap-1 shrink-0 px-2">
                                                                                {r.isLiked ? (
                                                                                    <svg fill="#ff3040" height="18" viewBox="0 0 48 48" width="18"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                                                                                ) : (
                                                                                    <svg fill="gray" stroke="gray" strokeWidth="0.5" height="18" viewBox="0 0 24 24" width="16" className="text-gray-500"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                                                                                )}
                                                                                <span className="text-[13px] font-semibold text-gray-500">{r.likes}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            ))}

                                                            <div
                                                                className="text-[12px] font-semibold text-gray-500 flex items-center gap-2 cursor-pointer mb-1 -mt-2"
                                                                onClick={() => handleRepliesPagination(activePostForSheet.id, cIdx)}
                                                            >
                                                                <div className="w-5 h-[1px] bg-gray-400/20 rounded-2xl -mb-1" />
                                                                {visibleCount >= totalReplies
                                                                    ? "Hide replies"
                                                                    : `View ${remainingReplies} more repl${remainingReplies > 1 ? 'ies' : 'y'}`
                                                                }
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="shrink-0 flex flex-col bg-white border-t border-gray-200/50 pb-[10px]">
                                        <div className="px-4 py-2 flex justify-between items-center text-[22px]">
                                            <span className="cursor-pointer hover:scale-110 transition-transform">❤️</span>
                                            <span className="cursor-pointer hover:scale-110 transition-transform">🙌</span>
                                            <span className="cursor-pointer hover:scale-110 transition-transform">🔥</span>
                                            <span className="cursor-pointer hover:scale-110 transition-transform">👏</span>
                                            <span className="cursor-pointer hover:scale-110 transition-transform">😢</span>
                                            <span className="cursor-pointer hover:scale-110 transition-transform">😍</span>
                                            <span className="cursor-pointer hover:scale-110 transition-transform">😮</span>
                                            <span className="cursor-pointer hover:scale-110 transition-transform">😂</span>
                                        </div>
                                        <div className="px-4 pb-1 flex items-center gap-2">
                                            <img src={pageSettings.viewerAvatar || DEFAULT_AVATAR} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                            <div className="flex-1 h-[44.5px] border border-gray-300/50 rounded-full flex items-center px-4 relative">

                                                <div className="bg-transparent w-full text-[15px] text-gray-500 truncate select-none">
                                                    Join the conversation...
                                                </div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    version="1.0"
                                                    viewBox="0 0 600 600"
                                                    preserveAspectRatio="xMidYMid meet"
                                                    className="w-5.5 h-5.5 absolute right-3 text-black cursor-pointer"
                                                    fill="currentColor"
                                                    stroke="none"
                                                >
                                                    <g transform="translate(0.000000,600.000000) scale(0.100000,-0.100000)">
                                                        <path d="M890 5985 c0 -14 -8 -17 -70 -28 -61 -12 -242 -90 -325 -140 -115 -70 -262 -217 -332 -332 -54 -89 -124 -254 -146 -345 -16 -65 -16 -4206 0 -4275 17 -78 51 -170 100 -270 41 -85 46 -93 102 -170 71 -96 183 -199 286 -262 86 -53 267 -126 360 -146 73 -15 4182 -16 4250 0 79 18 170 51 270 100 87 43 96 48 170 102 96 71 199 183 262 286 56 91 129 273 144 360 5 27 15 55 24 61 13 10 15 239 15 2073 0 1797 -2 2061 -15 2061 -9 0 -16 14 -20 38 -3 20 -10 51 -16 67 -6 17 -14 44 -19 60 -11 44 -80 197 -113 250 -63 103 -166 215 -262 286 -76 56 -84 60 -175 105 -103 50 -131 62 -160 67 -14 3 -38 10 -55 16 -16 6 -47 13 -67 16 -24 4 -38 11 -38 20 0 13 -267 15 -2085 15 -1835 0 -2085 -2 -2085 -15z m4140 -554 c116 -45 182 -85 248 -151 79 -79 124 -157 153 -264 18 -69 19 -136 19 -2026 0 -1879 -1 -1958 -19 -2025 -56 -212 -213 -364 -433 -418 -61 -16 -230 -17 -2008 -17 -1778 0 -1947 1 -2008 17 -220 54 -377 206 -433 418 -18 67 -19 146 -19 2025 0 1890 1 1957 19 2026 29 106 74 185 152 263 69 68 159 125 229 143 19 5 49 13 65 18 17 4 923 7 2015 7 1649 -2 1991 -4 2020 -16z" />
                                                        <path d="M1655 3999 c-16 -6 -50 -14 -75 -18 -145 -28 -325 -131 -443 -253 -63 -65 -157 -195 -157 -217 0 -5 -6 -22 -14 -38 -49 -96 -70 -192 -92 -406 -11 -111 17 -335 57 -452 6 -16 15 -45 19 -64 5 -18 13 -38 19 -44 6 -6 11 -17 11 -24 0 -21 88 -162 131 -212 44 -50 141 -135 176 -154 102 -57 215 -104 278 -118 22 -4 60 -12 85 -18 95 -21 322 -5 425 31 17 5 46 13 65 17 19 4 44 12 55 18 11 6 42 21 68 34 27 13 61 30 75 38 35 19 184 168 203 203 48 92 89 185 89 204 0 9 7 37 14 63 17 52 36 218 36 301 -1 93 -17 181 -37 196 -15 11 -94 13 -415 14 -383 0 -398 -1 -408 -19 -5 -11 -10 -85 -10 -168 0 -205 -12 -193 194 -193 159 0 163 -1 185 -24 l22 -24 -19 -38 c-42 -81 -133 -171 -192 -189 -14 -4 -31 -12 -38 -18 -7 -6 -64 -10 -133 -10 -116 0 -162 10 -219 44 -8 5 -24 13 -36 18 -54 24 -174 204 -174 261 0 11 -7 37 -15 57 -22 51 -21 292 1 381 30 120 74 209 142 283 58 63 91 84 167 105 93 26 197 12 307 -40 63 -30 125 -93 158 -161 39 -81 36 -80 267 -80 191 0 206 1 219 19 18 25 18 54 -1 90 -8 15 -15 35 -15 44 0 26 -70 163 -113 222 -73 101 -122 146 -255 232 -15 10 -34 20 -42 24 -8 3 -27 12 -42 20 -14 8 -34 14 -45 14 -10 0 -27 7 -37 15 -11 8 -31 15 -45 15 -14 0 -48 7 -75 15 -56 17 -272 19 -321 4z" />
                                                        <path d="M2978 3949 c-17 -9 -18 -66 -18 -959 0 -928 0 -950 19 -960 26 -13 416 -13 442 0 19 10 19 32 19 960 0 928 0 950 -19 960 -26 13 -420 13 -443 -1z" />
                                                        <path d="M3818 3949 c-17 -9 -18 -66 -18 -959 0 -928 0 -950 19 -960 26 -13 416 -13 442 0 18 10 19 25 19 348 0 250 3 341 12 350 9 9 101 12 347 13 185 1 347 4 361 8 l25 7 0 189 0 189 -25 7 c-14 4 -176 7 -360 8 -247 1 -339 4 -348 13 -8 8 -12 65 -12 189 0 175 0 177 23 183 12 3 191 6 398 6 351 0 377 1 392 18 15 16 17 45 17 194 0 157 -2 177 -18 191 -17 15 -75 17 -638 17 -402 -1 -625 -4 -636 -11z" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[24px] bottom-0 flex justify-center items-end pb-2 w-full shrink-0 z-10">
                                        <div className="w-[134px] h-[5px] bg-black rounded-full"></div>
                                    </div>

                                </div>

                            </div>


                        )}

                        <div className="h-[24px] absolute bottom-0 flex justify-center items-end pb-2 w-full shrink-0 z-10">
                            <div className="w-[134px] h-[5px] bg-black rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#09090b]/90 backdrop-blur-md border-t border-zinc-800/50 flex gap-3 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <button onClick={() => downloadImage(phoneFrameRef, "png", `feed-${pageSettings.headerUsername.toLowerCase()}`)} disabled={isExporting} className="w-full bg-brand hover:bg-brand-hover text-white py-3.5 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2">
                        {isExporting ? 'Generating PNG...' : 'Save High-Res Image'}
                    </button>
                </div>
            </div>

            <div className={`w-full z-120 xl:w-[480px] shrink-0 xl:h-screen xl:sticky xl:top-0 z-40 ${mobileTab === "edit" ? 'block' : 'hidden xl:block'}`}>
                <FeedsControlPanel
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
                    pageSettings={pageSettings}
                    setPageSettings={setPageSettings}
                    postsLayer={postsLayer}
                    exportData={{ phoneFrameRef, downloadImage, isExporting }}
                />
            </div>
        </div>
    );
}