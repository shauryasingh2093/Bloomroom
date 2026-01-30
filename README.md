# 🏡 Bloomroom

> **"Your quiet space to plan, breathe, and grow"**

A cinematic, multi-room wellness application that beautifully combines productivity, mindfulness, and personal growth in an immersive digital sanctuary.

![Version](https://img.shields.io/badge/version-1.0.0-blush)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![License](https://img.shields.io/badge/license-Private-red)

---

## ✨ What is Bloomroom?

Bloomroom is an interactive wellness application that uses a **multi-room house metaphor** to organize different aspects of your life. Each room serves a specific purpose—from planning your day to practicing mindfulness to setting future goals.

### 🎯 Core Features

- 🎬 **Cinematic Experience** - Film-quality video transitions and animations
- 🏠 **6 Themed Rooms** - Planning, Calm, Future, Care, Memory, and Entry
- 🌱 **Visual Growth Tracking** - Watch a plant/flower bloom as you complete goals
- 📝 **Comprehensive Tools** - Tasks, calendar, breathing exercises, journaling, and more
- 👤 **Multi-Profile Support** - Separate spaces for work, personal life, etc.
- 💾 **Smart Data Sync** - Local-first with optional cloud backup via Supabase
- 📱 **PWA Ready** - Install like a native app on any device
- 🎨 **Premium Design** - Soft pastels, elegant typography, frosted glass UI

---

## 🎬 Preview

### Opening Experience
1. **Cinematic Video** - Welcome users with a beautiful opening sequence
2. **Smooth Transitions** - Room-specific videos when entering each space
3. **Elegant UI** - Frosted glass overlays with gentle animations

### The 6 Rooms

| Room | Icon | Purpose | Key Features |
|------|------|---------|--------------|
| **Planning Room** | 📋 | Daily productivity | Tasks, calendar, focus timer, mind dump |
| **Calm Room** | 🌊 | Mindfulness & relaxation | Breathing exercises, ambient sounds, affirmations |
| **Future Room** | 🌅 | Goals & vision | Goal tracking, growth visualizer, intentions |
| **Care Room** | 💚 | Self-care & gratitude | Daily check-ins, gratitude journal, reflections |
| **Memory Corner** | 📖 | Reflection & journaling | Photo journal, memory timeline |
| **Entry** | 🏠 | Welcome space | Profile selection, navigation hub |

---



## 🛠️ Tech Stack

### **Frontend**
- ⚛️ **React 19.2.0** - Modern UI library
- ⚡ **Vite 7.2.4** - Lightning-fast build tool
- 🎨 **Tailwind CSS 4.1.18** - Utility-first styling
- 🎭 **Framer Motion 12.25.0** - Smooth animations
- 🎬 **GSAP 3.14.2** - Advanced animation engine
- 🧭 **React Router DOM 7.12.0** - Client-side routing
- 📅 **date-fns 4.1.0** - Date utilities

### **Backend**
- 🔐 **Supabase 2.90.1** - Authentication, database, real-time sync
- 💾 **localStorage** - Client-side persistence
- 🔄 **React Context API** - Global state management

### **Deployment**
- ▲ **Vercel** - Hosting with automatic HTTPS and CDN
- 📱 **PWA** - Progressive Web App capabilities
- 🌍 **Edge Network** - Global content delivery

### **Development**
- 🔍 **ESLint** - Code quality and linting
- 🎨 **PostCSS** - CSS processing
- 📦 **npm** - Package management

**Total**: 19 npm packages, ~25 technologies

---

## 📁 Project Structure

```
Bloomroom/
├── public/                      # Static assets
│   ├── videos/                  # Room transition videos
│   ├── sounds/                  # Ambient audio files
│   ├── paintings/               # Room decorations
│   ├── images/                  # General images
│   └── manifest.json            # PWA manifest
│
├── src/
│   ├── components/              # React components
│   │   ├── auth/                # Authentication
│   │   ├── calm/                # Calm Room features
│   │   ├── future/              # Future Room features
│   │   ├── memory/              # Memory Corner features
│   │   ├── planning/            # Planning Room features
│   │   ├── rooms/               # Room-specific UI
│   │   ├── tasks/               # Task management
│   │   └── common/              # Shared components
│   │
│   ├── config/                  # Configuration files
│   ├── context/                 # Global state
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Third-party integrations
│   ├── pages/                   # Page components
│   ├── utils/                   # Utility functions
│   │
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
│
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite configuration
├── DEPLOYMENT.md                # Deployment guide
├── PRODUCT_SUMMARY.md           # Complete product documentation
└── TECH_STACK.md                # Technology breakdown
```

---

## 🎨 Design System

### Color Palette (Cinematic Dusk)

```css
/* Sage (Greens) */
--sage-50: #f0f5f0;
--sage-500: #7db07d;
--sage-900: #315631;

/* Blush (Pinks) */
--blush-50: #fff5f7;
--blush-500: #ff8caa;
--blush-900: #c0647c;

/* Peach (Warm Accents) */
--peach-50: #fff8f5;
--peach-500: #ff8c64;

/* Cream (Neutrals) */
--cream-50: #fefefe;
--cream-500: #e6dcd1;
```

### Typography
- **Primary**: Inter (sans-serif)
- **Elegant Titles**: Playfair Display (serif)

### Visual Effects
- 🎞️ Film grain texture
- ✨ Floating particles
- 🪟 Frosted glass (glassmorphism)
- 🌅 Depth of field blur
- 🎬 Cinematic transitions

---

## 🌟 Key Features Explained

### 🌱 Growth Visualizer
Watch a beautiful flower bloom as you complete goals! The plant grows proportionally to your progress, and displays a **golden crown** when you reach your target.

### 📊 Multi-Profile System
Create separate profiles for different aspects of your life:
- 💼 Work profile
- 🏠 Personal profile
- 🎯 Project-specific profiles

Each profile has isolated data and settings.

### 🔄 Smart Data Sync
- **Local-first**: Works offline, data stored in browser
- **Cloud backup**: Optional Supabase sync for cross-device access
- **Real-time**: Changes sync instantly across devices

### 📱 PWA Capabilities
- Install on home screen (iOS/Android)
- Desktop app mode (Chrome/Edge)
- Offline support
- Native-like experience

---

## 🎯 Room Details

### 📋 Planning Room
**Purpose**: Organize your day and boost productivity

**Features**:
- ✅ Task list with add/complete/delete
- 📅 Daily calendar view
- ⏱️ Focus timer (Pomodoro technique)
- 🧠 Mind dump (brain dump space)
- 📝 Quick notes
- 🎵 Ambient background sounds

### 🌊 Calm Room
**Purpose**: Practice mindfulness and find peace

**Features**:
- 🫁 Guided breathing exercises
- 🔮 Breathing sphere visualization
- 🎶 Ambient sound player (rain, ocean, forest, café)
- 💭 Daily affirmations
- 🎨 Calming color palette

### 🌅 Future Room
**Purpose**: Set goals and visualize your future

**Features**:
- 🎯 Goal list with target tracking
- 🌸 Growth visualizer (blooming flower)
- 📝 Monthly intentions
- 🖼️ Vision board
- 👑 Completion celebration

### 💚 Care Room
**Purpose**: Practice self-care and gratitude

**Features**:
- 🙏 Daily gratitude journal
- ❓ Daily check-in questions
- 📜 "My Reflections" history (14 days)
- 💬 Gentle encouragement messages
- 🌿 Self-care reminders

### 📖 Memory Corner
**Purpose**: Reflect and preserve memories

**Features**:
- 📸 Journal with image uploads
- 🖼️ Photo memories
- 📚 Past reflections archive
- 📅 Timeline view

---



## 🎨 Design Philosophy

### 1. **Soft & Gentle**
- Pastel color palette
- Rounded corners everywhere
- Soft shadows and glows
- No harsh contrasts

### 2. **Cinematic Quality**
- Film grain texture
- Smooth transitions
- Professional animations
- Depth of field effects

### 3. **Intentional Interactions**
- No notifications or pressure
- User-initiated actions
- Gentle encouragement
- Respectful of time

### 4. **Growth-Oriented**
- Visual progress feedback
- Celebration of milestones
- Non-judgmental tracking
- Focus on small wins

### 5. **Premium Feel**
- High-quality typography
- Elegant serif fonts
- Sophisticated color choices
- Polished UI components

---

## 🔐 Privacy & Security

- ✅ **Local-first**: Data stored in your browser by default
- ✅ **Optional cloud sync**: You control what syncs to Supabase
- ✅ **Encrypted connections**: HTTPS everywhere
- ✅ **No tracking**: No analytics or third-party trackers
- ✅ **Open source**: Transparent codebase (if you choose to open-source)

---

## 🤝 Contributing

This is currently a personal project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and all rights are reserved. If you'd like to use this code, please contact the author.

---

## 🙏 Acknowledgments

### Technologies
- [React](https://react.dev) - UI library by Meta
- [Vite](https://vitejs.dev) - Build tool by Evan You
- [Tailwind CSS](https://tailwindcss.com) - CSS framework by Adam Wathan
- [Framer Motion](https://www.framer.com/motion) - Animation library by Framer
- [GSAP](https://greensock.com/gsap) - Animation engine by GreenSock
- [Supabase](https://supabase.com) - Backend platform by Supabase Inc.
- [Vercel](https://vercel.com) - Hosting platform by Vercel Inc.

### Design Inspiration
- Cinematic UI/UX principles
- Scandinavian minimalism
- Japanese wabi-sabi aesthetics
- Modern wellness applications

---




## 🐛 Known Issues

- None currently! 🎉

---

## 🔮 Future Enhancements

- [ ] Spline 3D house integration
- [ ] AI-powered insights and suggestions
- [ ] Habit tracking with advanced streaks
- [ ] Social features (accountability partners)
- [ ] Export data (PDF, CSV)
- [ ] Light/dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Calendar integrations (Google Calendar)
- [ ] Meditation timer with guided sessions
- [ ] Mood tracking over time
- [ ] Custom room creation
- [ ] Widget support (iOS/Android)

---

## 📧 Contact

For questions, feedback, or collaboration:
- **Email**: shaurya.020singh@gmail.com
- **GitHub**: [@shauryasingh2093](https://github.com/shauryasingh2093)


---

## ⭐ Show Your Support

If you like this project, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔀 Contributing code

---

<div align="center">

**Built with ❤️ for intentional living and mindful productivity**

[🏡 Visit Bloomroom](https://bloomroomvercel.app) • [📖 Documentation](./PRODUCT_SUMMARY.md) • [🚀 Deploy](./DEPLOYMENT.md)

</div>
