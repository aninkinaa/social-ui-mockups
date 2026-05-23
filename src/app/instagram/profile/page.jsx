"use client"
import NoteItem from "@/components/instagram/note-item";
import StatusBar from "@/components/status-bar";
import FeedsControlPanel from "./control-panel";
import React, { useState, useRef, useEffect } from "react";
import { useExport } from "@/hooks/useExport";
import { useArrayManager } from "@/hooks/useArrayManager";

const DEFAULT_AVATAR = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

export default function IGprofile() {
    const { downloadImage } = useExport();

    // === DEVICE STATE ===
    const [deviceSettings, setDeviceSettings] = useState({
        timeText: "00.04", batteryLevel: 65, signalBars: 4, showDynamicIsland: true, diWaveColor: "#1db954", diPhotoUrl: ""
    });

    // === PROFILE STATE ===
    const [profile, setProfile] = useState({
        username: "username",
        nickname: "nickname",
        avatar: DEFAULT_AVATAR,
        note: "It's so hot today!",
        pronouns: "she/her",
        posts: "12",
        followers: "1.000",
        following: "50",
    });

    const [bioProps, setBioProps] = useState({
        text: "meow",
        links: ["letterboxd.com/kinatofu", "open.spotify.com/kinatofu"],
        music: {
            title: "gift",
            artist: "suggi"
        }
    });

    const [action, setAction] = useState({ isFollowing: true });

    const [tabs, setTabs] = useState({ reels: true, repost: true });

    const highlightsLayer = useArrayManager([
        { id: 1, image: DEFAULT_AVATAR, title: ":v" }
    ]);

    const postsLayer = useArrayManager(
        Array(9).fill(null).map((_, i) => ({
            id: i + 1,
            image: "",
            isCarousel: i === 0
        }))
    );

    // === REFS & SYSTEM ===
    const phoneFrameRef = useRef(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [mobileTab, setMobileTab] = useState("preview");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
                setIsStandalone(true);
            }
        }
    }, []);

    const renderTextWithMentions = (text) => {
        return text.split(/(@\w+)/g).map((part, index) => {
            if (part.startsWith("@")) {
                return (
                    <span key={index} className="text-blue-600">
                        {part}
                    </span>
                );
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    };

    return (
        <div className={`bg-[#09090b] min-h-screen w-full flex flex-col xl:flex-row items-center justify-start xl:justify-center ${isStandalone ? 'p-0 gap-0' : 'py-0 xl:py-10 px-0 xl:px-4 gap-0 xl:gap-10'} font-sans overflow-x-hidden`}>

            {/* === MOBILE TABS === */}
            <div className="xl:hidden w-full sticky top-0 z-[100] bg-[#18181b] flex p-2 gap-2 shadow-md border-b border-[#27272a]">
                <button onClick={() => setMobileTab("preview")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mobileTab === "preview" ? 'bg-indigo-600 text-white' : 'bg-[#27272a] text-gray-400'}`}>Preview Result</button>
                <button onClick={() => setMobileTab("edit")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mobileTab === "edit" ? 'bg-indigo-600 text-white' : 'bg-[#27272a] text-gray-400'}`}>Edit Data</button>
            </div>

            {/* === CONTROL PANEL === */}
            <div className={`w-full xl:w-auto flex justify-center ${mobileTab === "edit" ? 'flex relative' : 'absolute opacity-0 pointer-events-none -z-50 xl:relative xl:opacity-100 xl:pointer-events-auto xl:z-auto xl:flex'}`}>
                <FeedsControlPanel
                    statusBar={{
                        ...deviceSettings,
                        setTimeText: (val) => setDeviceSettings(prev => ({ ...prev, timeText: val })),
                        setBatteryLevel: (val) => setDeviceSettings(prev => ({ ...prev, batteryLevel: val })),
                        setSignalBars: (val) => setDeviceSettings(prev => ({ ...prev, signalBars: val })),
                        setShowDynamicIsland: (val) => setDeviceSettings(prev => ({ ...prev, showDynamicIsland: val })),
                        setDiWaveColor: (val) => setDeviceSettings(prev => ({ ...prev, diWaveColor: val })),
                        diPhoto: {
                            handleUpload: (base64) => setDeviceSettings(prev => ({ ...prev, diPhotoUrl: base64 }))
                        }
                    }}
                    profile={profile} setProfile={setProfile}
                    bioProps={bioProps} setBioProps={setBioProps}
                    action={action} setAction={setAction}
                    highlightsLayer={highlightsLayer}
                    postsLayer={postsLayer}
                    tabs={tabs} setTabs={setTabs}
                    exportData={{ phoneFrameRef, downloadImage }}
                />
            </div>

            {/* === PHONE FRAME === */}
            <div className={`relative w-full xl:w-auto flex justify-center py-6 xl:py-0 ${mobileTab === "preview" ? 'flex relative' : 'absolute opacity-0 pointer-events-none -z-50 xl:relative xl:opacity-100 xl:pointer-events-auto xl:z-auto xl:flex'}`}>
                <div ref={phoneFrameRef} className={isStandalone ? "w-full h-[100dvh] bg-white flex flex-col overflow-hidden" : "w-[393px] max-w-[100vw] h-[852px] bg-white flex flex-col overflow-hidden relative shadow-2xl ring-1 ring-white/10 sm:rounded-[40px] shrink-0"}>

                    <StatusBar
                        showDynamicIsland={deviceSettings.showDynamicIsland}
                        timeText={deviceSettings.timeText}
                        signalBars={deviceSettings.signalBars}
                        batteryLevel={deviceSettings.batteryLevel}
                        theme="light"
                        waveColor={deviceSettings.diWaveColor}
                        image={deviceSettings.diPhotoUrl}
                    />

                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-4">

                        {/* Username/Header */}
                        <div className="bg-white flex py-2 justify-between items-center text-black mx-4 shrink-0">
                            <div className="flex items-center gap-3 -ml-1.5">
                                <svg aria-label="Back" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                                <div className="font-bold text-xl">{profile.username}</div>
                            </div>
                            <div className="flex gap-6 items-center">
                                {action.isFollowing && (
                                    <svg fill="black" height="24" viewBox="0 0 24 24" width="24">
                                        <path d="m21.306 14.019-.484-.852A6.358 6.358 0 0 1 20 9.997a7.953 7.953 0 0 0-4.745-7.302 3.971 3.971 0 0 0-6.51.002 7.95 7.95 0 0 0-4.74 7.323 6.337 6.337 0 0 1-.83 3.175l-.468.823a4.001 4.001 0 0 0 3.476 5.983h1.96a3.98 3.98 0 0 0 7.716 0h1.964a4.004 4.004 0 0 0 3.482-5.982Zm-9.304 6.983a1.993 1.993 0 0 1-1.722-1.001h3.444a1.993 1.993 0 0 1-1.722 1.001Zm7.554-3.997a1.986 1.986 0 0 1-1.732.996H6.184a2.002 2.002 0 0 1-1.74-2.993l.47-.822a8.337 8.337 0 0 0 1.093-4.174 5.962 5.962 0 0 1 3.781-5.584.996.996 0 0 0 .494-.426 1.976 1.976 0 0 1 3.439 0 1 1 0 0 0 .494.425 5.989 5.989 0 0 1 3.786 5.634 8.303 8.303 0 0 0 1.082 4.094l.483.852a1.984 1.984 0 0 1-.01 1.998Z"></path>
                                    </svg>
                                )}
                                <div className="flex gap-0.5">
                                    <div className="bg-black size-1 rounded-full" />
                                    <div className="bg-black size-1 rounded-full" />
                                    <div className="bg-black size-1 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Avatar and Stats */}
                        <div className="flex text-black gap-6 mx-4 mt-2 shrink-0">
                            <div className="relative shrink-0">
                                {!profile.note ? (
                                    <NoteItem
                                        text={profile.note}
                                        username=""
                                        avatarUrl={profile.avatar || DEFAULT_AVATAR}
                                        maxLines={2}
                                        className="mt-0"
                                        hide={!profile.note} />
                                ) : (
                                    <NoteItem
                                        text={profile.note}
                                        username=""
                                        avatarUrl={profile.avatar || DEFAULT_AVATAR}
                                        maxLines={2}
                                        className="mt-4"
                                        bubbleMaxWidth="max-w-22" />
                                )}
                            </div>

                            <div className="flex flex-col gap-2 justify-center flex-1">
                                <div className="flex gap-1 text-sm">
                                    {profile.nickname && (
                                        <div className="font-semibold">{profile.nickname}</div>
                                    )}
                                    {profile.pronouns && (
                                        <div className="text-gray-500">{profile.pronouns}</div>
                                    )}
                                </div>

                                <div className="flex justify-start gap-10">
                                    <div><div className="font-semibold">{profile.posts}</div><div className="text-sm">posts</div></div>
                                    <div><div className="font-semibold">{profile.followers}</div><div className="text-sm">followers</div></div>
                                    <div><div className="font-semibold">{profile.following}</div><div className="text-sm">following</div></div>
                                </div>
                            </div>
                        </div>

                        {/* Bio, Link, and Music */}
                        <div className="text-sm text-black mx-4 mt-2 shrink-0">
                            {bioProps.text && <div className="whitespace-pre-wrap">{renderTextWithMentions(bioProps.text)}</div>}

                            {bioProps.links.length > 0 && (
                                <div className="mt-0.5">
                                    {bioProps.links.length > 1 ? (
                                        <div className="flex gap-1 items-center">
                                            <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16"><path d="m9.726 5.123 1.228-1.228a6.47 6.47 0 0 1 9.15 9.152l-1.227 1.227m-4.603 4.603-1.228 1.228a6.47 6.47 0 0 1-9.15-9.152l1.227-1.227" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="8.471" x2="15.529" y1="15.529" y2="8.471"></line></svg>
                                            <div className="font-semibold">
                                                {bioProps.links[0]} and {bioProps.links.length - 1} more
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-1 items-center text-blue-600">
                                            <svg fill="blue" height="16" viewBox="0 0 24 24" width="16">
                                                <path d="m9.726 5.123 1.228-1.228a6.47 6.47 0 0 1 9.15 9.152l-1.227 1.227m-4.603 4.603-1.228 1.228a6.47 6.47 0 0 1-9.15-9.152l1.227-1.227" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                                <line fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="8.471" x2="15.529" y1="15.529" y2="8.471"></line>
                                            </svg>
                                            <div className="font-normal text-blue-600">
                                                {bioProps.links[0]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {bioProps.music && (
                                <div className="flex items-center gap-1 text-sm mt-1 w-full justify-start">
                                    <div className="flex items-center justify-center w-6 h-6 overflow-hidden -ml-1 shrink-0">
                                        <svg className="w-5 h-5 text-black" viewBox="0 0 1179 1056" preserveAspectRatio="xMidYMid meet">
                                            <g transform="translate(0,1056) scale(0.1,-0.1)" fill="currentColor" stroke="none">
                                                <path d="M5720 9603 c-351 -26 -551 -54 -659 -90 -41 -13 -174 -45 -295 -69 -175 -36 -232 -51 -276 -76 -107 -60 -146 -78 -205 -94 -114 -30 -196 -66 -249 -110 -36 -29 -90 -57 -158 -84 -72 -28 -120 -54 -158 -86 -30 -25 -104 -69 -165 -98 -83 -40 -118 -63 -141 -92 -18 -22 -62 -56 -104 -79 -40 -22 -87 -56 -104 -76 -17 -20 -58 -56 -91 -81 -97 -74 -398 -396 -432 -463 -12 -23 -47 -64 -78 -90 -37 -32 -67 -70 -91 -116 -20 -37 -57 -87 -83 -111 -32 -29 -62 -74 -96 -142 -28 -54 -74 -125 -102 -159 -29 -33 -62 -84 -73 -114 -28 -75 -58 -134 -84 -163 -39 -43 -85 -137 -106 -214 -21 -77 -52 -141 -102 -209 -30 -43 -46 -92 -78 -247 -24 -118 -56 -226 -94 -316 -66 -157 -81 -335 -80 -949 0 -316 5 -525 13 -590 18 -151 46 -271 85 -362 20 -47 51 -153 71 -245 41 -188 53 -220 98 -285 38 -55 67 -121 92 -208 21 -74 56 -144 85 -170 25 -22 70 -107 101 -190 12 -32 41 -77 69 -108 27 -29 72 -100 102 -158 36 -69 71 -121 105 -155 28 -28 65 -78 81 -110 18 -36 50 -76 81 -103 28 -24 63 -65 78 -90 45 -78 367 -422 441 -471 24 -16 60 -48 81 -72 21 -24 71 -61 111 -83 41 -23 87 -57 106 -81 18 -22 44 -45 56 -51 13 -6 61 -29 108 -51 47 -22 107 -59 133 -82 32 -28 86 -58 163 -90 63 -27 131 -61 150 -77 60 -47 106 -72 179 -94 39 -11 93 -28 120 -36 28 -8 85 -35 127 -60 87 -50 132 -64 300 -93 64 -12 174 -37 245 -57 162 -45 185 -49 373 -73 362 -45 614 -49 980 -15 239 22 365 42 449 70 87 30 155 46 342 80 145 26 194 43 274 94 28 18 88 43 135 57 147 44 219 75 271 116 50 39 107 68 201 102 25 9 65 31 88 49 89 69 138 98 205 124 53 21 83 41 125 84 30 30 85 72 121 92 36 20 84 56 107 81 23 25 57 56 77 69 34 23 101 84 137 123 9 11 37 39 62 64 25 24 63 68 83 97 21 28 50 59 65 67 14 9 48 49 74 89 26 39 72 97 103 127 31 30 67 77 80 104 12 27 47 72 76 101 40 38 65 76 99 147 25 53 65 118 89 144 57 65 72 90 102 171 14 37 45 93 69 123 55 70 78 116 106 210 24 82 60 158 95 206 33 43 52 93 70 182 40 193 58 258 95 351 54 134 77 269 91 536 13 239 6 870 -11 1037 -13 138 -45 279 -75 338 -27 53 -63 179 -90 318 -23 117 -49 186 -90 242 -41 56 -60 99 -87 194 -21 78 -50 140 -82 176 -38 42 -83 122 -107 189 -15 41 -39 81 -70 115 -26 29 -73 101 -103 160 -39 75 -72 123 -105 155 -27 25 -63 74 -80 108 -20 40 -48 76 -82 105 -28 24 -65 66 -80 94 -29 51 -93 124 -108 124 -4 0 -26 26 -49 58 -43 61 -234 252 -291 292 -19 13 -49 40 -67 60 -18 20 -63 54 -101 75 -37 22 -93 65 -124 95 -40 40 -74 62 -120 79 -59 22 -118 59 -212 131 -21 16 -60 37 -85 46 -94 34 -157 65 -198 100 -54 44 -122 74 -248 109 -54 16 -112 38 -130 49 -91 61 -135 76 -337 116 -112 22 -244 53 -294 69 -119 38 -114 37 -310 60 -301 36 -596 48 -785 34z m416 -818 c54 -8 202 -24 328 -35 309 -28 429 -52 526 -105 91 -50 127 -64 215 -83 118 -26 193 -55 245 -95 73 -55 92 -65 187 -103 67 -26 110 -51 151 -87 33 -30 95 -68 147 -92 82 -38 155 -92 155 -115 0 -5 34 -30 76 -56 51 -32 89 -64 115 -101 22 -29 44 -53 48 -53 18 0 113 -94 131 -130 10 -20 46 -61 80 -90 36 -31 71 -73 86 -101 13 -27 50 -76 83 -109 37 -39 76 -96 109 -158 28 -53 73 -121 100 -149 36 -39 58 -75 81 -137 19 -48 50 -105 73 -132 53 -64 81 -122 107 -219 12 -44 35 -105 51 -135 98 -182 90 -156 164 -590 20 -113 41 -236 48 -275 27 -150 13 -654 -23 -797 -5 -20 -14 -67 -19 -105 -24 -174 -71 -425 -90 -474 -11 -30 -34 -77 -50 -103 -35 -55 -63 -124 -86 -210 -19 -74 -52 -140 -96 -192 -18 -22 -44 -65 -57 -95 -58 -132 -74 -159 -112 -195 -22 -22 -63 -83 -92 -138 -35 -67 -69 -116 -104 -149 -28 -27 -66 -76 -83 -108 -18 -35 -53 -77 -86 -106 -31 -26 -69 -69 -84 -97 -26 -44 -100 -116 -121 -116 -5 0 -27 -25 -50 -56 -25 -34 -66 -72 -107 -99 -37 -24 -87 -64 -112 -90 -31 -33 -73 -60 -135 -89 -52 -25 -115 -64 -149 -94 -43 -38 -83 -61 -153 -88 -52 -20 -120 -56 -152 -80 -74 -56 -129 -79 -271 -115 -69 -17 -151 -47 -205 -74 -145 -73 -183 -80 -700 -130 -88 -9 -178 -20 -200 -25 -61 -14 -291 -12 -375 4 -41 8 -160 22 -265 31 -383 32 -483 53 -624 126 -46 23 -124 51 -194 69 -139 35 -196 58 -251 104 -46 38 -102 67 -161 86 -55 17 -115 53 -172 102 -26 23 -88 60 -138 84 -62 29 -104 56 -135 89 -25 26 -75 66 -111 89 -38 25 -81 64 -103 94 -21 29 -56 64 -79 80 -23 15 -55 47 -72 72 -16 24 -62 75 -101 114 -39 39 -84 93 -99 120 -15 28 -53 77 -84 110 -32 34 -76 98 -100 146 -24 47 -67 110 -96 141 -28 31 -59 78 -70 105 -29 77 -65 146 -96 182 -40 45 -74 116 -94 193 -22 84 -50 150 -97 225 -40 64 -67 160 -88 309 -11 81 -29 185 -55 330 -8 44 -19 107 -25 139 -5 33 -10 184 -10 337 l0 277 60 367 c61 370 84 459 130 510 23 25 63 120 86 205 22 82 46 131 96 197 22 29 54 85 72 125 47 107 60 129 101 168 20 19 57 76 82 125 29 57 67 113 105 153 32 35 73 88 90 118 17 30 55 76 85 102 30 26 64 63 75 82 29 48 66 87 115 121 23 16 57 50 74 75 18 27 59 64 98 89 36 24 86 64 111 90 30 32 75 61 137 91 50 24 112 62 138 84 58 50 116 83 185 105 61 20 86 34 145 82 55 43 112 66 257 104 121 31 177 53 228 90 40 30 203 66 370 83 398 41 545 57 549 61 10 11 246 4 337 -10z" />
                                                <path d="M5018 7256 c-75 -23 -78 -25 -187 -135 l-110 -112 -17 -77 c-17 -72 -18 -185 -19 -1617 l0 -1540 23 -70 c12 -38 28 -80 35 -91 20 -36 106 -101 186 -141 42 -21 98 -50 124 -65 26 -16 59 -28 73 -28 44 0 135 29 219 70 44 21 103 46 130 56 34 12 69 36 108 75 33 32 93 78 135 101 42 23 95 58 117 78 65 59 117 96 172 124 28 14 69 46 89 70 21 25 64 59 98 77 34 18 88 58 121 89 33 31 96 76 139 101 43 24 110 72 147 105 38 34 92 73 121 87 30 14 78 51 109 84 34 34 83 72 122 92 36 18 85 54 109 80 24 25 80 66 124 90 43 24 105 69 136 99 31 30 85 71 120 91 62 36 64 38 117 146 45 93 55 124 64 198 10 85 10 90 -15 140 -15 29 -34 76 -44 106 -12 39 -31 68 -64 100 -26 25 -78 76 -116 113 -38 36 -91 78 -119 91 -27 14 -72 49 -100 77 -27 28 -79 67 -115 86 -36 19 -99 63 -141 97 -41 35 -107 83 -147 106 -39 23 -86 60 -104 82 -18 22 -59 54 -92 70 -32 17 -89 59 -126 94 -37 35 -86 73 -109 85 -71 36 -144 86 -181 124 -19 20 -67 55 -107 76 -43 24 -87 58 -110 85 -23 28 -67 62 -110 85 -39 22 -91 61 -115 86 -24 25 -68 59 -98 76 -108 58 -151 85 -183 115 -49 47 -106 71 -198 83 -108 13 -119 12 -211 -14z" />
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="-ml-1 truncate flex-1 min-w-0 pr-2">
                                        <span className="font-semibold">{bioProps.music.title}</span>
                                        <span className="text-gray-500">{" · "}{bioProps.music.artist}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Following / Actions Buttons */}
                        <div className="grid grid-cols-2 mx-4 gap-1.5 py-3 shrink-0">
                            {action.isFollowing ? (
                                <div className="bg-gray-100 flex justify-center items-center rounded-lg text-green-500 text-sm font-semibold gap-1 py-1.5 cursor-pointer">
                                    <div>Following</div>
                                    <svg className="w-3.5 h-3.5 mt-[1px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            ) : (
                                <div className="bg-[#0095f6] flex justify-center items-center rounded-lg text-white text-sm font-semibold py-1.5 cursor-pointer">
                                    <div>Follow</div>
                                </div>
                            )}

                            <div className="flex flex-1 gap-1.5 justify-between rounded-lg text-black text-sm font-semibold">
                                <div className="flex justify-center items-center w-full bg-gray-100 rounded-md py-1.5"><div>Message</div></div>
                                <div className="flex justify-center items-center bg-gray-100 rounded-md p-1.5">
                                    <svg height="18px" viewBox="0 0 368 376" fill="currentColor">
                                        <g transform="translate(0.000000,376.000000) scale(0.050000,-0.050000)" stroke="none">
                                            <path d="M4220 5899 c-38 -9 -106 -36 -149 -58 -44 -23 -95 -41 -114 -41 -19 0 -59 -21 -90 -47 -32 -26 -72 -55 -89 -65 -68 -38 -273 -304 -339 -438 -77 -156 -106 -659 -43 -735 14 -17 50 -81 80 -143 114 -235 322 -428 578 -535 221 -93 577 -98 736 -11 55 29 113 54 130 54 105 0 415 327 522 550 75 157 104 661 42 735 -14 17 -50 81 -80 143 -211 435 -740 699 -1184 591z m517 -553 c325 -212 406 -597 180 -854 -305 -347 -722 -330 -982 38 l-85 120 0 190 c0 155 7 201 39 250 225 345 558 446 848 256z" />
                                            <path d="M1887 4873 l-87 -88 0 -248 c0 -312 15 -297 -297 -297 l-248 0 -88 -87 c-119 -120 -119 -186 0 -306 l88 -87 248 0 c312 0 297 15 297 -297 l0 -248 89 -89 c116 -116 199 -113 316 12 l75 80 0 247 c0 309 -15 295 297 295 l248 0 88 87 c119 120 119 186 0 306 l-88 87 -250 0 c-306 0 -290 -16 -298 306 l-7 257 -84 78 c-117 109 -183 107 -299 -8z" />
                                            <path d="M4210 3458 c-33 -9 -162 -31 -286 -47 -162 -22 -249 -44 -310 -79 -46 -26 -113 -54 -148 -61 -35 -8 -75 -28 -89 -45 -15 -17 -64 -48 -110 -67 -47 -20 -102 -53 -124 -73 -21 -20 -110 -94 -197 -165 -255 -209 -426 -469 -426 -646 0 -296 280 -508 731 -555 120 -13 294 -41 385 -62 309 -73 1420 -72 1614 2 31 12 179 35 328 52 528 61 772 243 772 578 0 406 -796 1042 -1405 1122 -118 15 -241 37 -273 48 -71 24 -379 23 -462 -2z m670 -516 c127 -25 244 -58 261 -73 17 -15 71 -46 120 -70 245 -116 481 -314 542 -455 46 -108 38 -117 -123 -135 -60 -6 -186 -25 -280 -41 -443 -78 -546 -88 -880 -88 -385 1 -786 28 -869 60 -29 11 -165 34 -302 51 -340 41 -329 36 -280 153 48 115 483 476 574 476 10 0 43 17 73 39 34 24 144 55 293 81 132 23 244 46 250 52 23 23 405 -8 621 -50z" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        {highlightsLayer.items.length > 0 && (
                            <div className="flex mx-4 py-1 gap-5 overflow-x-auto custom-scrollbar shrink-0">
                                {highlightsLayer.items.map((h) => (
                                    <div key={h.id} className="flex flex-col gap-1 justify-center items-center">
                                        <div className="w-[64px] h-[64px] rounded-full p-[3px] border-3 border-gray-300">
                                            <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                                                <img src={h.image || DEFAULT_AVATAR} alt={h.title} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="text-black text-xs">{h.title}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tab Bar Dynamic */}
                        <div className={`grid ${tabs.reels && tabs.repost ? 'grid-cols-4' : tabs.reels || tabs.repost ? 'grid-cols-3' : 'grid-cols-2'} w-full mt-2 shrink-0 border border-b-1 border-white`}>
                            <div className="flex justify-center items-center">
                                <div className="border-b-[2px] border-black py-2.5 text-black px-3">
                                    <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><rect height="6" rx="1" ry="1" width="4.667" x="3" y="1"></rect><rect height="6" rx="1" ry="1" width="4.667" x="16.333" y="1"></rect><rect height="6" rx="1" ry="1" width="4.667" x="9.667" y="1"></rect><rect height="6" rx="1" ry="1" width="4.667" x="3" y="9"></rect><rect height="6" rx="1" ry="1" width="4.667" x="16.333" y="9"></rect><rect height="6" rx="1" ry="1" width="4.667" x="9.667" y="9"></rect><rect height="6" rx="1" ry="1" width="4.667" x="3" y="17"></rect><rect height="6" rx="1" ry="1" width="4.667" x="16.333" y="17"></rect><rect height="6" rx="1" ry="1" width="4.667" x="9.667" y="17"></rect></svg>
                                </div>
                            </div>

                            {tabs.reels && (
                                <div className="flex justify-center items-center text-gray-400 py-2.5">
                                    <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M22.935 7.468c-.063-1.36-.307-2.142-.512-2.67a5.341 5.341 0 0 0-1.27-1.95 5.345 5.345 0 0 0-1.95-1.27c-.53-.206-1.311-.45-2.672-.513C15.333 1.012 14.976 1 12 1s-3.333.012-4.532.065c-1.36.063-2.142.307-2.67.512-.77.298-1.371.69-1.95 1.27a5.36 5.36 0 0 0-1.27 1.95c-.206.53-.45 1.311-.513 2.672C1.012 8.667 1 9.024 1 12s.012 3.333.065 4.532c.063 1.36.307 2.142.512 2.67.297.77.69 1.372 1.27 1.95.58.581 1.181.974 1.95 1.27.53.206 1.311.45 2.672.513C8.667 22.988 9.024 23 12 23s3.333-.012 4.532-.065c1.36-.063 2.142-.307 2.67-.512a5.33 5.33 0 0 0 1.95-1.27 5.356 5.356 0 0 0 1.27-1.95c.206-.53.45-1.311.513-2.672.053-1.198.065-1.555.065-4.531s-.012-3.333-.065-4.532Zm-1.998 8.972c-.05 1.07-.228 1.652-.38 2.04-.197.51-.434.874-.82 1.258a3.362 3.362 0 0 1-1.258.82c-.387.151-.97.33-2.038.379-1.162.052-1.51.063-4.441.063s-3.28-.01-4.44-.063c-1.07-.05-1.652-.228-2.04-.38a3.354 3.354 0 0 1-1.258-.82 3.362 3.362 0 0 1-.82-1.258c-.151-.387-.33-.97-.379-2.038C3.011 15.28 3 14.931 3 12s.01-3.28.063-4.44c.05-1.07.228-1.652.38-2.04.197-.51.434-.875.82-1.26a3.372 3.372 0 0 1 1.258-.819c.387-.15.97-.329 2.038-.378C8.72 3.011 9.069 3 12 3s3.28.01 4.44.063c1.07.05 1.652.228 2.04.38.51.197.874.433 1.258.82.385.382.622.747.82 1.258.151.387.33.97.379 2.038C20.989 8.72 21 9.069 21 12s-.01 3.28-.063 4.44Zm-4.584-6.828-5.25-3a2.725 2.725 0 0 0-2.745.01A2.722 2.722 0 0 0 6.988 9v6c0 .992.512 1.88 1.37 2.379.432.25.906.376 1.38.376.468 0 .937-.123 1.365-.367l5.25-3c.868-.496 1.385-1.389 1.385-2.388s-.517-1.892-1.385-2.388Zm-.993 3.04-5.25 3a.74.74 0 0 1-.748-.003.74.74 0 0 1-.374-.649V9a.74.74 0 0 1 .374-.65.737.737 0 0 1 .748-.002l5.25 3c.341.196.378.521.378.652s-.037.456-.378.651Z"></path></svg>
                                </div>
                            )}

                            {tabs.repost && (
                                <div className="flex justify-center items-center text-gray-400 py-2.5">
                                    <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title></title><path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"></path></svg>                            </div>
                            )}

                            <div className="flex justify-center items-center text-gray-400 py-2.5">
                                <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M21 7.48a2 2 0 0 0-2-2h-3.046a2.002 2.002 0 0 1-1.506-.683l-1.695-1.939a1 1 0 0 0-1.506 0L9.552 4.797c-.38.434-.93.682-1.506.682H5a2 2 0 0 0-2 2V19l.01.206A2 2 0 0 0 5 21h14a2 2 0 0 0 2-2V7.48ZM23 19a4 4 0 0 1-4 4H5a4 4 0 0 1-3.995-3.794L1 19V7.48a4 4 0 0 1 4-4h3.046l1.696-1.94a3 3 0 0 1 4.516 0l1.696 1.94H19a4 4 0 0 1 4 4V19Z"></path><path d="M14.5 10.419a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Zm2 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM12 16.003c3.511 0 6.555 1.99 8.13 4.906a1 1 0 0 1-1.76.95c-1.248-2.31-3.64-3.857-6.37-3.857S6.878 19.55 5.63 21.86a1 1 0 0 1-1.76-.951c1.575-2.915 4.618-4.906 8.13-4.906Z"></path></svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-[1px] w-full bg-white pb-[1px]">
                            {postsLayer.items.map((post) => (
                                <div key={post.id} className="relative bg-gray-200 h-43">
                                    {post.image && (
                                        <img src={post.image} alt="post" className="w-full h-full object-cover" />
                                    )}

                                    {post.isCarousel && (
                                        <div className="absolute top-2 right-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                            <svg aria-label="Carousel" className="x1lliihq x1n2onr6 x9bdzbf" fill="currentColor" height="20" role="img" viewBox="0 0 48 48" width="20"><title>Carousel</title><path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path></svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="h-[24px] absolute bottom-0 flex justify-center items-end pb-2 w-full shrink-0">
                            <div className="w-[134px] h-[5px] bg-black rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Mobile Export Buttons */}
                <div className="xl:hidden fixed bottom-0 left-0 right-0 p-5 bg-[#09090b]/90 backdrop-blur-md border-t border-white/10 flex gap-3 z-[100] pb-10">
                    <button onClick={() => downloadImage(phoneFrameRef, "jpg", `feeds-${profile.username}`)} className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-3 rounded-xl text-sm font-bold transition-all border border-[#3f3f46]">Save JPG</button>
                    <button onClick={() => downloadImage(phoneFrameRef, "png", `feeds-${profile.username}`)} className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-900/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Save High-Res
                    </button>
                </div>
            </div>
        </div>
    )
}