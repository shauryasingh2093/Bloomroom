import { motion } from 'framer-motion';
import { useApp } from '../context/appContextCore';
import RoomWrapper from '../components/RoomWrapper';
import GoalList from '../components/rooms/GoalList';
import GrowthVisualizer from '../components/GrowthVisualizer';
import VisionBoard from '../components/future/VisionBoard';
import IntentionsList from '../components/future/IntentionsList';

const FutureRoom = ({ onBack }) => {
    const { goals, goalTarget } = useApp();
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 1.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <RoomWrapper
            title="Future Room"
            onBack={onBack}
            colorClass="bg-[#17466F]"
            lightText={true}
            roomId="future"
        >
            <motion.div
                className="max-w-6xl mx-auto px-4 sm:px-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.header className="mb-12 sm:mb-16 text-center" variants={itemVariants}>
                    <p className="text-cream-200/60 tracking-[0.4em] uppercase text-[10px] font-light mb-4">
                        Dreams & Direction
                    </p>
                    <h1 className="text-3xl sm:text-5xl font-extralight tracking-[0.3em] text-cream-50 uppercase">
                        Horizon
                    </h1>
                    <div className="mt-8 w-16 h-[1px] bg-white/20 mx-auto" />
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Column - Vision Board & Goals */}
                    <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
                        <div className="bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-[3rem] border border-white/20">
                            <h2 className="text-xl font-light text-cream-50 mb-8 text-center tracking-widest uppercase">
                                2026 Vision
                            </h2>
                            <VisionBoard lightText={true} />
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-[3rem] border border-white/20">
                            <GoalList lightText={true} />
                        </div>
                    </motion.div>

                    {/* Right Column - Intentions & Growth */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div
                            className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[3rem] border border-white/20"
                            variants={itemVariants}
                        >
                            <IntentionsList lightText={true} />
                        </motion.div>

                        <motion.div
                            className="relative group overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/10 backdrop-blur-md p-8 pt-16 h-[400px] flex flex-col justify-end"
                            variants={itemVariants}
                        >
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full text-center">
                                <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-light">Growth Pattern</span>
                            </div>
                            <GrowthVisualizer goals={goals} goalTarget={goalTarget} />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </RoomWrapper>
    );
};

export default FutureRoom;
