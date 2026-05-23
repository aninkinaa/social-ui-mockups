import React from "react";

export default function NoteDetailItem({ note, time = "17h" }) {
    const avatarImage = note?.avatarUrl || "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

    return (
        <div className="w-full flex flex-col items-center">

            <div className="text-[14px] font-semibold text-black mb-5 flex items-center gap-1 z-30">
                {note.username} <span className="text-gray-500 font-normal">· {time}</span>
            </div>

            <div className="flex items-center justify-center w-full px-6 mb-4 relative gap-0">

                <div className="relative shrink-0 z-10 w-[62px] h-[62px]">

                    <img
                        src={avatarImage}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full border border-gray-100 shadow-sm relative z-20"
                    />


                </div>

                <div className="relative bg-white border border-gray-50 rounded-[30px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] py-3 px-3 z-10 flex flex-col justify-center min-h-[44px] max-w-[320px]">

                    {/* <div 
                        className="absolute w-[8.5px] h-[8.5px] bg-white rounded-full z-30 transform-gpu shrink-0"
                        style={{ 
                            left: "-18px", 
                            top: "30px",
                            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.15))"
                        }}
                    />
                    
                    <svg
                        className="absolute w-[12.5px] h-[22px] text-white -translate-y-1/2 -left-2.5 z-10 shrink-0"
                        style={{
                            top: "50%",
                            filter: "drop-shadow(-2px 0px 2px rgba(0,0,0,0.05))"
                        }}
                        viewBox="0 0 10 20"
                        fill="currentColor"
                        preserveAspectRatio="none"
                    >
                        <path d="M10 0 C 0 5, 0 15, 10 20 Z" />
                    </svg> */}

                    <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 shrink-0">

                        <svg
                            className="w-[12.5px] h-[22px] text-white shrink-0"
                            viewBox="0 0 10 20"
                            fill="currentColor"
                            preserveAspectRatio="none"
                        >
                            <path d="M10 0 C 0 5, 0 15, 10 20 Z" />
                        </svg>

                        <div
                            className="absolute w-[8.5px] h-[8.5px] bg-white rounded-full -translate-x-2 top-0"
                        />
                    </div>

                    <div className="relative z-30">
                        {note.music ? (
                            <div>
                                <div className="flex items-center truncate text-[13px]">
                                    <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 border border-gray-200 mr-1 relative">

                                        <div className="relative w-[18px] h-[18px] shrink-0">

                                            <div className="absolute inset-0 rounded-full border-[2px] border-gray-200"></div>

                                            <div
                                                className="absolute inset-0 rounded-full"
                                                style={{
                                                    background:
                                                        "conic-gradient(from 40deg, #ff5f2e 0deg, #ff00b8 90deg, transparent 90deg)",
                                                    WebkitMask:
                                                        "radial-gradient(farthest-side, transparent calc(100% - 2px), black 0)",
                                                    mask:
                                                        "radial-gradient(farthest-side, transparent calc(100% - 2px), black 0)",
                                                }}
                                            />

                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-[5px] h-[5px] bg-black rounded-[1px]" />
                                            </div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-black mr-1">
                                        {note.music.title}
                                    </span>
                                    <span className="text-gray-500 truncate">
                                        · {note.music.artist}
                                    </span>


                                </div>

                                {note.text && (
                                    <div className="mt-1">
                                        <div className="text-[15px] text-black leading-snug">{note.text}</div>
                                        <div className="font-semibold text-[13px] text-black mt-0.5">See translation</div>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div>
                                <div className="text-[15px] text-black leading-snug">
                                    {note.text || "..."}
                                </div>
                                <div className="font-semibold text-[13px] text-black">See translation</div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {note.music && note.lyric && (
                <div className="px-6 text-center text-[17px] max-w-[85%] leading-snug z-30 relative">
                    <span className="font-bold text-black">
                        {note.lyric.current}{" "}
                    </span>
                    <span className="text-[#a0a0a0] font-semibold">
                        {note.lyric.next}
                    </span>
                </div>
            )}

        </div>
    );
}