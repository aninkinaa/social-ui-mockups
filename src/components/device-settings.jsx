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
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex gap-3 items-end mt-2">
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label className="text-[11px] text-neutral-400">Album Art</label>
                        <label className="bg-[#3f3f46] hover:bg-[#52525b] px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all w-full text-center cursor-pointer block">
                            Upload Photo
                            <input type="file" accept="image/*" className="hidden" onChange={statusBar.diPhoto.handleUpload} />
                        </label>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-neutral-400">Wave Color</label>
                        <div className="bg-[#18181b] border border-[#3f3f46] rounded-lg p-1 flex items-center justify-center">
                            <input type="color" value={statusBar.diWaveColor || "#E8D1C5"} onChange={(e) => statusBar.setDiWaveColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0" />
                        </div>
                    </div>
                </div>
            )}
        </Section>
    );
}