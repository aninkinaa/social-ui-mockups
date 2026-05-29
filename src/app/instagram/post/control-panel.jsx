import { Section, Toggle, Input } from "@/components/panel-ui";
import DeviceSettings from "@/components/device-settings";
import PanelHeader from "@/components/panel-header";
import AvatarInput from "@/components/input-avatar";
import InputPost from "@/components/input-post";
import ExportBottomBar from "@/components/export-bottom-bar";
import { useDragReorder } from "@/hooks/useDragReorder";
import { useState } from "react";

const DEFAULT_AVATAR = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

const IconEye = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>;
const IconEyeOff = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>;

export default function FeedsControlPanel({ 
    statusBar, 
    pageSettings, setPageSettings,
    postsLayer, 
    exportData 
}) {

    const postsReorder = useDragReorder(postsLayer);
    const [expandedPost, setExpandedPost] = useState(postsLayer.items[0]?.id || null);

    const updatePost = (id, field, value) => postsLayer.updateItem(id, field, value);
    const updatePostNested = (id, parent, child, value) => {
        const post = postsLayer.items.find(p => p.id === id);
        if(post) postsLayer.updateItem(id, parent, { ...post[parent], [child]: value });
    };

    const addComment = (postId) => {
        const post = postsLayer.items.find(p => p.id === postId);
        const newComments = [...(post.commentsList || []), { id: Date.now(), avatar: DEFAULT_AVATAR, username: "user", time: "1h", text: "Nice post!", likes: "0", isLiked: false, showInFeed: false, visibleRepliesCount: 0, replies: [] }];
        updatePost(postId, 'commentsList', newComments);
    };
    const updateComment = (postId, cIdx, field, value) => {
        const post = postsLayer.items.find(p => p.id === postId);
        const newComments = [...post.commentsList];
        newComments[cIdx][field] = value;
        updatePost(postId, 'commentsList', newComments);
    };
    const removeComment = (postId, cIdx) => {
        const post = postsLayer.items.find(p => p.id === postId);
        const newComments = post.commentsList.filter((_, i) => i !== cIdx);
        updatePost(postId, 'commentsList', newComments);
    };
    const moveComment = (postId, cIdx, direction) => {
        const post = postsLayer.items.find(p => p.id === postId);
        const newComments = [...post.commentsList];
        const targetIndex = cIdx + direction;
        if (targetIndex >= 0 && targetIndex < newComments.length) {
            [newComments[cIdx], newComments[targetIndex]] = [newComments[targetIndex], newComments[cIdx]];
            updatePost(postId, 'commentsList', newComments);
        }
    };

    const addReply = (postId, cIdx) => {
        const post = postsLayer.items.find(p => p.id === postId);
        const newComments = [...post.commentsList];
        const newReplies = [...(newComments[cIdx].replies || []), { id: Date.now(), avatar: DEFAULT_AVATAR, username: "reply_user", time: "1m", text: "Reply text", likes: "0", isLiked: false }];
        newComments[cIdx].replies = newReplies;
        if(newComments[cIdx].visibleRepliesCount === 0) newComments[cIdx].visibleRepliesCount = 1; 
        updatePost(postId, 'commentsList', newComments);
    };
    const updateReply = (postId, cIdx, rIdx, field, value) => {
        const post = postsLayer.items.find(p => p.id === postId);
        const newComments = [...post.commentsList];
        newComments[cIdx].replies[rIdx][field] = value;
        updatePost(postId, 'commentsList', newComments);
    };
    const removeReply = (postId, cIdx, rIdx) => {
        const post = postsLayer.items.find(p => p.id === postId);
        const newComments = [...post.commentsList];
        newComments[cIdx].replies = newComments[cIdx].replies.filter((_, i) => i !== rIdx);
        updatePost(postId, 'commentsList', newComments);
    };

    return (
        <div className="w-full xl:w-[480px] bg-[#18181b] xl:border-l border-[#27272a] flex flex-col h-auto min-h-screen xl:h-screen relative shrink-0 z-20">
            <PanelHeader title="Feed Creator" description="Custom Multiple IG Feeds." />

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8 pb-32 relative z-10">
                
                {/* 1. Global Page Settings */}
                <Section title="Global Page Settings" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Top Nav Username</label>
                            <Input value={pageSettings.headerUsername} onChange={(e) => setPageSettings({ ...pageSettings, headerUsername: e.target.value })} placeholder="e.g. aerichandesu" />
                        </div>
                        <div className="h-px w-full bg-[#3f3f46]/50"></div>
                        <div className="flex gap-4 items-start bg-black/20 p-3 rounded-xl border border-white/5">
                            <AvatarInput className="w-12 h-12 shadow-md shrink-0" value={pageSettings.viewerAvatar} onChange={(val) => setPageSettings({ ...pageSettings, viewerAvatar: val })} />
                            <div className="flex flex-col gap-1.5 flex-1 pt-1">
                                <label className="text-[11px] font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    POV Viewer Profile
                                </label>
                                <p className="text-[10px] text-neutral-400 leading-snug">This avatar appears in the comment sheet input, representing the user who is viewing the post.</p>
                            </div>
                        </div>
                    </div>
                </Section>

                <div className="h-px w-full bg-[#27272a]"></div>

                {/* 2. Manage Feed Posts */}
                <Section title="Manage Feed Posts" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>}>
                    <button 
                        onClick={() => {
                            const newId = Date.now();
                            postsLayer.addItem({
                                id: newId, avatar: DEFAULT_AVATAR, username: "username", isVerified: false, 
                                audio: { show: false, isMuted: false, artist: "", title: "" }, image: "", aspectRatio: "square",
                                showTag: false, slider: { show: false, showBadge: false, current: 1, total: 1 }, 
                                isLiked: false, likes: "10K",
                                comment: { show: true, count: "100" }, repost: { show: false, count: "0" }, share: { show: true, count: "50" },
                                likedBy: { 
                                    show: false, 
                                    users: [
                                        { id: Date.now()+1, avatar: DEFAULT_AVATAR, username: "user" },
                                        { id: Date.now()+2, avatar: "", username: "" },
                                        { id: Date.now()+3, avatar: "", username: "" }
                                    ],
                                    othersCount: ""
                                },
                                caption: { text: "New post caption", date: "May 20" }, commentsList: []
                            });
                            setExpandedPost(newId);
                        }} 
                        className="bg-brand hover:bg-brand-hover w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm shadow-brand/50 flex items-center justify-center gap-2 mb-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add New Post
                    </button>

                    <div className="flex flex-col gap-3">
                        {postsLayer.items.map((post, index) => (
                            <div key={post.id} {...postsReorder.dragProps(index)} className={`bg-[#18181b] p-3 rounded-xl border transition-all ${expandedPost === post.id ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'border-[#3f3f46]/50'} ${postsReorder.dragIndex === index ? 'opacity-30 scale-95 border-dashed' : ''}`}>
                                
                                {/* DRAG HEADER */}
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                                        <div className="text-neutral-500 cursor-grab active:cursor-grabbing hover:text-white shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
                                        </div>
                                        <span className="text-sm font-medium text-white line-clamp-1">{post.username || "Post"}</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                        <button onClick={(e) => { e.stopPropagation(); postsReorder.moveItem(index, -1); }} disabled={index === 0} className="bg-[#27272a] text-neutral-400 hover:text-white p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); postsReorder.moveItem(index, 1); }} disabled={index === postsLayer.items.length - 1} className="bg-[#27272a] text-neutral-400 hover:text-white p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); postsLayer.removeItem(post.id); }} className="text-neutral-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-md transition-colors ml-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {expandedPost === post.id && (
                                    <div className="mt-4 flex flex-col gap-6 pt-4 border-t border-[#3f3f46]/50">
                                        
                                        {/* POST PROFILE */}
                                        <div className="flex gap-3 items-start bg-black/20 p-3 rounded-xl border border-white/5">
                                            <AvatarInput className="w-12 h-12 shadow-sm shrink-0" value={post.avatar} onChange={(val) => updatePost(post.id, 'avatar', val)} />
                                            <div className="flex-1 flex flex-col gap-2 min-w-0">
                                                <Input value={post.username} onChange={(e) => updatePost(post.id, 'username', e.target.value)} placeholder="Username" />
                                                <Toggle label="Verified Badge" checked={post.isVerified} onChange={() => updatePost(post.id, 'isVerified', !post.isVerified)} />
                                            </div>
                                        </div>
                                        
                                        {/* MEDIA CONTENT */}
                                        <div className="flex flex-col gap-2 bg-black/20 p-3 rounded-xl border border-white/5">
                                            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Media Content</label>
                                            <div className="flex gap-4">
                                                <div className="w-[140px] shrink-0">
                                                    <InputPost value={post.image} onChange={(val) => updatePost(post.id, 'image', val)} aspectRatio={post.aspectRatio} />
                                                </div>
                                                <div className="flex-1 flex flex-col gap-3 justify-center">
                                                    <Toggle label="Show Tagged Icon" checked={post.showTag} onChange={() => updatePost(post.id, 'showTag', !post.showTag)} />
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[10px] text-neutral-500 uppercase font-bold">Aspect Ratio</label>
                                                        <div className="flex flex-col bg-[#18181b] p-1 rounded-lg border border-[#3f3f46]">
                                                            {['square', 'landscape', 'portrait'].map((r) => (
                                                                <button key={r} onClick={() => updatePost(post.id, 'aspectRatio', r)} className={`py-1 text-[11px] font-semibold rounded transition-colors ${post.aspectRatio === r ? 'bg-brand text-white' : 'text-neutral-400 hover:text-white'}`}>
                                                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* MEDIA ENHANCEMENTS: MUSIC & SLIDER */}
                                        <div className="flex flex-col gap-3">
                                            {/* Music */}
                                            <div className="flex flex-col gap-2 p-3 bg-black/20 rounded-xl border border-white/5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Background Music</label>
                                                    <Toggle checked={post.audio.show} onChange={() => updatePostNested(post.id, 'audio', 'show', !post.audio.show)} />
                                                </div>
                                                {post.audio.show && (
                                                    <div className="flex flex-col gap-2 mt-1">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Input value={post.audio.artist} onChange={(e) => updatePostNested(post.id, 'audio', 'artist', e.target.value)} placeholder="Artist" className="text-[11px] h-8" />
                                                            <Input value={post.audio.title} onChange={(e) => updatePostNested(post.id, 'audio', 'title', e.target.value)} placeholder="Song Title" className="text-[11px] h-8" />
                                                        </div>
                                                        <button onClick={() => updatePostNested(post.id, 'audio', 'isMuted', !post.audio.isMuted)} className={`py-1.5 w-full rounded text-[10px] font-bold border transition-colors ${post.audio.isMuted ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-black/40 border-[#3f3f46] text-neutral-400'}`}>
                                                            {post.audio.isMuted ? "🔇 Muted Icon: ON" : "🔊 Muted Icon: OFF"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Slider */}
                                            <div className="flex flex-col gap-2 p-3 bg-black/20 rounded-xl border border-white/5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Carousel / Slider</label>
                                                    <Toggle checked={post.slider.show} onChange={() => updatePostNested(post.id, 'slider', 'show', !post.slider.show)} />
                                                </div>
                                                {post.slider.show && (
                                                    <div className="flex flex-col gap-2 mt-1">
                                                        <div className="flex gap-2 items-center">
                                                            <Input type="number" value={post.slider.current} onChange={(e) => updatePostNested(post.id, 'slider', 'current', e.target.value)} placeholder="Current" className="text-[11px] h-8 text-center" />
                                                            <span className="text-neutral-500 font-bold text-xs">of</span>
                                                            <Input type="number" value={post.slider.total} onChange={(e) => updatePostNested(post.id, 'slider', 'total', e.target.value)} placeholder="Total" className="text-[11px] h-8 text-center" />
                                                        </div>
                                                        <button onClick={() => updatePostNested(post.id, 'slider', 'showBadge', !post.slider.showBadge)} className={`py-1.5 w-full rounded text-[10px] font-bold border transition-colors ${post.slider.showBadge ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-black/40 border-[#3f3f46] text-neutral-400'}`}>
                                                            {post.slider.showBadge ? "🔢 Top Badge: ON" : "🔢 Top Badge: OFF"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="h-px bg-[#3f3f46]/50 w-full"></div>

                                        {/* ACTION STATS */}
                                        <div className="flex flex-col gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                                            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Action Stats</label>
                                            
                                            <div className="mb-2 bg-[#ff3040]/10 p-2 rounded border border-[#ff3040]/30">
                                                <Toggle label="You Liked This Post (Red Heart)" checked={post.isLiked} onChange={() => updatePost(post.id, 'isLiked', !post.isLiked)} />
                                            </div>
                                            
                                            <div className="grid grid-cols-[65px_1fr] gap-2 items-center">
                                                <span className="text-xs text-neutral-500 font-semibold">Likes</span>
                                                <Input value={post.likes} onChange={(e) => updatePost(post.id, 'likes', e.target.value)} placeholder="e.g. 10K" />
                                            </div>
                                            
                                            <div className="grid grid-cols-[65px_1fr_auto] gap-2 items-center">
                                                <span className="text-xs text-neutral-500 font-semibold">Comments</span>
                                                <Input value={post.comment.count} onChange={(e) => updatePostNested(post.id, 'comment', 'count', e.target.value)} disabled={!post.comment.show} placeholder="100" />
                                                <button onClick={() => updatePostNested(post.id, 'comment', 'show', !post.comment.show)} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border ${post.comment.show ? 'bg-brand/20 text-brand border-brand/50' : 'bg-transparent text-neutral-500 border-[#3f3f46]'}`}>
                                                    {post.comment.show ? <IconEye /> : <IconEyeOff />}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-[65px_1fr_auto] gap-2 items-center">
                                                <span className="text-xs text-neutral-500 font-semibold">Reposts</span>
                                                <Input value={post.repost.count} onChange={(e) => updatePostNested(post.id, 'repost', 'count', e.target.value)} disabled={!post.repost.show} placeholder="0" />
                                                <button onClick={() => updatePostNested(post.id, 'repost', 'show', !post.repost.show)} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border ${post.repost.show ? 'bg-brand/20 text-brand border-brand/50' : 'bg-transparent text-neutral-500 border-[#3f3f46]'}`}>
                                                    {post.repost.show ? <IconEye /> : <IconEyeOff />}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-[65px_1fr_auto] gap-2 items-center">
                                                <span className="text-xs text-neutral-500 font-semibold">Shares</span>
                                                <Input value={post.share.count} onChange={(e) => updatePostNested(post.id, 'share', 'count', e.target.value)} disabled={!post.share.show} placeholder="50" />
                                                <button onClick={() => updatePostNested(post.id, 'share', 'show', !post.share.show)} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border ${post.share.show ? 'bg-brand/20 text-brand border-brand/50' : 'bg-transparent text-neutral-500 border-[#3f3f46]'}`}>
                                                    {post.share.show ? <IconEye /> : <IconEyeOff />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="h-px bg-[#3f3f46]/50 w-full"></div>

                                        {/* LIKED BY SECTION (COMPACT) */}
                                        <div className="flex flex-col gap-2 p-3 bg-black/20 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Liked By Section</label>
                                                <Toggle checked={post.likedBy.show} onChange={() => updatePostNested(post.id, 'likedBy', 'show', !post.likedBy.show)} />
                                            </div>
                                            {post.likedBy.show && (
                                                <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-[#3f3f46]/50">
                                                    <div className="flex flex-col gap-2">
                                                        {post.likedBy.users.map((u, i) => (
                                                            <div key={u.id || i} className="flex gap-2 items-center">
                                                                <AvatarInput className="w-7 h-7 shrink-0 shadow-sm" value={u.avatar} onChange={(val) => {
                                                                    const newUsers = [...post.likedBy.users];
                                                                    newUsers[i].avatar = val;
                                                                    updatePostNested(post.id, 'likedBy', 'users', newUsers);
                                                                }} />
                                                                <Input value={u.username} onChange={(e) => {
                                                                    const newUsers = [...post.likedBy.users];
                                                                    newUsers[i].username = e.target.value;
                                                                    updatePostNested(post.id, 'likedBy', 'users', newUsers);
                                                                }} placeholder={`Username ${i+1}`} className="h-7 text-[11px]" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[10px] text-neutral-500 uppercase font-bold">Others Count Text</label>
                                                        <Input 
                                                            value={post.likedBy.othersCount} 
                                                            onChange={(e) => updatePostNested(post.id, 'likedBy', 'othersCount', e.target.value)} 
                                                            placeholder="e.g. 'others', '16 others' (Leave empty to hide)" 
                                                            className="h-8 text-[11px]"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="h-px bg-[#3f3f46]/50 w-full"></div>

                                        {/* CAPTION */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Post Caption</label>
                                            <Input value={post.caption.date} onChange={(e) => updatePostNested(post.id, 'caption', 'date', e.target.value)} placeholder="Date (e.g. 6w, 2h, May 20)" />
                                            <textarea value={post.caption.text} onChange={(e) => updatePostNested(post.id, 'caption', 'text', e.target.value)} placeholder="Write caption here..." className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full min-h-[60px] resize-y custom-scrollbar" />
                                        </div>

                                        <div className="h-px bg-[#3f3f46]/50 w-full"></div>

                                        {/* --- COMMENTS MANAGER (NEW TREE STRUCTURE) --- */}
                                        <div className="flex flex-col gap-4 mt-2">
                                            <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-[#3f3f46]">
                                                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Manage Comments</label>
                                                <button onClick={() => addComment(post.id)} className="text-[11px] font-bold text-brand hover:text-brand-hover transition-colors bg-brand/10 px-2 py-1.5 rounded-md">+ Add Comment</button>
                                            </div>
                                            
                                            <div className="flex flex-col gap-5">
                                                {post.commentsList?.map((cmt, cIdx) => (
                                                    <div key={cmt.id} className="flex flex-col p-3 bg-black/20 rounded-xl border border-white/5 relative">
                                                        
                                                        {/* Delete Button */}
                                                        <button onClick={() => removeComment(post.id, cIdx)} className="absolute top-2 right-2 text-neutral-500 hover:text-red-400 p-1.5 transition-colors z-20 bg-[#18181b] rounded-md"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>

                                                        {/* Tree Structure Wrapper */}
                                                        <div className="flex gap-3 w-full items-stretch">
                                                            
                                                            {/* Col 1: Move Controls */}
                                                            <div className="w-5 shrink-0 flex flex-col gap-1 pt-2">
                                                                <button onClick={() => moveComment(post.id, cIdx, -1)} disabled={cIdx === 0} className="text-neutral-500 hover:text-white disabled:opacity-30 p-0.5 bg-[#18181b] rounded flex justify-center"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg></button>
                                                                <button onClick={() => moveComment(post.id, cIdx, 1)} disabled={cIdx === post.commentsList.length - 1} className="text-neutral-500 hover:text-white disabled:opacity-30 p-0.5 bg-[#18181b] rounded flex justify-center"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></button>
                                                            </div>

                                                            {/* Col 2: Avatar & Thread Line */}
                                                            <div className="flex flex-col items-center shrink-0 w-10 relative">
                                                                <AvatarInput className="w-10 h-10 shrink-0 shadow-sm rounded-full relative z-10" value={cmt.avatar} onChange={(val) => updateComment(post.id, cIdx, 'avatar', val)} />
                                                                {cmt.replies?.length > 0 && (
                                                                    <div className="w-[2px] bg-[#3f3f46] flex-1 my-1 rounded-full relative z-0"></div>
                                                                )}
                                                            </div>

                                                            {/* Col 3: Content & Replies */}
                                                            <div className="flex-1 flex flex-col min-w-0 pr-6 pb-2">
                                                                
                                                                {/* PARENT CONTENT */}
                                                                <div className="flex flex-col gap-2">
                                                                    <Input value={cmt.username} onChange={(e) => updateComment(post.id, cIdx, 'username', e.target.value)} placeholder="Username" className="h-8 text-[12px] font-semibold" />
                                                                    
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <Input value={cmt.time} onChange={(e) => updateComment(post.id, cIdx, 'time', e.target.value)} placeholder="Time (1h)" className="h-8 text-[11px]" />
                                                                        <Input value={cmt.likes} onChange={(e) => updateComment(post.id, cIdx, 'likes', e.target.value)} placeholder="Likes" className="h-8 text-[11px]" />
                                                                    </div>

                                                                    <textarea value={cmt.text} onChange={(e) => updateComment(post.id, cIdx, 'text', e.target.value)} placeholder="Comment text" className="bg-[#18181b] border border-[#3f3f46] text-white text-[12px] rounded-lg px-2 py-1.5 w-full resize-y min-h-[44px] outline-none" />
                                                                    
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <button onClick={() => updateComment(post.id, cIdx, 'isLiked', !cmt.isLiked)} className={`px-2 py-1 flex-1 rounded text-[10px] font-bold border transition-colors ${cmt.isLiked ? 'bg-[#ff3040]/10 border-[#ff3040]/30 text-[#ff3040]' : 'bg-black/40 border-[#3f3f46] text-neutral-400'}`}>
                                                                            ❤️ Liked
                                                                        </button>
                                                                        <button onClick={() => updateComment(post.id, cIdx, 'showInFeed', !cmt.showInFeed)} className={`px-2 py-1 flex-1 rounded text-[10px] font-bold border transition-colors ${cmt.showInFeed ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-black/40 border-[#3f3f46] text-neutral-400'}`}>
                                                                            👁️ Show in Feed
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* REPLIES AREA */}
                                                                <div className="mt-4 flex flex-col gap-4">
                                                                    <div className="flex justify-end">
                                                                        <button onClick={() => addReply(post.id, cIdx)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">+ Add Reply</button>
                                                                    </div>

                                                                    {cmt.replies?.map((r, rIdx) => (
                                                                        <div key={r.id} className="flex gap-2 items-start w-full bg-black/20 p-2.5 rounded-xl border border-white/5 relative">
                                                                            <button onClick={() => removeReply(post.id, cIdx, rIdx)} className="absolute top-1 right-1 text-neutral-500 hover:text-red-400 p-1 shrink-0 z-10"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                                                            
                                                                            <AvatarInput className="w-7 h-7 shrink-0 shadow-sm mt-1" value={r.avatar} onChange={(val) => updateReply(post.id, cIdx, rIdx, 'avatar', val)} />
                                                                            
                                                                            <div className="flex-1 flex flex-col gap-2 min-w-0 pr-5">
                                                                                <Input value={r.username} onChange={(e) => updateReply(post.id, cIdx, rIdx, 'username', e.target.value)} placeholder="Username" className="h-7 text-[11px]" />
                                                                                
                                                                                <div className="grid grid-cols-2 gap-2">
                                                                                    <Input value={r.time} onChange={(e) => updateReply(post.id, cIdx, rIdx, 'time', e.target.value)} placeholder="Time" className="h-7 text-[11px]" />
                                                                                    <Input value={r.likes} onChange={(e) => updateReply(post.id, cIdx, rIdx, 'likes', e.target.value)} placeholder="Likes" className="h-7 text-[11px]" />
                                                                                </div>
                                                                                
                                                                                <textarea value={r.text} onChange={(e) => updateReply(post.id, cIdx, rIdx, 'text', e.target.value)} placeholder="Reply text" className="bg-[#18181b] border border-[#3f3f46] text-white text-[11px] rounded-lg px-2 py-1.5 w-full resize-y min-h-[36px] outline-none" />
                                                                                
                                                                                <div className="mt-0.5">
                                                                                    <button onClick={() => updateReply(post.id, cIdx, rIdx, 'isLiked', !r.isLiked)} className={`px-2 py-1 w-full rounded text-[10px] font-bold border transition-colors ${r.isLiked ? 'bg-[#ff3040]/10 border-[#ff3040]/30 text-[#ff3040]' : 'bg-black/40 border-[#3f3f46] text-neutral-400'}`}>
                                                                                        ❤️ Liked
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

                <div className="h-px w-full bg-[#27272a]"></div>
                
                <DeviceSettings statusBar={statusBar} />

            </div>

            <ExportBottomBar 
                phoneFrameRef={exportData.phoneFrameRef} 
                downloadImage={exportData.downloadImage} 
                fileName={`feed-${pageSettings.headerUsername}`}
                isExporting={exportData.isExporting} 
            />
        </div>
    );
}