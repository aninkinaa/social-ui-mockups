import React, { useState, useEffect, useRef } from 'react';

const NoteItem = ({
    text = "",
    music = null,
    username = "",
    avatarUrl = "",
    showLocation = false,
    locationName = "",
    maxLines = null,
    className = "",
    bubbleMaxWidth = ""
}) => {

    const textRef = useRef(null);
    const [actualLines, setActualLines] = useState(1);

    useEffect(() => {
        if (textRef.current) {
            const height = textRef.current.clientHeight;
            const calculatedLines = Math.max(1, Math.round(height / 14.4));
            setActualLines(calculatedLines);
        } else if (!text) {
            setActualLines(0);
        }
    }, [text]);

    const getBubblePosition = () => {
        let totalLines = actualLines;

        if (text.trim() === "" && music) totalLines = 2;
        else if (music) totalLines += 2;

        if (totalLines <= 2) return "-translate-y-[85%]";
        if (totalLines === 3) return "-translate-y-[85%]";
        if (totalLines >= 4) return "-translate-y-[66%]";
        return "-translate-y-[60%]";
    };

    const renderTextWithMentions = (text) => {
        return text.split(/(@\w+)/g).map((part, index) => {
            if (part.startsWith("@")) {
                return (
                    <span key={index} className="font-semibold">
                        {part}
                    </span>
                );
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    };

    const getTextClasses = () => {
        const clamp = maxLines ?? (music ? 2 : 4);
        const clampClass = ['', 'line-clamp-1', 'line-clamp-2', 'line-clamp-3', 'line-clamp-4'][clamp] ?? 'line-clamp-4';
        const maxH = music ? 'max-h-[40px]' : `max-h-[${clamp * 18}px]`;
        return { clampClass, maxH };
    };

    return (
        <div className={`flex flex-col items-center w-[80px] shrink-0 relative cursor-pointer ${className || 'mt-11'}`}>

            {/* THE BUBBLE SYSTEM */}
            {(text || music) && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-max flex flex-col items-center z-[19] ${getBubblePosition(text)}`}>
                    <div className="relative flex flex-col items-start w-max">

                        {/* Main Bubble */}
                        <div className={`relative flex flex-col z-20 w-fit ${bubbleMaxWidth || 'max-w-25'}`}>

                            <div className="absolute inset-0 bg-white rounded-[15px] border border-gray-50 z-0 transform-gpu" style={{ filter: "drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.13))" }}></div>

                            {/* Content */}
                            <div className="px-1.5 pt-2.5 py-2 text-center relative z-10 flex flex-col items-center w-full max-w-full">

                                {/* MUSIC */}
                                {music && (
                                    <div className="flex flex-col items-center w-full px-1 gap-0">
                                        <div className="flex items-center justify-center gap-1 w-full overflow-hidden min-h-0">
                                            {/* Equalizer */}
                                            <style>{`
                                                @keyframes eq1 { 0%, 100% { height: 3px; } 50% { height: 7px; } }
                                                @keyframes eq2 { 0%, 100% { height: 8px; } 50% { height: 3px; } }
                                                @keyframes eq3 { 0%, 100% { height: 4px; } 50% { height: 8px; } }
                                            `}</style>
                                            <div className="flex gap-[1.5px] items-center shrink-0 h-[8px]">
                                                <div className="bg-[#111] w-[1.5px] rounded-full" style={{ animation: "eq1 0.9s ease-in-out infinite" }} />
                                                <div className="bg-[#111] w-[1.5px] rounded-full" style={{ animation: "eq2 0.9s ease-in-out infinite" }} />
                                                <div className="bg-[#111] w-[1.5px] rounded-full" style={{ animation: "eq3 0.9s ease-in-out infinite" }} />
                                            </div>

                                            {/* Container Marquee */}
                                            {music?.title?.length > 11 ? (
                                                <div
                                                    className="relative flex-1 overflow-hidden min-h-0"
                                                    style={{
                                                        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                                                        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                                                    }}
                                                >
                                                    <div className="whitespace-nowrap flex">
                                                        <span className="marquee-text block text-[10px] font-bold text-black pr-8 leading-none">
                                                            {music.title}
                                                        </span>
                                                        <span className="marquee-text block text-[10px] font-bold text-black leading-none">
                                                            {music.title}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative overflow-hidden">
                                                    <div className="block leading-none text-[10px] font-bold text-black truncate max-w-full align-middle">
                                                        {music.title}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Artist Name */}
                                        <div className="text-[11px] text-[#737373] font-medium truncate w-full text-center">
                                            {music.artist}
                                        </div>
                                    </div>
                                )}

                                {/* TEKS */}
                                {text && (() => {
                                    const { clampClass, maxH } = getTextClasses();
                                    return (
                                        <div className={`text-[11px] font-medium text-[#262626] leading-none text-center overflow-hidden w-full ${maxH}`}>
                                            <p ref={textRef} className={`${clampClass} break-words`}>
                                                {renderTextWithMentions(text)}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* TAIL ASSEMBLY */}
                        <div className="relative z-[20] -mt-2.5 w-full">
                            <svg className="absolute top-0 left-[12px] w-[18px] h-[14px] text-white" viewBox="0 0 4 1" fill="currentColor">
                                <path d="M 0 0 A 1 1 0 0 0 4 0" />
                            </svg>
                            <div className="absolute top-[15px] left-[23px] w-[6px] h-[6px] bg-white rounded-full z-[19] transform-gpu" style={{ filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))" }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Avatar Container */}
            <div className="w-[80px] h-[80px] rounded-full bg-gray-200 relative shrink-0 z-10 overflow-hidden border-[0.5px] border-gray-200">

                <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&size=512&background=random`} alt={username} className="w-full h-full object-cover" />
            </div>

            {/* Username / Label */}
            <div className={`text-[12px] mt-0.5 font-light block w-[100px] truncate text-center ${username?.toLowerCase() === "your note" ? "text-[#737373]" : "text-black"}`}>
                {username}
            </div>

            {showLocation && (
                <div className="flex items-center justify-center space-x-0.5 w-[90px]">
                    <div className="flex items-center justify-center w-full">
                        {locationName === "Location off" ? (
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="w-[13px] h-[13px] text-[#FF0033] shrink-0" viewBox="0 0 66.000000 76.000000" preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,76.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                                    <path d="M135 540 c-9 -15 12 -40 87 -105 96 -83 140 -125 236 -233 80 -89 113 -109 125 -77 4 9 -17 36 -55 72 -33 32 -67 64 -74 71 -15 14 -15 14 48 141 52 108 41 114 -90 51 -45 -22 -88 -40 -96 -40 -8 0 -42 29 -77 65 -58 61 -90 78 -104 55z" />
                                    <path d="M190 364 c-19 -8 -43 -17 -52 -20 -21 -7 -24 -43 -5 -48 163 -48 151 -40 173 -124 18 -67 23 -77 43 -77 18 0 26 10 42 54 19 55 19 55 -71 143 -50 48 -91 87 -93 87 -1 -1 -18 -8 -37 -15z" />
                                </g>
                            </svg>
                        ) : (
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] text-[#0064e0] shrink-0" viewBox="0 0 33.000000 29.000000" preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,29.000000) scale(0.066667,-0.066667)" fill="currentColor" stroke="none">
                                    <path d="M212 301 c-135 -60 -147 -75 -74 -100 50 -16 62 -31 87 -101 22 -62 40 -46 99 88 91 203 91 203 -112 113z" />
                                </g>
                            </svg>
                        )}
                        <div className="text-xs font-semibold text-black truncate ">
                            {locationName}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteItem;

<style jsx>{`
    @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-100%); }
    }
    .marquee-text {
        animation: scroll 8s linear infinite;
    }
`}</style>