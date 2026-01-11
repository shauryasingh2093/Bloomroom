// Room video configuration
// Place your video files in /public/videos/transitions/

export const roomVideos = {
    entry: {
        id: 'entry',
        name: 'Entry Hall',
        videoPath: '/entering_house.mp4',
        fallbackColor: '#f5e6d3',
        description: 'Welcome home'
    },
    planning: {
        id: 'planning',
        name: 'Planning Room',
        videoPath: '/videos/transitions/planning.mp4',
        fallbackColor: '#e8f4e8',
        description: 'Daily tasks & goals'
    },
    calm: {
        id: 'calm',
        name: 'Calm Room',
        videoPath: '/videos/transitions/calm.mp4',
        fallbackColor: '#f0f5f0', // sage-50
        description: 'Breathe and release'
    },
    future: {
        id: 'future',
        name: 'Future Room',
        videoPath: '/videos/transitions/Future_Room_Video_Generation (1).mp4',
        fallbackColor: '#faf8f5', // cream-100
        description: 'Dreams & growth'
    },
    care: {
        id: 'care',
        name: 'Care Room',
        videoPath: '/videos/transitions/care.mp4',
        fallbackColor: '#fff8f5', // peach-50
        description: 'Self-care & rituals'
    },
    memory: {
        id: 'memory',
        name: 'Memory Corner',
        videoPath: '/videos/transitions/memory.mp4',
        fallbackColor: '#fefefe', // cream-50
        description: 'Reflections & gratitude'
    }
};

export const getVideoConfig = (roomId) => {
    return roomVideos[roomId] || null;
};
