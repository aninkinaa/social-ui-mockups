const DEFAULT_PROFILE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23666'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M20 100 Q 50 60 80 100' fill='%23ccc'/%3E%3C/svg%3E";

export const initialStatusBar = {
    timeText: "9:41", 
    batteryLevel: 85, 
    signalBars: 3, 
    showDynamicIsland: true, 
    diWaveColor: "#ffffff",     
    diPhotoUrl: "" 
};

export const initialNotes = [
    {
        id: 1,
        username: "Your note",
        text: "It's so hot today!",
        music: null,
        avatarUrl: "/staring.png",
        showLocation: true,
        locationName: "Location off"
    },
    {
        id: 2,
        username: "mutual 1",
        text: "",
        music: null,
        avatarUrl: "",
        showLocation: true,
        locationName: "Somewhere in Italy"
    },
    {
        id: 3,
        username: "mutual 2",
        text: "",
        music: {
            title: "Shot My Baby",
            artist: "Daniel Caesar"
        },
        lyric: {
            current: `Singin' "Yes I shot my`,
            next: `baby down that day"`
        },

        avatarUrl: "",
        showLocation: false,
        locationName: ""
    },
    {
        id: 4,
        username: "mutual 4",
        text: "🥲",
        music: {
            title: "On The Drive Home",
            artist: "NIKI"
        },
        avatarUrl: "",
        showLocation: false,
        locationName: ""
    }
];

export const initialMessages = [
    {
        id: 1,
        username: "the_merchant",
        message: "Sent a reel by @memezar",
        time: "2m",
        isRead: false,
        ringType: "cf",
        storySeen: false,
        avatar: "/merchant.png"
    },
    {
        id: 2,
        username: "persoo00n4",
        message: "Are we still on for tonight? 🍻",
        time: "15m",
        isRead: true,
        ringType: "sg",
        storySeen: true,
        avatar: "/persona.png"
    },
    {
        id: 3,
        username: "Sunny Doll",
        message: "Liked a message",
        time: "5h",
        isRead: true,
        ringType: "sg",
        storySeen: false,
        avatar: "/sunnydoll.png"
    },
    {
        id: 4,
        username: "pooramnesia",
        message: "Sent an attachment",
        time: "1d",
        isRead: true,
        ringType: "none",
        storySeen: false,
        avatar: "/amnesia.png"
    },
    {
        id: 5,
        username: "devilrAWWrry",
        message: "why u havent pay ur BILLS.",
        time: "1w",
        isRead: false,
        ringType: "none",
        storySeen: false,
        avatar: "/devilry.png"
    }
];

export const addNote = {
    id: Date.now,
    username: "New Note",
    text: "",
    music: null,
    lyric: null,
    avatarUrl: "",
    showLocation: false,
    locationName: ""
}

export const addMessage = {
    id: Date.now(),
    username: "New User",
    message: "Hello",
    time: "1m",
    isRead: true,
    ringType: "none",
    avatar: ""
}

export const initialStoryComment = [
    {
        id: 1,
        username: 'the_merchant',
        text: 'LOL',
        isAuthor: true,
        avatar: DEFAULT_PROFILE
    },

    {
        id: 2,
        username: 'devilry',
        text: 'is it fr',
        isAuthor: false,
        avatar: DEFAULT_PROFILE
    },
]

export const initialHeader = {
    username: "hirono",
    postedTime: "10h",
    storyCount: 3,
    currentStory: 1,
    isCF: false,
};

export const initialAddon = {
    mode: "music", // 'none' | 'music' | 'repost'
    musicArtist: "Day6",
    musicTitle: "Days Gone By",
    repostUsername: "_littlemischief",
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
    pronouns: "she/her",
    posts: "12",
    followers: "1.000",
    following: "50",
}

export const initialBio = {
    text: "agent of change",
    links: ["letterboxd.com/kinatofu", "id.pinterest.com/capablenough"],
    music: {
        title: "gift",
        artist: "suggi"
    }
}

export const initialFollowedBy = {
    show: true,
    othersCount: "16",
    users: [
        { id: 1, avatar: DEFAULT_PROFILE, username: "9gag" },
        { id: 2, avatar: DEFAULT_PROFILE, username: "dagelan" },
        { id: 3, avatar: "", username: "" }
    ]
}