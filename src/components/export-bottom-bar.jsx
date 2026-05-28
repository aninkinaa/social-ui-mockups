export default function ExportBottomBar({ phoneFrameRef, downloadImage, fileName }) {
    return (
        <div className="hidden xl:flex absolute bottom-0 left-0 right-0 p-5 bg-[#09090b]/80 backdrop-blur-xl border-t border-zinc-800/50 gap-3 z-30 shadow-[0_-20px_40px_rgba(0,0,0,0.6)]">
            <button 
                onClick={() => downloadImage(phoneFrameRef, "jpg", fileName)} 
                className="flex-1 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white py-3.5 rounded-xl text-sm font-bold transition-all border border-zinc-800/50"
            >
                Save JPG
            </button>
            <button 
                onClick={() => downloadImage(phoneFrameRef, "png", fileName)} 
                className="flex-[2] bg-brand hover:bg-brand-hover text-white py-3.5 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-pink-500/20"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg> 
                Save High-Res
            </button>
        </div>
    );
}