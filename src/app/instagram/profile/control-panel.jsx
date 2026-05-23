"use client"
import { Section, Toggle, Input } from "@/components/panel-ui";
import DeviceSettings from "@/components/device-settings";
import PanelHeader from "@/components/panel-header";
import AvatarInput from "@/components/input-avatar";

const DEFAULT_AVATAR = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

export default function FeedsControlPanel({ 
    statusBar, 
    profile, setProfile, 
    bioProps, setBioProps, 
    action, setAction, 
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

    return (
        <div className="w-full max-w-[420px] bg-[#18181b] xl:rounded-[24px] xl:border border-[#27272a] xl:shadow-2xl flex flex-col h-auto min-h-screen xl:min-h-0 xl:h-[852px] xl:overflow-hidden relative shrink-0">
            <PanelHeader title="Feeds Creator" description="Customize your perfect IG Profile." />

            <div className="flex-1 p-6 xl:overflow-y-auto custom-scrollbar flex flex-col gap-6 pb-32 relative z-10">
                
                {/* 1. Profile Settings */}
                <Section title="Profile Settings" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                    <div className="flex gap-4 items-start">
                        <AvatarInput value={profile.avatar} onChange={(val) => setProfile({ ...profile, avatar: val })} />
                        <div className="flex-1 flex flex-col gap-2">
                            <Input value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} placeholder="Username" />
                            <Input value={profile.nickname} onChange={(e) => setProfile({ ...profile, nickname: e.target.value })} placeholder="Name / Nickname" />
                            <Input value={profile.pronouns} onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })} placeholder="Pronouns (e.g. she/her)" />
                        </div>
                    </div>
                    <Input value={profile.note} onChange={(e) => setProfile({ ...profile, note: e.target.value })} placeholder="Notes Text (Leave empty to hide)" />
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <Input value={profile.posts} onChange={(e) => setProfile({ ...profile, posts: e.target.value })} placeholder="Posts" label="Posts" />
                        <Input value={profile.followers} onChange={(e) => setProfile({ ...profile, followers: e.target.value })} placeholder="Followers" label="Followers" />
                        <Input value={profile.following} onChange={(e) => setProfile({ ...profile, following: e.target.value })} placeholder="Following" label="Following" />
                    </div>
                </Section>

                {/* 2. Device Settings */}
                <DeviceSettings statusBar={statusBar} />

                {/* 3. Action Buttons */}
                <Section title="Action Buttons" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>}>
                    <Toggle label="Is Following" subLabel="Toggles Follow/Following button & Bell Icon" checked={action.isFollowing} onChange={() => setAction({ ...action, isFollowing: !action.isFollowing })} />
                </Section>

                {/* 4. Bio & Details */}
                <Section title="Bio & Details" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>}>
                    <textarea value={bioProps.text} onChange={(e) => setBioProps({ ...bioProps, text: e.target.value })} placeholder="Bio Text" className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full min-h-[60px] resize-y custom-scrollbar" />
                    
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-neutral-400">Links</label>
                            <button onClick={addLink} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add Link</button>
                        </div>
                        {bioProps.links.map((link, i) => (
                            <div key={i} className="flex gap-2">
                                <Input value={link} onChange={(e) => updateLink(i, e.target.value)} placeholder={`Link ${i + 1}`} />
                                <button onClick={() => removeLink(i)} className="text-red-400 px-2 transition-colors hover:text-red-300">✕</button>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-[#3f3f46]">
                        <Toggle label="Include Music" checked={!!bioProps.music} onChange={() => setBioProps({ ...bioProps, music: bioProps.music ? null : { title: "Title", artist: "Artist" } })} />
                        {bioProps.music && (
                            <div className="grid grid-cols-2 gap-2">
                                <Input value={bioProps.music.title} onChange={(e) => setBioProps({ ...bioProps, music: { ...bioProps.music, title: e.target.value } })} placeholder="Song Title" />
                                <Input value={bioProps.music.artist} onChange={(e) => setBioProps({ ...bioProps, music: { ...bioProps.music, artist: e.target.value } })} placeholder="Artist" />
                            </div>
                        )}
                    </div>
                </Section>

                {/* 5. Highlights */}
                <Section title="Highlights" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                    <button onClick={() => highlightsLayer.addItem({ id: Date.now(), title: "New", image: DEFAULT_AVATAR })} className="bg-[#27272a] hover:bg-[#3f3f46] w-full py-2 rounded-lg text-xs font-semibold text-white transition-all mb-2 shadow-sm shadow-black/20">
                        + Add Highlight
                    </button>
                    <div className="flex flex-col gap-3">
                        {highlightsLayer.items.map((h) => (
                            <div key={h.id} className="flex items-center gap-3 bg-[#18181b] p-2 rounded-xl border border-[#3f3f46]">
                                <AvatarInput className="w-10 h-10" value={h.image} onChange={(val) => highlightsLayer.updateItem(h.id, 'image', val)} />
                                <div className="flex-1">
                                    <Input value={h.title} onChange={(e) => highlightsLayer.updateItem(h.id, 'title', e.target.value)} placeholder="Title" />
                                </div>
                                <button onClick={() => highlightsLayer.removeItem(h.id)} className="text-neutral-500 hover:text-red-400 p-2 transition-colors">
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 6. Grid Posts (NEW) */}
                <Section title="Grid Posts" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 9h18" strokeWidth="2"/><path d="M9 21V9" strokeWidth="2"/></svg>}>
                    <button onClick={() => postsLayer.addItem({ id: Date.now(), image: "", isCarousel: false })} className="bg-[#27272a] hover:bg-[#3f3f46] w-full py-2 rounded-lg text-xs font-semibold text-white transition-all mb-3 shadow-sm shadow-black/20">
                        + Add Post
                    </button>
                    
                    <div className="grid grid-cols-3 gap-2">
                        {postsLayer.items.map((post) => (
                            <div key={post.id} className="flex flex-col gap-2 bg-[#18181b] p-2 rounded-xl border border-[#3f3f46] relative group">
                                <button 
                                    onClick={() => postsLayer.removeItem(post.id)} 
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                                >✕</button>
                                
                                <AvatarInput className="w-full aspect-square rounded-md" value={post.image} onChange={(val) => postsLayer.updateItem(post.id, 'image', val)} />
                                
                                <button 
                                    onClick={() => postsLayer.updateItem(post.id, 'isCarousel', !post.isCarousel)} 
                                    className={`py-1 text-[10px] rounded flex items-center justify-center gap-1 font-semibold transition-colors ${post.isCarousel ? 'bg-indigo-600 text-white' : 'bg-[#27272a] text-neutral-400 hover:text-white'}`}
                                >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 48 48"><path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 7. Grid Tabs */}
                <Section title="Grid Tabs" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}>
                    <div className="flex flex-col gap-2">
                        <Toggle label="Show Reels Tab" checked={tabs.reels} onChange={() => setTabs({ ...tabs, reels: !tabs.reels })} />
                        <Toggle label="Show Repost Tab" checked={tabs.repost} onChange={() => setTabs({ ...tabs, repost: !tabs.repost })} />
                    </div>
                </Section>

            </div>

            {/* Export Buttons */}
            <div className="hidden xl:flex absolute bottom-0 left-0 right-0 p-5 bg-[#18181b]/90 backdrop-blur-md border-t border-[#27272a] gap-3 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <button 
                    onClick={() => exportData.downloadImage(exportData.phoneFrameRef, "jpg", `feed-${profile.username || "export"}`)} 
                    className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-3 rounded-xl text-sm font-bold transition-all border border-[#3f3f46]"
                >
                    Save JPG
                </button>
                <button 
                    onClick={() => exportData.downloadImage(exportData.phoneFrameRef, "png", `feed-${profile.username || "export"}`)} 
                    className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-900/30"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Save High-Res
                </button>
            </div>
        </div>
    );
}