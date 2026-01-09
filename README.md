# Bloomroom - Cinematic House Experience

A soft, intentional space to plan, breathe, and grow. This is an interactive 3D house built with React and Spline, featuring a cinematic opening and room-by-room emotional journey.

---

## 🎬 Current Status

**Foundation Complete** ✅

The React app structure is ready and waiting for your Spline scene. Here's what's been built:

### ✅ Completed Components

1. **VideoOpening** - Fullscreen cinematic video with timed "Enter Bloomroom" button
2. **SplineScene** - 3D scene wrapper with event handling (placeholder active until you add your scene)
3. **RoomOverlay** - Room-specific UI overlay system
4. **PlanningRoomUI** - First room UI with task list, gentle animations, and quiet AI note
5. **Cinematic.css** - Film grain, floating particles, and cinematic effects

### 🔧 Tech Stack

- **Frontend**: React + Vite
- **3D**: Spline (@splinetool/react-spline)
- **Animations**: Framer Motion + GSAP
- **Styling**: Vanilla CSS with custom properties
- **State**: React Context API
- **Storage**: localStorage (via existing utilities)

---

## 🚀 Next Steps

### Step 1: Add Your Cinematic Video

1. Place your cinematic house video in the `/public` folder
2. Update the `videoSrc` path in `src/App.jsx` (line 13):
   ```javascript
   const videoSrc = '/your-video-filename.mp4';
   ```

### Step 2: Build Your Spline Scene

Follow the **spline_scene_guide.md** to build your 3D house in Spline:

- House exterior with pastel tones and soft edges
- Hallway connecting all rooms
- 5 rooms: Planning, Calm, Future, Care, Memory Corner
- Camera positions for each room
- Trigger zones for room entry

### Step 3: Export and Integrate Spline Scene

After building your scene in Spline:

1. **Publish to Spline Cloud** (easiest):
   - Click "Export" → "Publish to Spline"
   - Copy the public URL
   - Update `splineUrl` in `src/App.jsx` (line 16):
     ```javascript
     const splineUrl = 'https://prod.spline.design/your-scene-id/scene.splinecode';
     ```

2. **OR Export as .splinecode** (local):
   - Click "Export" → "Code Export"
   - Save `.splinecode` file to `/public/` folder
   - Update `splineUrl` in `src/App.jsx`:
     ```javascript
     const splineUrl = '/your-scene-filename.splinecode';
     ```

### Step 4: Connect Spline Events to React

Once your scene is loaded, you'll need to connect the room trigger events:

1. In Spline, add `Click` events to each room door trigger zone
2. Emit events with names like: `enterPlanningRoom`, `enterCalmRoom`, etc.
3. Update `SplineScene.jsx` to listen for these events (placeholder code is already there)

---

## 🏃 Running the App

The dev server should already be running. If not:

```bash
npm run dev
```

Visit: http://localhost:5173

---

## 📁 Project Structure

```
Bloomroom/
├── public/                    # Static assets (add your video here)
├── src/
│   ├── components/
│   │   ├── VideoOpening.jsx   # Cinematic video opening
│   │   ├── SplineScene.jsx    # 3D scene wrapper
│   │   ├── RoomOverlay.jsx    # Room UI container
│   │   └── rooms/
│   │       └── PlanningRoomUI.jsx  # Planning Room UI
│   ├── context/
│   │   └── AppContext.jsx     # Global state management
│   ├── utils/
│   │   ├── storage.js         # localStorage utilities
│   │   ├── dateHelpers.js     # Date formatting
│   │   └── encouragement.js   # Gentle messages
│   ├── styles/
│   │   └── Cinematic.css      # Cinematic effects
│   ├── archive/               # Old dashboard components (preserved)
│   ├── App.jsx                # Main orchestrator
│   ├── index.css              # Design system
│   └── main.jsx               # Entry point
└── package.json
```

---

## 🎨 Design System

The app uses a soft pastel color palette:

- **Blush**: `#FFF5F7` to `#D4A5B0` (pink/blush tones)
- **Cream**: `#FFFBF5` to `#E6D5C0` (warm neutrals)
- **Sage**: `#F5F8F6` to `#2D4A3E` (soft greens)

All colors are defined as CSS custom properties in `src/index.css`.

---

## 🧠 How It Works

### Flow

1. **Video Opening**: User sees fullscreen cinematic video → "Enter Bloomroom" button fades in after 4.5s
2. **Spline Scene**: User clicks button → video fades out → 3D house appears (currently showing placeholder)
3. **Room Entry**: User clicks room door in Spline → camera glides to room → room UI overlay fades in
4. **Room Exit**: User clicks "Back to Hallway" → camera glides back → overlay fades out

### State Management

- `showVideo`: Controls video opening visibility
- `currentRoom`: Tracks which room is active (null = hallway view)
- `AppContext`: Global state for tasks, goals, mind dumps, etc.

---

## 📝 Available Room UIs

### ✅ Planning Room (Complete)
- Task list with gentle animations
- Add/complete/delete tasks
- Quiet AI note: "One small thing is enough"
- Task persistence via localStorage

### 🚧 Other Rooms (Placeholders)
- Calm Room
- Future Room
- Care Room
- Memory Corner

These will be built after you complete the Spline scene and Planning Room is tested.

---

## 🎥 Cinematic Effects

The app includes subtle cinematic effects:

- **Film Grain**: Subtle animated grain overlay (3% opacity)
- **Floating Particles**: 20 particles with randomized animations
- **Depth of Field**: Blur utilities for tilt-shift effects (ready to use)
- **Warm Overlay**: Soft radial gradient for cozy lighting

All effects are in `src/styles/Cinematic.css` and can be adjusted.

---

## 🔗 Useful Links

- **Spline**: https://spline.design
- **Spline React Docs**: https://docs.spline.design/react
- **Framer Motion**: https://www.framer.com/motion
- **GSAP**: https://greensock.com/gsap

---

## ❓ Questions?

Refer to:
- `implementation_plan.md` - Full technical plan
- `spline_scene_guide.md` - Step-by-step Spline building guide
- `task.md` - Task breakdown and progress tracking

---

**Ready to build your Spline scene? Follow the guide and come back when you're ready to integrate!** 🏡✨
