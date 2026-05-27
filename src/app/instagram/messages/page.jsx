"use client";
import { useState, useRef, useEffect } from "react";
import NoteItem from "@/components/instagram/note-item";
import MessageItem from "@/components/instagram/message-item";
import MessagesControlPanel from "./control-panel";
import { useExport } from "@/hooks/useExport";
import StatusBar from "@/components/status-bar";
import { useArrayManager } from "@/hooks/useArrayManager";
import NoteDetailItem from "@/components/instagram/note-detail-item";
import { initialMessages, initialNotes, initialStatusBar } from "@/data/instagram";
import Keyboard from "@/components/keyboard";

const DEFAULT_AVATAR = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

export default function IGMessages() {
    const { downloadImage } = useExport();

    // === DEVICE STATE ===
    const [deviceSettings, setDeviceSettings] = useState(initialStatusBar);

    // === HEADER & FOOTER STATE ===
    const [header, setHeader] = useState({
        username: "hirono",
        profileImage: DEFAULT_AVATAR
    });
    const [footer, setFooter] = useState({ showBadge: true });

    // === ARRAY LAYERS ===
    const notesLayer = useArrayManager(initialNotes);
    const msgsLayer = useArrayManager(initialMessages);

    // === REFS & SYSTEM ===
    const phoneFrameRef = useRef(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [mobileTab, setMobileTab] = useState("preview");
    const [replyingNote, setReplyingNote] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
                setIsStandalone(true);
            }
        }
    }, []);

    return (
        <div className="bg-[#09090b] min-h-screen w-full flex flex-col xl:flex-row font-sans overflow-x-hidden relative">

            {/* === MOBILE TABS === */}
            <div className="xl:hidden w-full fixed top-0 z-[100] bg-[#18181b] flex p-2 gap-2 shadow-md border-b border-[#27272a]">
                <button onClick={() => setMobileTab("preview")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mobileTab === "preview" ? 'bg-indigo-600 text-white' : 'bg-[#27272a] text-gray-400'}`}>Preview Result</button>
                <button onClick={() => setMobileTab("edit")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mobileTab === "edit" ? 'bg-indigo-600 text-white' : 'bg-[#27272a] text-gray-400'}`}>Edit Data</button>
            </div>

            {/* === PHONE FRAME (Sekarang di kiri) === */}
            <div className={`flex-1 w-full justify-center items-center min-h-screen pt-[65px] xl:pt-10 pb-24 xl:pb-10 ${mobileTab === "preview" ? 'flex' : 'hidden xl:flex'}`}>
                <div
                    className={
                        isStandalone
                            ? "w-full h-[100dvh] bg-white flex flex-col overflow-hidden relative"
                            : "w-[393px] max-w-[100vw] h-[852px] bg-white flex flex-col overflow-hidden relative shadow-2xl ring-1 ring-white/10 sm:rounded-[40px] shrink-0 my-auto"
                    }
                >
                    <div ref={phoneFrameRef} className="w-full h-full bg-white flex flex-col relative overflow-hidden">
                        
                        <StatusBar
                            showDynamicIsland={deviceSettings.showDynamicIsland}
                            timeText={deviceSettings.timeText}
                            signalBars={deviceSettings.signalBars}
                            batteryLevel={deviceSettings.batteryLevel}
                            theme="light"
                            waveColor={deviceSettings.diWaveColor}
                            image={deviceSettings.diPhotoUrl}
                        />

                        {/* Username/Header */}
                        <div className="w-full h-[52px] bg-white flex items-center justify-between px-6 shrink-0 z-20">
                            <div className="w-6" />
                            <div className="flex items-center cursor-pointer">
                                <div className="font-bold tracking-tight text-black items-center shrink-0 text-[24px]">
                                    {header.username}
                                </div>
                                <svg className="w-3.5 h-3.5 ml-1 mt-1" fill="black" viewBox="0 0 24 24">
                                    <path d="M12 17.502a1 1 0 0 1-.707-.293l-9-9.004a1 1 0 0 1 1.414-1.414L12 15.087l8.293-8.296a1 1 0 0 1 1.414 1.414l-9 9.004a1 1 0 0 1-.707.293Z" />
                                </svg>
                            </div>
                            <div className="w-6 flex justify-end items-center cursor-pointer">
                                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.547a3 3 0 0 0 3-3v-6.952" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                    <path d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.848" x2="20.076" y1="3.924" y2="7.153"></line>
                                </svg>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full px-4 pt-1 shrink-0 z-20">
                            <div className="flex items-center w-full h-[45px] rounded-full px-1" style={{ backgroundColor: '#EFF2F5' }}>
                                <svg viewBox="0 0 506 600" className="w-[35px] h-[35px] text-black opacity-80" fill="currentColor" stroke="none">
                                    <g transform="translate(0.000000,551.000000) scale(0.050000,-0.050000)">
                                        <path d="M3920 7860 c-150 -10 -233 -26 -290 -55 -44 -22 -131 -51 -194 -64 -62 -13 -134 -39 -160 -59 -25 -20 -73 -45 -106 -56 -146 -50 -512 -330 -660 -507 -150 -179 -230 -285 -230 -305 0 -12 -17 -40 -37 -63 -20 -22 -49 -72 -63 -111 -15 -38 -43 -91 -62 -116 -20 -26 -46 -98 -59 -160 -13 -63 -41 -149 -63 -192 -29 -56 -44 -146 -58 -335 -24 -339 4 -742 58 -849 22 -43 50 -129 63 -192 13 -62 39 -134 59 -160 19 -25 47 -77 62 -116 14 -38 43 -89 63 -111 20 -23 37 -51 37 -63 0 -20 79 -126 228 -303 147 -176 518 -460 662 -509 33 -11 78 -35 100 -55 22 -19 94 -46 160 -59 66 -14 155 -42 198 -64 172 -87 971 -88 1182 0 55 22 147 51 205 64 57 13 125 39 150 58 25 19 88 50 140 70 52 19 95 43 95 52 0 10 18 23 40 30 22 7 67 36 101 64 94 79 129 52 732 -551 l551 -552 135 -8 c197 -11 269 61 258 259 l-8 134 -546 547 c-582 583 -635 651 -563 727 22 23 40 53 40 65 0 12 23 49 51 82 27 33 60 90 73 127 12 36 38 89 57 117 20 27 49 99 66 160 17 60 45 149 63 199 18 49 38 168 45 264 l11 174 -70 70 c-88 88 -186 109 -304 64 -92 -35 -176 -227 -232 -529 -11 -58 -36 -130 -57 -160 -21 -29 -48 -87 -62 -128 -13 -41 -33 -80 -43 -86 -11 -7 -42 -47 -68 -90 -50 -78 -403 -439 -430 -439 -8 0 -48 -27 -90 -60 -42 -33 -90 -60 -108 -60 -18 0 -65 -22 -104 -49 -277 -188 -1219 -191 -1435 -5 -18 16 -63 38 -99 50 -68 23 -98 44 -305 211 -165 134 -389 406 -439 533 -15 39 -42 93 -60 120 -178 269 -178 1133 0 1400 18 28 45 82 60 120 50 127 274 399 439 533 207 167 237 188 305 211 36 12 81 34 99 50 133 115 840 195 1037 117 53 -21 169 -40 284 -46 l193 -10 72 77 c130 142 62 376 -122 420 -31 7 -96 31 -143 52 -55 24 -168 45 -310 57 -243 20 -280 20 -594 -1z" />
                                        <path d="M6235 7788 c-38 -39 -81 -109 -94 -155 -13 -46 -39 -105 -58 -133 -18 -27 -47 -85 -65 -128 -24 -60 -50 -86 -112 -110 -44 -18 -95 -44 -112 -59 -18 -14 -75 -39 -128 -55 -270 -81 -280 -290 -18 -368 45 -13 105 -40 132 -58 28 -18 84 -49 125 -67 52 -24 86 -58 110 -110 18 -41 49 -97 67 -125 18 -27 45 -87 58 -132 78 -259 288 -255 361 7 14 48 40 107 58 131 19 24 46 76 61 114 31 78 67 112 139 130 27 7 72 29 100 49 28 20 88 48 133 61 255 76 253 281 -2 360 -44 13 -102 39 -130 57 -27 18 -85 47 -128 65 -59 24 -86 51 -110 110 -18 43 -47 101 -65 128 -19 28 -45 87 -58 133 -22 76 -141 227 -179 227 -8 0 -47 -32 -85 -72z" />
                                    </g>
                                </svg>
                                <div className="w-full text-[18px] outline-none text-[#6f737a] select-none font-light leading-none">
                                    Search or ask Meta AI
                                </div>
                            </div>
                        </div>

                        {/* IG Notes Container */}
                        <div className="w-full px-4 pb-2 overflow-x-auto custom-scrollbar shrink-0 z-20 relative">
                            <div className="flex space-x-7 w-max">
                                {notesLayer.items.map((note) => (
                                    <div
                                        key={`${note.id}-${note.avatarUrl ? note.avatarUrl.length : 'default'}`}
                                        onClick={() => setReplyingNote(note)}
                                        className="cursor-pointer transition-transform active:scale-95"
                                    >
                                        <NoteItem
                                            username={note.username}
                                            text={note.text}
                                            music={note.music}
                                            avatarUrl={note.avatarUrl || DEFAULT_AVATAR}
                                            showLocation={note.showLocation}
                                            locationName={note.locationName}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section Title */}
                        <div className="w-full px-5 pt-2 pb-1 flex justify-between items-center shrink-0 z-20">
                            <span className="font-bold text-black text-[16px]">Messages</span>
                            <span className="text-[15px] text-[#737373] font-semibold cursor-pointer">Requests</span>
                        </div>

                        {/* Messages List */}
                        <div className="overflow-y-auto custom-scrollbar flex-1 pb-4 z-20">
                            {msgsLayer.items.map((m) => (
                                <MessageItem
                                    key={m.id}
                                    username={m.username}
                                    message={m.message}
                                    time={m.time}
                                    isRead={m.isRead}
                                    ringType={m.ringType}
                                    avatar={m.avatar || DEFAULT_AVATAR}
                                    storySeen={m.storySeen}
                                />
                            ))}
                        </div>

                        {/* FOOTER */}
                        <div className="w-full h-[53px] border-t-[0.5px] border-gray-200 bg-white flex justify-around items-center shrink-0 mt-auto px-2 z-20">
                            <button className="p-2 cursor-pointer hover:opacity-70 transition-opacity">
                                <svg aria-label="Home" className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="m21.762 8.786-7-6.68C13.266.68 10.734.68 9.238 2.106l-7 6.681A4.017 4.017 0 0 0 1 11.68V20c0 1.654 1.346 3 3 3h5.005a1 1 0 0 0 1-1L10 15c0-1.103.897-2 2-2 1.09 0 1.98.877 2 1.962L13.999 22a1 1 0 0 0 1 1H20c1.654 0 3-1.346 3-3v-8.32a4.021 4.021 0 0 0-1.238-2.894ZM21 20a1 1 0 0 1-1 1h-4.001L16 15c0-2.206-1.794-4-4-4s-4 1.794-4 4l.005 6H4a1 1 0 0 1-1-1v-8.32c0-.543.226-1.07.62-1.447l7-6.68c.747-.714 2.013-.714 2.76 0l7 6.68c.394.376.62.904.62 1.448V20Z"></path>
                                </svg>
                            </button>
                            <button className="p-2 cursor-pointer hover:opacity-70 transition-opacity">
                                <svg aria-label="Reels" className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.935 7.468c-.063-1.36-.307-2.142-.512-2.67a5.341 5.341 0 0 0-1.27-1.95 5.345 5.345 0 0 0-1.95-1.27c-.53-.206-1.311-.45-2.672-.513C15.333 1.012 14.976 1 12 1s-3.333.012-4.532.065c-1.36.063-2.142.307-2.67.512-.77.298-1.371.69-1.95 1.27a5.36 5.36 0 0 0-1.27 1.95c-.206.53-.45 1.311-.513 2.672C1.012 8.667 1 9.024 1 12s.012 3.333.065 4.532c.063 1.36.307 2.142.512 2.67.297.77.69 1.372 1.27 1.95.58.581 1.181.974 1.95 1.27.53.206 1.311.45 2.672.513C8.667 22.988 9.024 23 12 23s3.333-.012 4.532-.065c1.36-.063 2.142-.307 2.67-.512a5.33 5.33 0 0 0 1.95-1.27 5.356 5.356 0 0 0 1.27-1.95c.206-.53.45-1.311.513-2.672.053-1.198.065-1.555.065-4.531s-.012-3.333-.065-4.532Zm-1.998 8.972c-.05 1.07-.228 1.652-.38 2.04-.197.51-.434.874-.82 1.258a3.362 3.362 0 0 1-1.258.82c-.387.151-.97.33-2.038.379-1.162.052-1.51.063-4.441.063s-3.28-.01-4.44-.063c-1.07-.05-1.652-.228-2.04-.38a3.354 3.354 0 0 1-1.258-.82 3.362 3.362 0 0 1-.82-1.258c-.151-.387-.33-.97-.379-2.038C3.011 15.28 3 14.931 3 12s.01-3.28.063-4.44c.05-1.07.228-1.652.38-2.04.197-.51.434-.875.82-1.26a3.372 3.372 0 0 1 1.258-.819c.387-.15.97-.329 2.038-.378C8.72 3.011 9.069 3 12 3s3.28.01 4.44.063c1.07.05 1.652.228 2.04.38.51.197.874.433 1.258.82.385.382.622.747.82 1.258.151.387.33.97.379 2.038C20.989 8.72 21 9.069 21 12s-.01 3.28-.063 4.44Zm-4.584-6.828-5.25-3a2.725 2.725 0 0 0-2.745.01A2.722 2.722 0 0 0 6.988 9v6c0 .992.512 1.88 1.37 2.379.432.25.906.376 1.38.376.468 0 .937-.123 1.365-.367l5.25-3c.868-.496 1.385-1.389 1.385-2.388s-.517-1.892-1.385-2.388Zm-.993 3.04-5.25 3a.74.74 0 0 1-.748-.003.74.74 0 0 1-.374-.649V9a.74.74 0 0 1 .374-.65.737.737 0 0 1 .748-.002l5.25 3c.341.196.378.521.378.652s-.037.456-.378.651Z"></path>
                                </svg>
                            </button>
                            <button className="relative p-2 cursor-pointer hover:opacity-70 transition-opacity">
                                <svg aria-label="Direct" className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.513 3.576C21.826 2.552 20.617 2 19.384 2H4.621c-1.474 0-2.878.818-3.46 2.173-.6 1.398-.297 2.935.784 3.997l3.359 3.295a1 1 0 0 0 1.195.156l8.522-4.849a1 1 0 1 1 .988 1.738l-8.526 4.851a1 1 0 0 0-.477 1.104l1.218 5.038c.343 1.418 1.487 2.534 2.927 2.766.208.034.412.051.616.051 1.26 0 2.401-.644 3.066-1.763l7.796-13.118a3.572 3.572 0 0 0-.116-3.863Z"></path>
                                </svg>
                                {footer.showBadge && <div className="absolute bottom-2 right-1.5 bg-red-600 w-2 h-2 rounded-full border-[0.5px] border-white" />}
                            </button>
                            <button className="p-2 cursor-pointer hover:opacity-70 transition-opacity">
                                <svg aria-label="Search" className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <circle cx="10.5" cy="10.5" r="7.5"></circle>
                                    <line x1="21" y1="21" x2="15.8" y2="15.8"></line>
                                </svg>
                            </button>
                            <button className="p-2 cursor-pointer hover:opacity-70 transition-opacity">
                                <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                                    <img src={header.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                            </button>
                        </div>

                        <div className="h-[8px] bg-white flex justify-center items-end pb-2 w-full shrink-0"></div>
                        <div className="h-[24px] bg-white flex justify-center items-end pb-2 w-full shrink-0">
                            <div className="w-[134px] h-[5px] bg-black rounded-full"></div>
                        </div>
                    </div>

                    {/* OVERLAY REPLY NOTE */}
                    {replyingNote && (
                        <div className="absolute inset-0 z-[100] flex flex-col justify-end overflow-hidden">
                            <div
                                className="absolute inset-0 bg-black/40 transition-opacity"
                                onClick={() => setReplyingNote(null)}
                            />
                            <div className="relative w-full bg-white rounded-t-[32px] flex flex-col items-center pt-3 pb-4 shadow-2xl animate-in slide-in-from-bottom-10 duration-200 z-10">
                                <div className="w-10 h-[4px] bg-gray-300 rounded-full mb-4" />
                                <NoteDetailItem note={replyingNote} time="17h" />
                                <div className="w-full px-4 flex items-center gap-3 mt-6">
                                    <div className="flex-1 bg-[#f2f3f6] h-[45px] rounded-full flex items-center px-4 justify-between border border-transparent focus-within:border-gray-300">
                                        <span className="text-[15px] text-gray-500">Reply to {replyingNote.username}</span>
                                        <div className="flex gap-1.5 text-[20px]">
                                            <span>😘</span>
                                            <span>🎀</span>
                                            <span>😫</span>
                                        </div>
                                    </div>
                                    <button className="shrink-0 cursor-pointer">
                                        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="relative w-full shrink-0 flex flex-col justify-end items-center gap-[4px] z-10">
                                <Keyboard />
                            </div>
                        </div>
                    )}

                </div>

                {/* Mobile Export Buttons */}
                <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#18181b]/95 backdrop-blur-md border-t border-[#27272a] flex gap-3 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <button onClick={() => downloadImage(phoneFrameRef, "jpg", `dm-${header.username || "view"}`)} className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-3 rounded-xl text-sm font-bold transition-all border border-[#3f3f46]">Save JPG</button>
                    <button onClick={() => downloadImage(phoneFrameRef, "png", `dm-${header.username || "view"}`)} className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-900/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Save High-Res
                    </button>
                </div>
            </div>

            {/* === CONTROL PANEL === */}
            <div className={`w-full xl:w-[480px] shrink-0 xl:h-screen xl:sticky xl:top-0 z-40 ${mobileTab === "edit" ? 'block' : 'hidden xl:block'}`}>
                <MessagesControlPanel
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
                    header={header} setHeader={setHeader}
                    footer={footer} setFooter={setFooter}
                    notesLayer={notesLayer}
                    msgsLayer={msgsLayer}
                    exportData={{ phoneFrameRef, downloadImage }}
                />
            </div>

        </div>
    );
}