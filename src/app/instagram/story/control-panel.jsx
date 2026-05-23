import { Section, Toggle, Input, Slider } from "@/components/panel-ui";
import PanelHeader from "@/components/panel-header";
import AvatarInput from "@/components/input-avatar";
import DeviceSettings from "@/components/device-settings";

export default function ControlPanel({ media, header, addon, statusBar, comment, textLayer, exportData }) {
    return (
        <div className="w-full max-w-[420px] bg-[#18181b] xl:rounded-[24px] xl:border border-[#27272a] xl:shadow-2xl flex flex-col h-auto min-h-screen xl:min-h-0 xl:h-[852px] xl:overflow-hidden relative shrink-0">

            <PanelHeader title="Story Creator" description="Customize your perfect IG Story." />

            <div className="flex-1 p-6 xl:overflow-y-auto custom-scrollbar flex flex-col gap-6 pb-32 relative z-10">

                {/* 1. Background Media */}
                <Section title="Background Media" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <label className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white text-sm font-semibold py-2.5 rounded-xl text-center cursor-pointer transition-colors border border-[#3f3f46]">
                                Upload Image
                                <input type="file" accept="image/*" className="hidden" ref={media.fileInputRef} onChange={media.handleBgUpload} />
                            </label>
                            {media.bgImage && (
                                <button onClick={media.handleBgClear} className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                        </div>
                        {media.bgImage && (
                            <Toggle label="Edit Position & Zoom" subLabel="Geser gambar di layar preview" checked={media.isEditingBg} onChange={() => media.setIsEditingBg(!media.isEditingBg)} />
                        )}
                    </div>
                </Section>

                {/* 2. Header Settings */}
                <Section title="Header Settings" icon={<svg className="w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                    <div className="flex gap-4 items-center mb-3">
                        <AvatarInput className="h-[100px]" value={header.profileImage} onChange={(base64) => header.setProfileImage(base64)} />
                        <div className="gap-3 flex flex-col">
                            <div className="flex-1 flex flex-col gap-2">
                                <label className="text-xs text-neutral-400">Username</label>

                                <Input value={header.username} onChange={(e) => header.setUsername(e.target.value)} placeholder="Username" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-neutral-400">Time Posted</label>
                                <Input value={header.postedTime} onChange={(e) => header.setPostedTime(e.target.value)} placeholder="10h" />
                            </div>
                        </div>
                    </div>
                    <Slider label={`Total Stories (${header.storyCount})`} min="1" max="10" value={header.storyCount} onChange={(e) => header.setStoryCount(parseInt(e.target.value))} />
                    <Slider label={`Current Story (${header.currentStory})`} min="1" max={header.storyCount} value={header.currentStory} onChange={(e) => header.setCurrentStory(parseInt(e.target.value))} />
                </Section>

                {/* 3. Add-ons (Music / Repost) */}
                <Section title="Story Add-ons" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>}>
                    <div className="flex bg-[#18181b] p-1 rounded-lg border border-[#3f3f46] mb-3">
                        {[{ v: 'none', l: 'None' }, { v: 'music', l: 'Music' }, { v: 'repost', l: 'Repost' }].map((mode) => (
                            <button key={mode.v} onClick={() => addon.setHeaderMode(mode.v)} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${addon.headerMode === mode.v ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
                                {mode.l}
                            </button>
                        ))}
                    </div>

                    {addon.headerMode === 'music' && (
                        <div className="grid grid-cols-2 gap-2 p-3 bg-black/30 rounded-xl border border-white/5">
                            <Input value={addon.musicTitle} onChange={(e) => addon.setMusicTitle(e.target.value)} placeholder="Song Title" />
                            <Input value={addon.musicArtist} onChange={(e) => addon.setMusicArtist(e.target.value)} placeholder="Artist" />
                        </div>
                    )}

                    {addon.headerMode === 'repost' && (
                        <div className="flex gap-3 items-center p-3 bg-black/30 rounded-xl border border-white/5">
                            <AvatarInput className="w-10 h-10" value={addon.repostImage} onChange={(base64) => addon.setRepostImage(base64)} />
                            <Input value={addon.repostUsername} onChange={(e) => addon.setRepostUsername(e.target.value)} placeholder="Repost Username" />
                        </div>
                    )}
                </Section>

                {/* 4. Text Layers */}
                <Section title="Text Layers" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
                    <button onClick={() => textLayer.addText()} className="bg-indigo-600 hover:bg-indigo-500 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm shadow-indigo-900/50 flex items-center justify-center gap-2 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Add Text
                    </button>

                    <div className="flex flex-col gap-2">
                        {textLayer.texts.map((txt) => (
                            <div key={txt.id} className={`bg-[#18181b] p-3 rounded-xl border transition-colors ${textLayer.activeTextId === txt.id ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'border-[#3f3f46]/50'}`}>
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => textLayer.setActiveTextId(textLayer.activeTextId === txt.id ? null : txt.id)}>
                                    <span className="text-sm font-medium text-white line-clamp-1">{txt.text || "Empty Text"}</span>
                                    <div className="flex gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); textLayer.removeText(txt.id); }} className="text-neutral-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-md transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {textLayer.activeTextId === txt.id && (
                                    <div className="mt-3 flex flex-col gap-3 pt-3 border-t border-[#3f3f46]/50">
                                        <textarea value={txt.text} onChange={(e) => textLayer.updateTextProps(txt.id, 'text', e.target.value)} placeholder="Type here..." className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full min-h-[60px] resize-y custom-scrollbar" />
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-neutral-400">Color:</label>
                                            <input type="color" value={txt.color} onChange={(e) => textLayer.updateTextProps(txt.id, 'color', e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 5. Comment Overlay */}
                <Section title="Comment Overlay" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}>
                    <Toggle label="Show Comment" checked={comment.showComment} onChange={() => comment.setShowComment(!comment.showComment)} />

                    {comment.showComment && (
                        <div className="mt-3 flex flex-col gap-3 p-3 bg-black/30 rounded-xl border border-white/5">
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1.5 items-center">
                                    <label className="text-[10px] text-neutral-400">User 1</label>
                                    <AvatarInput className="w-10 h-10" value={comment.user1Image} onChange={(base64) => comment.setUser1Image(base64)} />
                                </div>
                                <div className="flex flex-col gap-1.5 items-center">
                                    <label className="text-[10px] text-neutral-400">User 2</label>
                                    <AvatarInput className="w-10 h-10" value={comment.user2Image || header.profileImage} onChange={(base64) => comment.setUser2Image(base64)} />
                                </div>
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <label className="text-[10px] text-neutral-400">Message</label>
                                    <textarea value={comment.commentText} onChange={(e) => comment.setCommentText(e.target.value)} className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500 w-full min-h-[44px] resize-y" />
                                </div>
                            </div>
                        </div>
                    )}
                </Section>

                {/* 6. Device Settings */}
                <DeviceSettings statusBar={statusBar} />

            </div>

            {/* Export Buttons */}
            <div className="hidden xl:flex absolute bottom-0 left-0 right-0 p-5 bg-[#18181b]/90 backdrop-blur-md border-t border-[#27272a] gap-3 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <button onClick={() => exportData.downloadImage(exportData.phoneFrameRef, "jpg", `igs-${header.username || "story"}`)} className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-3 rounded-xl text-sm font-bold transition-all border border-[#3f3f46]">Save JPG</button>
                <button onClick={() => exportData.downloadImage(exportData.phoneFrameRef, "png", `igs-${header.username || "story"}`)} className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-900/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Save High-Res
                </button>
            </div>
        </div>
    );
}