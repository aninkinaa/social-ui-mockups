export default function PanelHeader({ title, description }) {
    return (
        <div className="px-6 py-5 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl z-20 flex justify-between items-center relative shrink-0">
            <div>
                <h2 className="text-lg font-bold text-zinc-50 tracking-tight">{title}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-2 shadow-lg shadow-pink-500/10">
                <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
            </div>
        </div>
    );
}