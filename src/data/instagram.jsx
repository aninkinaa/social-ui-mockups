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
        username: "im staring!🧍‍♂️",
        message: "Reacted 😂 to your story",
        time: "2h",
        isRead: false,
        ringType: "none",
        storySeen: false,
        avatar: "/staring2.png"
    },
    {
        id: 4,
        username: "Sunny Doll",
        message: "Liked a message",
        time: "5h",
        isRead: true,
        ringType: "sg",
        storySeen: false,
        avatar: "/sunnydoll.png"
    },
    {
        id: 5,
        username: "pooramnesia",
        message: "Sent an attachment",
        time: "1d",
        isRead: true,
        ringType: "none",
        storySeen: false,
        avatar: "/amnesia.png"
    },
    {
        id: 6,
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