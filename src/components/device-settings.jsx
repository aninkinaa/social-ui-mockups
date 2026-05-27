import { Section, Slider, Toggle, Input } from "@/components/panel-ui";

export default function DeviceSettings({ statusBar }) {
    return (
        <Section title="Device Settings" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}>
            <div className="mb-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400">Time</label>
                    <Input value={statusBar.timeText} onChange={(e) => statusBar.setTimeText(e.target.value)} placeholder="09:41" />
                </div>
            </div>

            <Slider label="Battery (%)" min="0" max="100" value={statusBar.batteryLevel} onChange={(e) => statusBar.setBatteryLevel(parseInt(e.target.value))} />

            <Toggle label="Dynamic Island" subLabel="Show modern notch" checked={statusBar.showDynamicIsland} onChange={() => statusBar.setShowDynamicIsland(!statusBar.showDynamicIsland)} />

            {statusBar.showDynamicIsland && (
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex gap-4 mt-2">
                    
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[11px] text-neutral-400">Album Art</label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group w-fit">
                            <div className="w-12 h-12 rounded-lg border border-[#3f3f46] overflow-hidden bg-[#27272a] group-hover:bg-[#3f3f46] transition-colors relative shrink-0 flex items-center justify-center shadow-sm">
                                {statusBar.diPhoto?.image ? (
                                    <>
                                        <img src={statusBar.diPhoto.image} alt="Cover" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </div>
                                    </>
                                ) : (
                                    <svg className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                )}
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                    {statusBar.diPhoto?.image ? 'Change Art' : 'Upload Art'}
                                </span>
                            </div>
                            
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            if (statusBar.diPhoto?.handleUpload) {
                                                statusBar.diPhoto.handleUpload(reader.result);
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} 
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                        <label className="text-[11px] text-neutral-400">Wave Color</label>
                        {/* Dibuat presisi (h-12 w-12) agar rata secara vertikal dengan thumbnail album art */}
                        <div className="bg-[#18181b] border border-[#3f3f46] rounded-lg p-1 flex items-center justify-center h-12 w-12 shadow-sm">
                            <input type="color" value={statusBar.diWaveColor || "#E8D1C5"} onChange={(e) => statusBar.setDiWaveColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                        </div>
                    </div>

                </div>
            )}
        </Section>
    );
}