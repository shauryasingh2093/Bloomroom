import { motion, AnimatePresence } from 'framer-motion';
import PlanningRoomUI from './rooms/PlanningRoomUI';

export default function RoomOverlay({ room, onExit }) {

    const renderRoomUI = () => {
        switch (room) {
            case 'planningroom':
                return <PlanningRoomUI />;
            case 'calmroom':
                return <div className="p-12 bg-white/95 rounded-3xl shadow-2xl backdrop-blur-md text-center text-2xl text-sage-700 font-light">Calm Room UI (Coming Soon)</div>;
            case 'futureroom':
                return <div className="p-12 bg-white/95 rounded-3xl shadow-2xl backdrop-blur-md text-center text-2xl text-sage-700 font-light">Future Room UI (Coming Soon)</div>;
            case 'careroom':
                return <div className="p-12 bg-white/95 rounded-3xl shadow-2xl backdrop-blur-md text-center text-2xl text-sage-700 font-light">Care Room UI (Coming Soon)</div>;
            case 'memorycorner':
                return <div className="p-12 bg-white/95 rounded-3xl shadow-2xl backdrop-blur-md text-center text-2xl text-sage-700 font-light">Memory Corner UI (Coming Soon)</div>;

            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {room && (
                <motion.div
                    className="fixed inset-0 w-screen h-screen pointer-events-none z-[100]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    <motion.button
                        className="absolute top-8 left-8 px-6 py-3 text-base font-medium text-sage-800 bg-white/90 border border-sage-200 rounded-full cursor-pointer pointer-events-auto backdrop-blur-sm shadow-md transition-all duration-300 hover:bg-white hover:shadow-lg"
                        onClick={onExit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        whileHover={{ x: -5 }}
                    >
                        ← Back to Hallway
                    </motion.button>

                    <motion.div
                        className="w-full h-full flex items-center justify-center p-8 pointer-events-none [&>*]:pointer-events-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                    >
                        {renderRoomUI()}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
