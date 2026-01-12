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

import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';

import { useAuth } from './context/AuthContext';
import { createProfile, setActiveProfile } from './utils/profileManager';

const BloomroomContent = () => {
  const { user } = useAuth();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [appState, setAppState] = useState('intro'); // 'intro', 'main-hall'
  const [currentRoom, setCurrentRoom] = useState(null);
  const [transitionRoom, setTransitionRoom] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check for profile and migrate if needed
  useEffect(() => {
    migrateExistingData();
    const profile = getCurrentProfile();
    setCurrentProfile(profile);

    // If user is logged in but no profile (first time sync?), create one
    if (user && !profile) {
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      const newProfile = createProfile(name);
      setActiveProfile(newProfile.id);
      window.location.reload();
    }
  }, [user]);

  const handleProfileChange = (newProfile) => {
    setCurrentProfile(newProfile);
  };

  const handleEnterBloomroom = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
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

  const renderRoom = () => {
    if (transitionRoom) {
      return <VideoTransition roomId={transitionRoom} isActive={true} onComplete={handleTransitionComplete} />;
    }

    switch (currentRoom) {
      case 'planning':
        return <PlanningRoom onBack={handleExitRoom} />;
      case 'calm':
        return <CalmRoom onBack={handleExitRoom} />;
      case 'future':
        return <FutureRoom onBack={handleExitRoom} />;
      case 'care':
        return <CareRoom onBack={handleExitRoom} />;
      case 'memory':
        return <MemoryCorner onBack={handleExitRoom} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="background-layers">
        <div className="grain-overlay" />
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
          onOpenAuth={() => setShowAuthModal(true)}
        />
      )}

      {(currentRoom || transitionRoom) && renderRoom()}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onContinueAsGuest={() => {
          setShowAuthModal(false);
          setAppState('main-hall');
        }}
        onLoginSuccess={() => {
          setShowAuthModal(false);
          setAppState('main-hall');
        }}
      />
    </div>
  );
};

function App() {
  // We use a key based on currentProfile to force re-render of AppProvider when profile changes?
  // Actually ProfileSwitcher reloads the page, so we don't need complex key logic here.

  return (
    <AuthProvider>
      <AppProvider>
        <BloomroomContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

