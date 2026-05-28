"use client"
import { Section, Toggle, Input, Slider } from "@/components/panel-ui";
import DeviceSettings from "@/components/device-settings";
import PanelHeader from "@/components/panel-header";
import AvatarInput from "@/components/input-avatar";
import InputPost from "@/components/input-post";
import ExportBottomBar from "@/components/export-bottom-bar";
import { useDragReorder } from "@/hooks/useDragReorder";

const DEFAULT_AVATAR = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

export default function FeedsControlPanel({ 
    statusBar, 
    profile, setProfile, 
    bioProps, setBioProps, 
    action, setAction, 
    followedBy, setFollowedBy, 
    highlightsLayer,
    postsLayer, 
    tabs, setTabs,
    exportData 
}) {

    const addLink = () => setBioProps({ ...bioProps, links: [...bioProps.links, ""] });
    const updateLink = (index, val) => {
        const newLinks = [...bioProps.links];
        newLinks[index] = val;
        setBioProps({ ...bioProps, links: newLinks });
    };
    const removeLink = (index) => {
        const newLinks = bioProps.links.filter((_, i) => i !== index);
        setBioProps({ ...bioProps, links: newLinks });
    };

    const postsReorder = useDragReorder(postsLayer);

    return (
        <div className="w-full xl:w-[480px] bg-[#09090b] xl:border-l border-zinc-800/50 flex flex-col h-auto min-h-screen xl:h-screen relative shrink-0 z-20">
            <PanelHeader title="Feeds Creator" description="Customize your perfect IG Profile." />

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8 pb-32 relative z-10">
                
                {/* 1. Profile Settings */}
                <Section title="Profile Settings" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                    
                    <div className="flex gap-5 items-center mb-2">
                        <AvatarInput className="h-[90px] w-[90px] shadow-xl" value={profile.avatar} onChange={(val) => setProfile({ ...profile, avatar: val })} />
                        <div className="gap-3 w-full flex flex-col">
                            <div className="flex-1 flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Username</label>
                                <Input value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} placeholder="Username" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Name / Nickname</label>
                                <Input value={profile.nickname} onChange={(e) => setProfile({ ...profile, nickname: e.target.value })} placeholder="Name / Nickname" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-zinc-800/50 pt-5 mt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Pronouns</label>
                                <Input value={profile.pronouns} onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })} placeholder="e.g. she/her" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">IG Notes</label>
                                <Input value={profile.note} onChange={(e) => setProfile({ ...profile, note: e.target.value })} placeholder="Empty to hide" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Posts</label>
                                <Input value={profile.posts} onChange={(e) => setProfile({ ...profile, posts: e.target.value })} placeholder="0" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Followers</label>
                                <Input value={profile.followers} onChange={(e) => setProfile({ ...profile, followers: e.target.value })} placeholder="0" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Following</label>
                                <Input value={profile.following} onChange={(e) => setProfile({ ...profile, following: e.target.value })} placeholder="0" />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* 2. Bio & Details */}
                <Section title="Bio & Details" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Bio Text</label>
                        <textarea value={bioProps.text} onChange={(e) => setBioProps({ ...bioProps, text: e.target.value })} placeholder="Tell your story..." className="bg-zinc-900/40 border border-zinc-800 text-zinc-200 text-sm rounded-xl px-4 py-3 outline-none focus:border-brand-hover hover:border-zinc-700 w-full min-h-[80px] resize-y custom-scrollbar shadow-inner transition-all" />
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Bio Links</label>
                            <button onClick={addLink} className="text-xs font-semibold text-brand-hover hover:text-brand transition-colors">+ Add Link</button>
                        </div>
                        {bioProps.links.map((link, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <Input value={link} onChange={(e) => updateLink(i, e.target.value)} placeholder={`Link ${i + 1}`} />
                                <button onClick={() => removeLink(i)} className="text-zinc-600 px-2 transition-colors hover:text-red-400">✕</button>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 mt-3 pt-5 border-t border-zinc-800/50">
                        <Toggle label="Include Profile Music" checked={!!bioProps.music} onChange={() => setBioProps({ ...bioProps, music: bioProps.music ? null : { title: "Title", artist: "Artist" } })} />
                        {bioProps.music && (
                            <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                                <Input value={bioProps.music.title} onChange={(e) => setBioProps({ ...bioProps, music: { ...bioProps.music, title: e.target.value } })} placeholder="Song Title" />
                                <Input value={bioProps.music.artist} onChange={(e) => setBioProps({ ...bioProps, music: { ...bioProps.music, artist: e.target.value } })} placeholder="Artist" />
                            </div>
                        )}
                    </div>
                </Section>

                {/* 3. Action Buttons */}
                <Section title="Action Buttons" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>}>
                    <Toggle label="Is Following User" subLabel="Toggles Follow/Following button & Bell Icon" checked={action.isFollowing} onChange={() => setAction({ ...action, isFollowing: !action.isFollowing })} />
                </Section>

                {/* 4. Followed By Settings */}
                <Section title="Followed By Indicator" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}>
                    <Toggle label="Show Mutual Followers" checked={followedBy.show} onChange={() => setFollowedBy({...followedBy, show: !followedBy.show})} />
                    
                    {followedBy.show && (
                        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-zinc-800/50">
                            {followedBy.users.map((u, i) => (
                                <div key={u.id} className="flex gap-3 items-center p-3 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                                    <AvatarInput className="w-10 h-10 shrink-0" value={u.avatar} onChange={(val) => {
                                        const newU = [...followedBy.users];
                                        newU[i].avatar = val;
                                        setFollowedBy({...followedBy, users: newU});
                                    }} />
                                    <Input value={u.username} onChange={(e) => {
                                        const newU = [...followedBy.users];
                                        newU[i].username = e.target.value;
                                        setFollowedBy({...followedBy, users: newU});
                                    }} placeholder={`Mutual ${i+1}`} />
                                </div>
                            ))}
                            <div className="flex flex-col gap-1.5 mt-2">
                                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">And [X] Others (Optional)</label>
                                <Input 
                                    value={followedBy.othersCount} 
                                    onChange={(e) => setFollowedBy({...followedBy, othersCount: e.target.value})} 
                                    placeholder="e.g. 24 (Empty to hide)" 
                                />
                            </div>
                        </div>
                    )}
                </Section>

                {/* 5. Highlights */}
                <Section title="Story Highlights" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                    <button onClick={() => highlightsLayer.addItem({ id: Date.now(), title: "New", image: DEFAULT_AVATAR })} className="w-full py-3 rounded-xl text-sm font-semibold text-zinc-300 bg-zinc-900/40 border border-zinc-800 border-dashed hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center gap-2 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Highlight
                    </button>
                    <div className="flex flex-col gap-3">
                        {highlightsLayer.items.map((h) => (
                            <div key={h.id} className="flex items-center gap-3 bg-zinc-900/30 p-3 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                <AvatarInput className="w-12 h-12 shrink-0" value={h.image} onChange={(val) => highlightsLayer.updateItem(h.id, 'image', val)} />
                                <div className="flex-1">
                                    <Input value={h.title} onChange={(e) => highlightsLayer.updateItem(h.id, 'title', e.target.value)} placeholder="Highlight Name" />
                                </div>
                                <button onClick={() => highlightsLayer.removeItem(h.id)} className="text-zinc-600 hover:text-red-400 p-2 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 6. Grid Posts */}
                <Section title="Grid Posts" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 9h18" strokeWidth="2"/><path d="M9 21V9" strokeWidth="2"/></svg>}>
                    <button onClick={() => postsLayer.addItem({ id: Date.now(), image: "", isCarousel: false })} className="w-full py-3 rounded-xl text-sm font-semibold text-zinc-300 bg-zinc-900/40 border border-zinc-800 border-dashed hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center gap-2 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Grid Photo
                    </button>
                    
                    <div className="grid grid-cols-3 gap-3">
                        {postsLayer.items.map((post, index) => (
                            <div 
                                key={post.id} 
                                {...postsReorder.dragProps(index)}
                                className={`flex flex-col gap-2 bg-zinc-900/30 p-2 rounded-2xl border border-zinc-800/50 relative group transition-all hover:border-zinc-700 ${postsReorder.dragIndex === index ? 'opacity-30 scale-95 border-brand-hover border-dashed' : ''}`}
                            >
                                <div className="absolute top-0 left-0 z-30 p-1.5 text-zinc-500 hover:text-white cursor-grab active:cursor-grabbing bg-[#09090b]/80 backdrop-blur-md rounded-br-xl rounded-tl-[15px]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                </div>

                                <button 
                                    onClick={() => postsLayer.removeItem(post.id)} 
                                    className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-300 hover:bg-red-500 hover:text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-30 shadow-lg transition-colors border border-zinc-700"
                                >✕</button>
                                
                                <InputPost value={post.image} onChange={(val) => postsLayer.updateItem(post.id, 'image', val)} />
                                
                                <div className="flex items-center justify-between gap-1.5 w-full mt-1">
                                    <div className="flex gap-1.5">
                                        <button 
                                            onClick={() => postsReorder.moveItem(index, -1)} 
                                            disabled={index === 0}
                                            className="bg-zinc-900 text-zinc-400 hover:text-white p-1.5 rounded-lg border border-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <button 
                                            onClick={() => postsReorder.moveItem(index, 1)} 
                                            disabled={index === postsLayer.items.length - 1}
                                            className="bg-zinc-900 text-zinc-400 hover:text-white p-1.5 rounded-lg border border-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => postsLayer.updateItem(post.id, 'isCarousel', !post.isCarousel)} 
                                        className={`flex-1 py-1.5 text-[10px] rounded-lg flex items-center justify-center gap-1 font-bold transition-all border ${post.isCarousel ? 'bg-brand-hover border-brand-hover text-white shadow-sm' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'}`}
                                        title="Toggle Carousel Icon"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 48 48"><path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 7. Grid Tabs */}
                <Section title="Profile Tabs" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}>
                    <div className="flex flex-col gap-4">
                        <Toggle label="Show Reels Tab" checked={tabs.reels} onChange={() => setTabs({ ...tabs, reels: !tabs.reels })} />
                        <Toggle label="Show Repost Tab" checked={tabs.repost} onChange={() => setTabs({ ...tabs, repost: !tabs.repost })} />
                    </div>
                </Section>

                {/* 8. Device Settings */}
                <DeviceSettings statusBar={statusBar} />

            </div>

            {/* Export Buttons */}
            <ExportBottomBar 
                phoneFrameRef={exportData.phoneFrameRef} 
                downloadImage={exportData.downloadImage} 
                fileName={`feed-${profile.username || "export"}`} 
            />
        </div>
    );
}