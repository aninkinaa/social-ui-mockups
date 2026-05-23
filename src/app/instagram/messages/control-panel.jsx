import { Section, Toggle, Input } from "@/components/panel-ui";
import DeviceSettings from "@/components/device-settings";
import PanelHeader from "@/components/panel-header";
import AvatarInput from "@/components/input-avatar";

const DEFAULT_AVATAR = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";


export default function MessagesControlPanel({ header, statusBar, notesLayer, msgsLayer, footer, exportData }) {
    return (
        <div className="w-full max-w-[420px] bg-[#18181b] xl:rounded-[24px] xl:border border-[#27272a] xl:shadow-2xl flex flex-col h-auto min-h-screen xl:min-h-0 xl:h-[852px] xl:overflow-hidden relative shrink-0">

            <PanelHeader
                title="DM Creator"
                description="Customize your perfect IG Messages."
            />

            {/* SCROLLABLE BODY */}
            <div className="flex-1 p-6 xl:overflow-y-auto custom-scrollbar flex flex-col gap-6 pb-32 relative z-10">

                {/* 1. Header Settings */}
                <Section title="Header Settings" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                    <div className="flex gap-4 items-center">
                        <AvatarInput
                            value={header.profileImage}
                            onChange={(base64) => header.setProfileImage(base64)}
                        />
                        <div className="flex-1 flex flex-col gap-2">
                            <Input value={header.username} onChange={(e) => header.setUsername(e.target.value)} placeholder="Your Username" />
                        </div>
                    </div>
                </Section>

                {/* 1.5 Device Settings */}
                <DeviceSettings
                    statusBar={statusBar}
                />

                {/* 2. IG Notes */}
                <Section title="IG Notes" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
                    <button onClick={notesLayer.addNote} className="bg-indigo-600 hover:bg-indigo-500 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm shadow-indigo-900/50 flex items-center justify-center gap-2 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Add New Note
                    </button>

                    <div className="flex flex-col gap-2">
                        {notesLayer.notes.map((note) => (
                            <div key={note.id} className={`bg-[#18181b] p-3 rounded-xl border transition-colors ${notesLayer.activeId === note.id ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'border-[#3f3f46]/50'}`}>

                                {/* Note Header */}
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => notesLayer.setActiveId(notesLayer.activeId === note.id ? null : note.id)}>
                                    <span className="text-sm font-medium text-white line-clamp-1">{note.username || "Unknown"}</span>
                                    <button onClick={(e) => { e.stopPropagation(); notesLayer.removeNote(note.id); }} className="text-neutral-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-md transition-colors shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                {/* Note Editor (Expanded) */}
                                {notesLayer.activeId === note.id && (
                                    <div className="mt-3 flex flex-col gap-3 pt-3 border-t border-[#3f3f46]/50">

                                        <div className="flex gap-3 items-start">
                                            <div className="flex gap-3 items-start">
                                                <AvatarInput
                                                    className="w-12 h-12 mt-1"
                                                    value={note.avatarUrl}
                                                    onChange={(base64) => notesLayer.updateNote(note.id, 'avatarUrl', base64)}
                                                />
                                            </div>


                                            {/* Username & Text */}
                                            <div className="flex-1 flex flex-col gap-2">
                                                <Input value={note.username} onChange={(e) => notesLayer.updateNote(note.id, 'username', e.target.value)} placeholder="Username" />
                                                <textarea value={note.text} onChange={(e) => notesLayer.updateNote(note.id, 'text', e.target.value)} placeholder="Note thoughts..." className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full min-h-[44px] max-h-[80px] resize-y custom-scrollbar" />
                                            </div>
                                        </div>

                                        {/* Music & Lyrics Control */}
                                        <Toggle label="Include Music" checked={!!note.music} onChange={() => {
                                            notesLayer.updateNote(note.id, 'music', note.music ? null : { title: 'Song', artist: 'Artist' });
                                            if (note.music) notesLayer.updateNote(note.id, 'lyric', null);
                                        }} />

                                        {note.music && (
                                            <div className="flex flex-col gap-3 p-3 bg-black/30 rounded-xl border border-white/5">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input value={note.music.title} onChange={(e) => notesLayer.updateNote(note.id, 'music', { ...note.music, title: e.target.value })} placeholder="Title" />
                                                    <Input value={note.music.artist} onChange={(e) => notesLayer.updateNote(note.id, 'music', { ...note.music, artist: e.target.value })} placeholder="Artist" />
                                                </div>

                                                <div className="h-px bg-[#3f3f46]/50 w-full"></div>

                                                <Toggle label="Include Lyrics" checked={!!note.lyric} onChange={() => notesLayer.updateNote(note.id, 'lyric', note.lyric ? null : { current: 'At the end of the day', next: "we're helpless" })} />
                                                {note.lyric && (
                                                    <div className="flex flex-col gap-2">
                                                        <Input value={note.lyric.current} onChange={(e) => notesLayer.updateNote(note.id, 'lyric', { ...note.lyric, current: e.target.value })} placeholder="Current Line" />
                                                        <Input value={note.lyric.next} onChange={(e) => notesLayer.updateNote(note.id, 'lyric', { ...note.lyric, next: e.target.value })} placeholder="Next Line" />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <Toggle label="Show Location" checked={note.showLocation} onChange={() => notesLayer.updateNote(note.id, 'showLocation', !note.showLocation)} />
                                        {note.showLocation && (
                                            <Input value={note.locationName} onChange={(e) => notesLayer.updateNote(note.id, 'locationName', e.target.value)} placeholder="Location Name" />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 3. Messages List */}
                <Section title="Direct Messages" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}>
                    <button onClick={msgsLayer.addMsg} className="bg-indigo-600 hover:bg-indigo-500 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm shadow-indigo-900/50 flex items-center justify-center gap-2 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Add Message
                    </button>

                    <div className="flex flex-col gap-2">
                        {msgsLayer.messages.map((msg) => (
                            <div key={msg.id} className={`bg-[#18181b] p-3 rounded-xl border transition-colors ${msgsLayer.activeId === msg.id ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'border-[#3f3f46]/50'}`}>

                                {/* Msg Header */}
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => msgsLayer.setActiveId(msgsLayer.activeId === msg.id ? null : msg.id)}>
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${!msg.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        <span className="text-sm font-medium text-white truncate">{msg.username}</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); msgsLayer.removeMsg(msg.id); }} className="text-neutral-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-md transition-colors shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                {/* Msg Editor */}
                                {msgsLayer.activeId === msg.id && (
                                    <div className="mt-3 flex flex-col gap-3 pt-3 border-t border-[#3f3f46]/50">

                                        <div className="flex gap-3 items-start">
                                            {/* Avatar Clickable */}
                                            <AvatarInput
                                                className="w-12 h-12 mt-1"
                                                value={msg.avatar}
                                                onChange={(base64) => msgsLayer.updateMsg(msg.id, 'avatar', base64)}
                                            />

                                            <div className="flex-1 grid grid-cols-[2fr_1fr] gap-2">
                                                <Input value={msg.username} onChange={(e) => msgsLayer.updateMsg(msg.id, 'username', e.target.value)} placeholder="Username" />
                                                <Input value={msg.time} onChange={(e) => msgsLayer.updateMsg(msg.id, 'time', e.target.value)} placeholder="Time" />
                                                <div className="col-span-2">
                                                    <Input value={msg.message} onChange={(e) => msgsLayer.updateMsg(msg.id, 'message', e.target.value)} placeholder="Message preview..." />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-[#3f3f46]/50 w-full my-1"></div>

                                        <Toggle
                                            label="Message is Read"
                                            checked={msg.isRead}
                                            onChange={() => msgsLayer.updateMsg(msg.id, 'isRead', !msg.isRead)}
                                        />

                                        <Toggle
                                            label="Story Already Seen"
                                            checked={msg.storySeen}
                                            onChange={() =>
                                                msgsLayer.updateMsg(msg.id, 'storySeen', !msg.storySeen)
                                            }
                                        />

                                        <div className="flex flex-col gap-1.5 mt-1">
                                            <label className="text-xs text-neutral-400">Ring Type</label>
                                            <div className="flex bg-[#18181b] p-1 rounded-lg border border-[#3f3f46]">
                                                {[{ v: 'none', l: 'None' }, { v: 'sg', l: 'Story' }, { v: 'cf', l: 'Close F.' }].map((type) => (
                                                    <button key={type.v} onClick={() => msgsLayer.updateMsg(msg.id, 'ringType', type.v)} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${msg.ringType === type.v ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
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
                    <Toggle label="Show Unread Badge" subLabel="Red dot on DM icon" checked={footer.showBadge} onChange={() => footer.setShowBadge(!footer.showBadge)} />
                </Section>

            </div>

            {/* Export Buttons */}
            <div className="hidden xl:flex absolute bottom-0 left-0 right-0 p-5 bg-[#18181b]/90 backdrop-blur-md border-t border-[#27272a] gap-3 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <button onClick={() => exportData.downloadImage(exportData.phoneFrameRef, "jpg", `dm-${header.username || "view"}`)} className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-3 rounded-xl text-sm font-bold transition-all border border-[#3f3f46]">Save JPG</button>
                <button onClick={() => exportData.downloadImage(exportData.phoneFrameRef, "png", `dm-${header.username || "view"}`)} className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-900/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Save High-Res
                </button>
            </div>
        </div>
    );
}