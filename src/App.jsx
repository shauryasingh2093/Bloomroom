import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import ProfileSelector from './components/ProfileSelector';
import { getCurrentProfile, migrateExistingData } from './utils/profileManager';
import VideoOpening from './components/VideoOpening';
import MainHall from './pages/MainHall';
import PlanningRoom from './pages/PlanningRoom';
import CalmRoom from './pages/CalmRoom';
import FutureRoom from './pages/FutureRoom';
import CareRoom from './pages/CareRoom';
import MemoryCorner from './pages/MemoryCorner';
import VideoTransition from './components/VideoTransition';

function App() {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [appState, setAppState] = useState('intro'); // 'intro', 'main-hall'
  const [currentRoom, setCurrentRoom] = useState(null); // 'planning', 'calm', 'future', 'care', 'memory', null
  const [transitionRoom, setTransitionRoom] = useState(null);

  // Check for profile and migrate if needed
  useEffect(() => {
    migrateExistingData();
    const profile = getCurrentProfile();
    setCurrentProfile(profile);
  }, []);

  const handleProfileChange = (newProfile) => {
    setCurrentProfile(newProfile);
  };

  const handleEnterBloomroom = () => {
    setAppState('main-hall');
  };

  const handleEnterRoom = (room) => {
    setTransitionRoom(room);
  };

  const handleExitRoom = () => {
    setCurrentRoom(null);
  };

  const handleTransitionComplete = () => {
    setCurrentRoom(transitionRoom);
    setTransitionRoom(null);
  };

  // Render logic for different rooms
  const renderRoom = () => {
    if (transitionRoom) {
      return (
        <VideoTransition
          roomId={transitionRoom}
          isActive={true}
          onComplete={handleTransitionComplete}
        />
      );
    }

    switch (currentRoom) {
      case 'planning': return <PlanningRoom onBack={handleExitRoom} />;
      case 'calm': return <CalmRoom onBack={handleExitRoom} />;
      case 'future': return <FutureRoom onBack={handleExitRoom} />;
      case 'care': return <CareRoom onBack={handleExitRoom} />;
      case 'memory': return <MemoryCorner onBack={handleExitRoom} />;
      default: return <MainHall onEnterRoom={handleEnterRoom} />;
    }
  };

  return (
    <AppProvider>
      {!currentProfile ? (
        <ProfileSelector onProfileSelected={(profile) => setCurrentProfile(profile)} />
      ) : (
        <div className="fixed inset-0 w-screen h-screen bg-cream-100 overflow-hidden font-sans">
          {/* Cinematic Layers */}
          <div className="fixed inset-0 pointer-events-none z-[2000]">
            <div className="cinematic-grain" />
            <div className="warm-overlay" />
          </div>

          {appState === 'intro' && (
            <VideoOpening onEnter={handleEnterBloomroom} />
          )}

          {appState === 'main-hall' && !currentRoom && !transitionRoom && (
            <MainHall
              onEnterRoom={handleEnterRoom}
              currentProfile={currentProfile}
              onProfileChange={handleProfileChange}
            />
          )}

          {(currentRoom || transitionRoom) && (
            renderRoomContent()
          )}
        </div>
      )}
    </AppProvider>
  );
}

export default App;

