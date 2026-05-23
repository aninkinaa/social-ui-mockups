export default function PanelHeader({ title, description }) {
    return (
        <div className="px-6 py-5 border-b border-[#27272a] bg-[#18181b] z-20 flex justify-between items-center relative shrink-0">
            <div>
                <h2 className="text-[18px] font-bold text-white tracking-tight">{title}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">{description}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
        </div>
    );
}