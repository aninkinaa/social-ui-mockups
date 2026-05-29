const DEFAULT_PROFILE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

export const initialStatusBar = {
    timeText: "9:41",
    batteryLevel: 85,
    signalBars: 3,
    showDynamicIsland: false,
    diWaveColor: "#ffffff",
    diPhotoUrl: ""
};

export const initialNotes = [
    {
        id: 1,
        username: "Your note",
        text: "It's so hot today!",
        music: null,
        avatarUrl: DEFAULT_PROFILE,
        showLocation: true,
        locationName: "Location off"
    },
    {
        id: 2,
        username: "mutual 1",
        text: "",
        music: null,
        avatarUrl: DEFAULT_PROFILE,
        showLocation: true,
        locationName: "Somewhere in Italy"
    },
];

export const initialMessages = [
    {
        id: 1,
        username: "user",
        message: "Sent a reel by @user2",
        time: "2m",
        isRead: false,
        ringType: "cf",
        storySeen: false,
        avatar: DEFAULT_PROFILE
    }
];

export const addNote = {
    id: Date.now,
    username: "",
    text: "",
    music: null,
    lyric: null,
    avatarUrl: "",
    showLocation: false,
    locationName: ""
}

export const addMessage = {
    id: Date.now(),
    username: "",
    message: "",
    time: "1m",
    isRead: true,
    ringType: "none",
    avatar: ""
}

export const initialStoryComment = [
    {
        id: 1,
        username: 'user',
        text: 'LOL',
        isAuthor: true,
        avatar: DEFAULT_PROFILE
    },

    {
        id: 2,
        username: 'user2',
        text: 'is it fr',
        isAuthor: false,
        avatar: DEFAULT_PROFILE
    },
]

export const initialHeader = {
    username: "username",
    postedTime: "10h",
    storyCount: 3,
    currentStory: 1,
    isCF: false,
};

export const initialAddon = {
    mode: "music", // 'none' | 'music' | 'repost'
    musicArtist: "Artist",
    musicTitle: "Title",
    repostUsername: "_user",
};

export const initialFloatingComment = {
    show: true,
    text: "Wow",
    replyText: "",
};

export const initialProfile = {
    username: "username",
    nickname: "nickname",
    avatar: DEFAULT_PROFILE,
    note: "It's so hot today!",
    pronouns: "they/them",
    posts: "12",
    followers: "1.000",
    following: "50",
}

export const initialBio = {
    text: "This is bio text.",
    links: ["letterboxd.com/kinatofu", "id.pinterest.com/capablenough"],
    music: {
        title: "Title",
        artist: "Artist"
    }
}

export const initialFollowedBy = {
    show: true,
    othersCount: "2",
    users: [
        { id: 1, avatar: DEFAULT_PROFILE, username: "user" },
        { id: 2, avatar: DEFAULT_PROFILE, username: "user" },
        { id: 3, avatar: "", username: "" }
    ]
}

export const initialPost = [
    {
        id: Date.now(),
        avatar: DEFAULT_PROFILE,
        username: "username",
        isVerified: true,
        audio: {
            show: true,
            isMuted: true,
            artist: "Artist",
            title: "Title"
        },
        image: DEFAULT_PROFILE,
        aspectRatio: "portrait",
        showTag: true,
        slider: { show: true, showBadge: true, current: 1, total: 8 },
        isLiked: false,
        likes: "0",
        comment: { show: true, count: "0" },
        repost: { show: true, count: "" },
        share: { show: true, count: "" },
        likedBy: {
            show: true,
            users: [
                { id: 1, avatar: DEFAULT_PROFILE, username: "someone" },
                { id: 2, avatar: "", username: "" },
                { id: 3, avatar: "", username: "" }
            ],
            othersCount: "others"
        },
        caption: { text: "", date: "1w" },
        commentsList: [
            {
                id: 1, avatar: DEFAULT_PROFILE, username: "commenter_one", time: "1w", text: "nice post!", likes: "73", isLiked: false,
                showInFeed: true,
                visibleRepliesCount: 0,
                replies: [
                    { id: 11, avatar: DEFAULT_PROFILE, username: "reply_user_one", time: "1w", text: "agreed!", likes: "2", isLiked: false },
                ]
            }
        ]
    }
]