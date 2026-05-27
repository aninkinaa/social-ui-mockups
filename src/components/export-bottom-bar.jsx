export default function ExportBottomBar({ phoneFrameRef, downloadImage, fileName }) {
    return (
        <div className="hidden xl:flex absolute bottom-0 left-0 right-0 p-5 bg-[#18181b]/90 backdrop-blur-md border-t border-[#27272a] gap-3 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <button onClick={() => downloadImage(phoneFrameRef, "jpg", fileName)} className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-3 rounded-xl text-sm font-bold transition-all border border-[#3f3f46]">
                Save JPG
            </button>
            <button onClick={() => downloadImage(phoneFrameRef, "png", fileName)} className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-900/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> 
                Save High-Res
            </button>
        </div>
    );
}