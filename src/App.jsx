import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import SplineScene from './components/SplineScene';
import RoomOverlay from './components/RoomOverlay';
import VideoOpening from './components/VideoOpening';

function App() {
  const [showVideo, setShowVideo] = useState(true);
  const [currentRoom, setCurrentRoom] = useState(null);

  // Spline scene URL (update this after you build and export your Spline scene)
  const splineUrl = "https://prod.spline.design/your-spline-url-here/scene.splinecode"; // Placeholder

  const handleEnterBloomroom = () => {
    setShowVideo(false);
  };

  const handleRoomEnter = (roomName) => {
    setCurrentRoom(roomName);
  };

  const handleRoomExit = () => {
    setCurrentRoom(null);
  };

  return (
    <AppProvider>
      <div className="relative min-h-screen bg-cream-100 overflow-hidden font-sans">
        {/* Cinematic Layers */}
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="cinematic-grain" />
          <div className="warm-overlay" />
        </div>

        {showVideo && (
          <VideoOpening onEnter={handleEnterBloomroom} />
        )}

        {!showVideo && (
          <div className="animate-fade-in">
            <SplineScene
              onRoomEnter={handleRoomEnter}
              currentRoom={currentRoom}
              splineUrl={splineUrl}
            />
            <RoomOverlay
              room={currentRoom}
              onExit={handleRoomExit}
            />
          </div>
        )}
      </div>
    </AppProvider>
  );
}

export default App;
