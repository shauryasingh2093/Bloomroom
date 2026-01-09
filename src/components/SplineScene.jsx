import { useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

export default function SplineScene({ onRoomEnter, currentRoom, splineUrl }) {

    const splineRef = useRef(null);

    useEffect(() => {
        if (!splineRef.current) return;

        // Listen for events from Spline scene
        const spline = splineRef.current;

        // Set up event listeners for room triggers
        const handleSplineEvent = (event) => {
            // Events will be emitted from Spline trigger zones
            // Format: enterPlanningRoom, enterCalmRoom, etc.
            if (event.type?.startsWith('enter')) {
                const roomName = event.type.replace('enter', '').toLowerCase();
                onRoomEnter(roomName);
            }
        };

        // Note: Actual event listener setup will depend on Spline scene structure
        // This is a placeholder for when the scene is ready

    }, [onRoomEnter]);

    const handleLoad = (spline) => {
        splineRef.current = spline;
        console.log('Spline scene loaded successfully');
    };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden">
            {splineUrl ? (
                <Spline
                    scene={splineUrl}
                    onLoad={handleLoad}
                    className="w-full h-full"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blush-50 via-cream-100 to-sage-50">
                    <div className="text-center max-w-2xl p-8 bg-white/80 rounded-3xl shadow-lg backdrop-blur-sm">
                        <h2 className="text-4xl font-light text-sage-900 mb-4">Spline Scene Placeholder</h2>
                        <p className="text-lg text-sage-700 leading-relaxed">
                            Your 3D house will appear here once you've built and exported it from Spline.
                        </p>
                        <p className="mt-6 pt-6 border-t border-sage-200 text-base text-sage-600">
                            Follow the <strong className="text-sage-800">spline_scene_guide.md</strong> to build your scene.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
