import Link from 'next/link';

export const metadata = {
  title: 'Instagram Mockup Generator | SocialUI',
  description: 'Create pixel-perfect Instagram Profile, Story, and DM mockups for free.',
}

export default function InstagramMenu() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans selection:bg-pink-500/30">
      <nav className="border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-1">
              <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight">Instagram Tools</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          What do you want to create?
        </h1>
        <p className="text-zinc-400 mb-12 max-w-xl">
          Select a template below to start generating your high-resolution Instagram mockup.
        </p>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          
          <Link href="/instagram/profile" className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-pink-500/50 hover:bg-zinc-900/80 transition-all text-left flex flex-col relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-zinc-300 group-hover:text-pink-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1">Profile</h3>
            <p className="text-zinc-500 text-sm">Create a realistic Instagram profile mockup with custom bio, followers, and grid.</p>
          </Link>

          <Link href="/instagram/story" className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-red-500/50 hover:bg-zinc-900/80 transition-all text-left flex flex-col relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform p-0.5 border-2 border-transparent group-hover:border-red-500">
              <svg className="w-6 h-6 text-zinc-300 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1">Story</h3>
            <p className="text-zinc-500 text-sm">Design engaging IG stories with custom username, timestamp, and progress bars.</p>
          </Link>

          <Link href="/instagram/messages" className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900/80 transition-all text-left flex flex-col relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-zinc-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1">DM Inbox</h3>
            <p className="text-zinc-500 text-sm">Design a realistic Instagram DM Inbox with custom IG Notes, unread indicators, and message lists.</p>
          </Link>

          <Link href="/instagram/post" className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-yellow-500/50 hover:bg-zinc-900/80 transition-all text-left flex flex-col relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-zinc-300 group-hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1">Post (Feed)</h3>
            <p className="text-zinc-500 text-sm">Mockup a standard Instagram feed post with likes, comments, and captions.</p>
          </Link>

        </div>
      </main>
    </div>
  );
}