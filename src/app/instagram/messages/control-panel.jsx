import { Section, Toggle, Input } from "@/components/panel-ui";
import DeviceSettings from "@/components/device-settings";
import PanelHeader from "@/components/panel-header";
import AvatarInput from "@/components/input-avatar";
import { useDragReorder } from "@/hooks/useDragReorder";
import ExportBottomBar from "@/components/export-bottom-bar";

export default function MessagesControlPanel({ 
    statusBar, 
    header, setHeader, 
    notesLayer, 
    msgsLayer, 
    footer, setFooter, 
    exportData 
}) {
    const handleAddNote = () => notesLayer.addItem({
        id: Date.now(), username: "New Note", text: "", music: null, lyric: null, avatarUrl: "", showLocation: false, locationName: ""
    });

    const handleAddMsg = () => msgsLayer.addItem({
        id: Date.now(), username: "New User", message: "Hello", time: "1m", isRead: true, ringType: "none", avatar: ""
    });

    const notesReorder = useDragReorder(notesLayer);
    const msgsReorder = useDragReorder(msgsLayer);

    return (
        <div className="w-full xl:w-[480px] bg-[#18181b] xl:border-l border-[#27272a] flex flex-col h-auto min-h-screen xl:h-screen relative shrink-0 z-20">

            <PanelHeader
                title="DM Creator"
                description="Customize your perfect IG Messages."
            />

            {/* SCROLLABLE BODY */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 pb-32 relative z-10">

                {/* 1. Header Settings */}
                <Section title="Header Settings" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                    <div className="flex gap-4 items-center">
                        <AvatarInput
                            value={header.profileImage}
                            onChange={(val) => setHeader({ ...header, profileImage: val })}
                        />
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-xs text-neutral-400">Username</label>
                            <Input value={header.username} onChange={(e) => setHeader({ ...header, username: e.target.value })} placeholder="Your Username" />
                        </div>
                    </div>
                </Section>

                {/* 2. IG Notes */}
                <Section title="IG Notes" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
                    <button onClick={handleAddNote} className="bg-brand hover:bg-brand-hover w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm shadow-brand/50 flex items-center justify-center gap-2 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Add New Note
                    </button>

                    <div className="flex flex-col gap-2">
                        {notesLayer.items.map((note, index) => (
                            <div 
                                key={note.id} 
                                {...notesReorder.dragProps(index)}
                                className={`bg-[#18181b] p-3 rounded-xl border transition-all ${notesLayer.activeId === note.id ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'border-[#3f3f46]/50'} ${notesReorder.dragIndex === index ? 'opacity-30 scale-95 border-dashed' : ''}`}
                            >

                                {/* Note Header with Reorder Controls */}
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => notesLayer.setActiveId(notesLayer.activeId === note.id ? null : note.id)}>
                                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                                        <div className="text-neutral-500 cursor-grab active:cursor-grabbing hover:text-white shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
                                        </div>
                                        <span className="text-sm font-medium text-white line-clamp-1">{note.username || "Unknown"}</span>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                        <button onClick={(e) => { e.stopPropagation(); notesReorder.moveItem(index, -1); }} disabled={index === 0} className="bg-[#27272a] text-neutral-400 hover:text-white p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); notesReorder.moveItem(index, 1); }} disabled={index === notesLayer.items.length - 1} className="bg-[#27272a] text-neutral-400 hover:text-white p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); notesLayer.removeItem(note.id); }} className="text-neutral-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-md transition-colors ml-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Note Editor (Expanded) */}
                                {notesLayer.activeId === note.id && (
                                    <div className="mt-3 flex flex-col gap-3 pt-3 border-t border-[#3f3f46]/50">

                                        <div className="flex gap-3 items-start">
                                            <div className="flex gap-3 items-start">
                                                <AvatarInput
                                                    className="w-12 h-12 mt-1"
                                                    value={note.avatarUrl}
                                                    onChange={(base64) => notesLayer.updateItem(note.id, 'avatarUrl', base64)}
                                                />
                                            </div>

                                            {/* Username & Text */}
                                            <div className="flex-1 flex flex-col gap-2">
                                                <Input value={note.username} onChange={(e) => notesLayer.updateItem(note.id, 'username', e.target.value)} placeholder="Username" />
                                                <textarea value={note.text} onChange={(e) => notesLayer.updateItem(note.id, 'text', e.target.value)} placeholder="Note thoughts..." className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full min-h-[44px] max-h-[80px] resize-y custom-scrollbar" />
                                            </div>
                                        </div>

                                        {/* Music & Lyrics Control */}
                                        <Toggle label="Include Music" checked={!!note.music} onChange={() => {
                                            notesLayer.updateItem(note.id, 'music', note.music ? null : { title: 'Song', artist: 'Artist' });
                                            if (note.music) notesLayer.updateItem(note.id, 'lyric', null);
                                        }} />

                                        {note.music && (
                                            <div className="flex flex-col gap-3 p-3 bg-black/30 rounded-xl border border-white/5">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input value={note.music.title} onChange={(e) => notesLayer.updateItem(note.id, 'music', { ...note.music, title: e.target.value })} placeholder="Title" />
                                                    <Input value={note.music.artist} onChange={(e) => notesLayer.updateItem(note.id, 'music', { ...note.music, artist: e.target.value })} placeholder="Artist" />
                                                </div>

                                                <div className="h-px bg-[#3f3f46]/50 w-full"></div>

                                                <Toggle label="Include Lyrics" checked={!!note.lyric} onChange={() => notesLayer.updateItem(note.id, 'lyric', note.lyric ? null : { current: 'At the end of the day', next: "we're helpless" })} />
                                                {note.lyric && (
                                                    <div className="flex flex-col gap-2">
                                                        <Input value={note.lyric.current} onChange={(e) => notesLayer.updateItem(note.id, 'lyric', { ...note.lyric, current: e.target.value })} placeholder="Current Line" />
                                                        <Input value={note.lyric.next} onChange={(e) => notesLayer.updateItem(note.id, 'lyric', { ...note.lyric, next: e.target.value })} placeholder="Next Line" />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <Toggle label="Show Location" checked={note.showLocation} onChange={() => notesLayer.updateItem(note.id, 'showLocation', !note.showLocation)} />
                                        {note.showLocation && (
                                            <Input value={note.locationName} onChange={(e) => notesLayer.updateItem(note.id, 'locationName', e.target.value)} placeholder="Location Name" />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 3. Messages List */}
                <Section title="Direct Messages" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>}>
                    <button onClick={handleAddMsg} className="bg-brand hover:bg-brand-hover w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm shadow-brand/50 flex items-center justify-center gap-2 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Add Message
                    </button>

                    <div className="flex flex-col gap-2">
                        {msgsLayer.items.map((msg, index) => (
                            <div 
                                key={msg.id} 
                                {...msgsReorder.dragProps(index)}
                                className={`bg-[#18181b] p-3 rounded-xl border transition-all ${msgsLayer.activeId === msg.id ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'border-[#3f3f46]/50'} ${msgsReorder.dragIndex === index ? 'opacity-30 scale-95 border-dashed' : ''}`}
                            >

                                {/* Msg Header with Reorder Controls */}
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => msgsLayer.setActiveId(msgsLayer.activeId === msg.id ? null : msg.id)}>
                                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                                        <div className="text-neutral-500 cursor-grab active:cursor-grabbing hover:text-white shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${!msg.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        <span className="text-sm font-medium text-white truncate">{msg.username}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                        {/* Pakai msgsReorder.moveItem buat Messages */}
                                        <button onClick={(e) => { e.stopPropagation(); msgsReorder.moveItem(index, -1); }} disabled={index === 0} className="bg-[#27272a] text-neutral-400 hover:text-white p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); msgsReorder.moveItem(index, 1); }} disabled={index === msgsLayer.items.length - 1} className="bg-[#27272a] text-neutral-400 hover:text-white p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); msgsLayer.removeItem(msg.id); }} className="text-neutral-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-md transition-colors ml-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Msg Editor */}
                                {msgsLayer.activeId === msg.id && (
                                    <div className="mt-3 flex flex-col gap-3 pt-3 border-t border-[#3f3f46]/50">

                                        <div className="flex gap-3 items-start">
                                            {/* Avatar Clickable */}
                                            <AvatarInput
                                                className="w-12 h-12 mt-1"
                                                value={msg.avatar}
                                                onChange={(base64) => msgsLayer.updateItem(msg.id, 'avatar', base64)}
                                            />

                                            <div className="flex-1 grid grid-cols-[2fr_1fr] gap-2">
                                                <Input value={msg.username} onChange={(e) => msgsLayer.updateItem(msg.id, 'username', e.target.value)} placeholder="Username" />
                                                <Input value={msg.time} onChange={(e) => msgsLayer.updateItem(msg.id, 'time', e.target.value)} placeholder="Time" />
                                                <div className="col-span-2">
                                                    <Input value={msg.message} onChange={(e) => msgsLayer.updateItem(msg.id, 'message', e.target.value)} placeholder="Message preview..." />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-[#3f3f46]/50 w-full my-1"></div>

                                        <Toggle
                                            label="Message is Read"
                                            checked={msg.isRead}
                                            onChange={() => msgsLayer.updateItem(msg.id, 'isRead', !msg.isRead)}
                                        />

                                        <Toggle
                                            label="Story Already Seen"
                                            checked={msg.storySeen}
                                            onChange={() => msgsLayer.updateItem(msg.id, 'storySeen', !msg.storySeen)}
                                        />

                                        <div className="flex flex-col gap-1.5 mt-1">
                                            <label className="text-xs text-neutral-400">Ring Type</label>
                                            <div className="flex bg-[#18181b] p-1 rounded-lg border border-[#3f3f46]">
                                                {[{ v: 'none', l: 'None' }, { v: 'sg', l: 'Story' }, { v: 'cf', l: 'Close F.' }].map((type) => (
                                                    <button key={type.v} onClick={() => msgsLayer.updateItem(msg.id, 'ringType', type.v)} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${msg.ringType === type.v ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
                                                        {type.l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 4. Footer Settings */}
                <Section title="Footer Settings" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>}>
                    <Toggle label="Show Unread Badge" subLabel="Red dot on DM icon" checked={footer.showBadge} onChange={() => setFooter({ ...footer, showBadge: !footer.showBadge })} />
                </Section>

                {/* 5. Device Settings */}
                <DeviceSettings statusBar={statusBar} />

            </div>

            {/* Export Buttons */}
            <ExportBottomBar
            phoneFrameRef={exportData.phoneFrameRef} 
                downloadImage={exportData.downloadImage} 
                fileName={`dm-${header.username || "export"}`}
            />
        </div>
    );
}