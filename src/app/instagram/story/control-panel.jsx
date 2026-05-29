import { useState } from "react";
import { Section, Toggle, Input, Slider } from "@/components/panel-ui";
import PanelHeader from "@/components/panel-header";
import AvatarInput from "@/components/input-avatar";
import DeviceSettings from "@/components/device-settings";
import ExportBottomBar from "@/components/export-bottom-bar";

export default function ControlPanel({ 
    media, 
    headerData, setHeaderData, profilePhoto, profileEditor,
    addonData, setAddonData, repostPhoto,
    statusBar, 
    commentData, setCommentData, user1Photo, user2Photo, viewerPhoto,
    textLayer, 
    exportData 
}) {

    return (
        <div className="w-full xl:w-[480px] bg-[#121212] xl:border-l border-[#27272a] flex flex-col h-auto min-h-screen xl:h-screen relative shrink-0 z-20">

            <PanelHeader title="Story Creator" description="Customize your perfect IG Story." />

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8 pb-32 relative z-10">

                {/* 1. Background Media */}
                <Section title="Story Image" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                    <div className="flex flex-col gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                        <div className="flex gap-2">
                            <label className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white text-[13px] font-bold py-2.5 rounded-xl text-center cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Upload Image
                                <input type="file" accept="image/*" className="hidden" ref={media.fileInputRef} onChange={media.handleBgUpload} />
                            </label>
                            {media.bgImage && (
                                <button onClick={media.handleBgClear} className="px-4 bg-[#18181b] hover:bg-red-500/10 text-neutral-400 hover:text-red-400 rounded-xl transition-colors border border-[#3f3f46] hover:border-red-500/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                        </div>
                        {media.bgImage && (
                            <Toggle 
                                label="Edit Position & Zoom" 
                                subLabel="Drag the image on the preview screen" 
                                checked={media.isEditingBg} 
                                onChange={() => media.setIsEditingBg(!media.isEditingBg)} 
                            />
                        )}
                    </div>
                </Section>

                <div className="h-px w-full bg-[#27272a]"></div>

                {/* 2. Header Settings */}
                <Section title="Header Settings" icon={<svg className="w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                    <div className="flex gap-4 items-start bg-black/20 p-3 rounded-xl border border-white/5 mb-4">
                        <AvatarInput className="w-12 h-12 shadow-md shrink-0" value={profilePhoto.image} onChange={(base64) => { profilePhoto.setImage(base64); profileEditor.resetTransform(); }} />
                        <div className="flex-1 grid grid-cols-2 gap-2 min-w-0">
                            <div className="flex flex-col gap-1.5 col-span-2">
                                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Username</label>
                                <Input value={headerData.username} onChange={(e) => setHeaderData({...headerData, username: e.target.value})} placeholder="Username" className="h-8 text-[12px]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Time</label>
                                <Input value={headerData.postedTime} onChange={(e) => setHeaderData({...headerData, postedTime: e.target.value})} placeholder="e.g. 10h" className="h-8 text-[12px]" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <Toggle label="Close Friends Mode" subLabel="Turns the story ring green" checked={headerData.isCF} onChange={() => setHeaderData({...headerData, isCF: !headerData.isCF})} />

                        <div className="flex flex-col gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                            <Slider label={`Total Stories Segment (${headerData.storyCount})`} min="1" max="10" value={headerData.storyCount} onChange={(e) => setHeaderData({...headerData, storyCount: parseInt(e.target.value)})} />
                            <Slider label={`Current Active Story (${headerData.currentStory})`} min="1" max={headerData.storyCount} value={headerData.currentStory} onChange={(e) => setHeaderData({...headerData, currentStory: parseInt(e.target.value)})} />
                        </div>
                    </div>
                </Section>

                <div className="h-px w-full bg-[#27272a]"></div>

                {/* 3. Story Add-ons */}
                <Section title="Story Add-ons" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>}>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Add-on Mode</label>
                            <div className="flex bg-[#18181b] p-1 rounded-lg border border-[#3f3f46]">
                                {[{ v: 'none', l: 'None' }, { v: 'music', l: 'Music' }, { v: 'repost', l: 'Repost' }].map((mode) => (
                                    <button key={mode.v} onClick={() => setAddonData({...addonData, mode: mode.v})} className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-colors ${addonData.mode === mode.v ? 'bg-brand text-white' : 'text-neutral-400 hover:text-white'}`}>
                                        {mode.l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {addonData.mode === 'music' && (
                            <div className="grid grid-cols-2 gap-3 p-3 bg-black/20 rounded-xl border border-white/5 mt-1">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Song Title</label>
                                    <Input value={addonData.musicTitle} onChange={(e) => setAddonData({...addonData, musicTitle: e.target.value})} placeholder="Title" className="h-8 text-[12px]" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Artist Name</label>
                                    <Input value={addonData.musicArtist} onChange={(e) => setAddonData({...addonData, musicArtist: e.target.value})} placeholder="Artist" className="h-8 text-[12px]" />
                                </div>
                            </div>
                        )}

                        {addonData.mode === 'repost' && (
                            <div className="flex gap-3 items-center p-3 bg-black/20 rounded-xl border border-white/5 mt-1">
                                <AvatarInput className="w-10 h-10 shadow-sm shrink-0" value={repostPhoto.image} onChange={(base64) => repostPhoto.setImage(base64)} />
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Repost Username</label>
                                    <Input value={addonData.repostUsername} onChange={(e) => setAddonData({...addonData, repostUsername: e.target.value})} placeholder="Username" className="h-8 text-[12px]" />
                                </div>
                            </div>
                        )}
                    </div>
                </Section>

                <div className="h-px w-full bg-[#27272a]"></div>

                {/* 4. Text Layers */}
                <Section title="Text Layers" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
                    <button type="button" onClick={() => textLayer.addText()} className="bg-brand hover:bg-brand-hover w-full py-2.5 rounded-xl text-[13px] font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> 
                        Add Text Layer
                    </button>

                    <div className="flex flex-col gap-3">
                        {textLayer.texts.map((txt) => (
                            <div key={txt.id} className={`bg-[#18181b] p-3 rounded-xl border transition-colors ${textLayer.activeTextId === txt.id ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'border-[#3f3f46]/50'}`}>
                                
                                {/* HEADER DRAG & DRP */}
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => textLayer.setActiveTextId(textLayer.activeTextId === txt.id ? null : txt.id)}>
                                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                                        <div className="text-neutral-500 cursor-grab active:cursor-grabbing hover:text-white shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
                                        </div>
                                        <span className="text-sm font-medium text-white line-clamp-1">{txt.text || "Empty Text"}</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); textLayer.removeText(txt.id); }} className="text-neutral-500 hover:text-red-400 p-1.5 hover:bg-[#18181b] rounded-md transition-colors ml-2 bg-[#27272a]">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                {/* EDIT AREA */}
                                {textLayer.activeTextId === txt.id && (
                                    <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-[#3f3f46]/50">
                                        <textarea value={txt.text} onChange={(e) => textLayer.updateTextProps(txt.id, 'text', e.target.value)} placeholder="Type here..." className="bg-black/20 border border-[#3f3f46] text-white text-[12px] rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full min-h-[60px] resize-y custom-scrollbar" />
                                        
                                        <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-lg border border-[#3f3f46]">
                                            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Text Color</label>
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#3f3f46]">
                                                <input type="color" value={txt.color} onChange={(e) => textLayer.updateTextProps(txt.id, 'color', e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer bg-transparent border-0 p-0" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

                <div className="h-px w-full bg-[#27272a]"></div>

                {/* 5. Comments Settings */}
                <Section title="COMMENTS SETTINGS" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}>
                    
                    <div className="flex flex-col gap-4">
                        <Toggle label="Show Floating Comment" subLabel="A small comment overlay on the story" checked={commentData.show} onChange={() => setCommentData({...commentData, show: !commentData.show})} />

                        {commentData.show && (
                            <div className="p-3 bg-black/20 rounded-xl border border-white/5 flex flex-col gap-3 mt-1">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5 items-center">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase">User 1</label>
                                        <AvatarInput className="w-10 h-10 shadow-sm" value={user1Photo.image} onChange={(base64) => user1Photo.setImage(base64)} />
                                    </div>
                                    <div className="flex flex-col gap-1.5 items-center">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase">User 2</label>
                                        <AvatarInput className="w-10 h-10 shadow-sm" value={user2Photo.image || viewerPhoto.image} onChange={(base64) => user2Photo.setImage(base64)} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Message Text</label>
                                    <textarea value={commentData.text} onChange={(e) => setCommentData({...commentData, text: e.target.value})} className="bg-[#18181b] border border-[#3f3f46] text-white text-[12px] rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full min-h-[50px] resize-y custom-scrollbar" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-[#3f3f46]/50 pt-5 mt-2 flex flex-col gap-3">
                        <Toggle 
                            label="Show Comments List" 
                            subLabel="Can also be opened via preview screen" 
                            checked={commentSheet.isOpen} 
                            onChange={() => commentSheet.setIsOpen(!commentSheet.isOpen)} 
                        />
                        
                        {commentSheet.isOpen && (
                            <div className="flex gap-3 p-3 bg-black/30 rounded-xl border border-white/5">
                                <div className="flex flex-col gap-1.5 items-center shrink-0">
                                    <label className="text-[10px] text-neutral-400">Viewer (You)</label>
                                    <AvatarInput className="w-10 h-10" value={viewerPhoto.image} onChange={(base64) => viewerPhoto.setImage(base64)} />
                                </div>
                                <div className="flex-1 text-[11px] text-neutral-400 flex items-center leading-relaxed">
                                    This avatar will be used in the comment input field at the bottom of the sheet.
                                </div>
                            </div>
                        )}

                        <button type="button" onClick={commentSheet.addComment} className="bg-indigo-600 hover:bg-indigo-500 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm flex items-center justify-center gap-2 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Add Comment
                        </button>

                        <div className="flex flex-col gap-2">
                            {commentSheet.comments.map((c, index) => (
                                <div 
                                    key={c.id} 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={() => handleDragEnter(index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                    className={`bg-[#18181b] p-3 rounded-xl border transition-colors ${commentSheet.activeId === c.id ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'border-[#3f3f46]/50'} ${dragIndex === index ? 'opacity-50' : ''}`}
                                >
                                    <div className="flex justify-between items-center cursor-pointer" onClick={() => commentSheet.setActiveId(commentSheet.activeId === c.id ? null : c.id)}>
                                        <div className="flex items-center gap-2 overflow-hidden flex-1 pr-2">
                                            <div className="text-neutral-500 cursor-grab active:cursor-grabbing hover:text-white px-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-white truncate">{c.username || 'Username'} - {c.text}</span>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <button onClick={(e) => { e.stopPropagation(); commentSheet.removeComment(c.id); }} className="text-neutral-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-md transition-colors ml-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {commentSheet.activeId === c.id && (
                                        <div className="mt-3 flex flex-col gap-3 pt-3 border-t border-[#3f3f46]/50">
                                            <div className="flex gap-3 items-start">
                                                <AvatarInput className="w-12 h-12 mt-1" value={c.avatar} onChange={(base64) => commentSheet.updateComment(c.id, 'avatar', base64)} />
                                                <div className="flex-1 flex flex-col gap-2">
                                                    <Input value={c.username} onChange={(e) => commentSheet.updateComment(c.id, 'username', e.target.value)} placeholder="Username" />
                                                    <textarea value={c.text} onChange={(e) => commentSheet.updateComment(c.id, 'text', e.target.value)} placeholder="Comment Text..." className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full min-h-[44px] resize-y" />
                                                </div>
                                            </div>
                                            <Toggle label="Show 'Author' Badge" checked={c.isAuthor} onChange={() => commentSheet.updateComment(c.id, 'isAuthor', !c.isAuthor)} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                <div className="h-px w-full bg-[#27272a]"></div>

                {/* 6. Device Settings */}
                <DeviceSettings statusBar={statusBar} />

            </div>

            {/* Export Bottom */}
            <ExportBottomBar 
                phoneFrameRef={exportData.phoneFrameRef} 
                downloadImage={exportData.downloadImage} 
                fileName={`story-${headerData.username || "export"}`} 
                isExporting={exportData.isExporting}
            />
            
        </div>
    );
}