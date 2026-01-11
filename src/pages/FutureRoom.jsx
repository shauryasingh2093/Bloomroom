import { motion } from 'framer-motion';
import { useApp } from '../context/appContextCore';
import RoomWrapper from '../components/RoomWrapper';
import GoalList from '../components/rooms/GoalList';
import GrowthVisualizer from '../components/GrowthVisualizer';

const FutureRoom = ({ onBack }) => {
    const { goals } = useApp();
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
            colorClass="bg-future-dusk"
            lightText={true}
        >
            <motion.div
                className="max-w-4xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.header className="mb-20 text-center" variants={itemVariants}>
                    <p className="text-cream-200/60 tracking-[0.4em] uppercase text-[10px] font-light mb-4">
                        Planting Seeds for Someday
                    </p>
                    <h1 className="text-5xl font-extralight tracking-[0.3em] text-cream-50 uppercase">
                        Horizon
                    </h1>
                    <div className="mt-8 w-16 h-[1px] bg-white/20 mx-auto opacity-40" />
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <motion.div className="lg:col-span-8" variants={itemVariants}>
                        <GoalList lightText={true} />
                    </motion.div>

                    <div className="lg:col-span-4 space-y-12">
                        <motion.section
                            className="p-8 rounded-[2.2rem] bg-white/10 backdrop-blur-md border border-white/20"
                            variants={itemVariants}
                        >
                            <h4 className="text-[10px] tracking-[0.2em] uppercase font-light text-cream-200/40 mb-6">Future Self</h4>
                            <p className="text-cream-100 font-light italic leading-relaxed text-sm">
                                "In six months, what will you be glad you started today?"
                            </p>
                        </motion.section>

                        <motion.div
                            className="relative group overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-8"
                            variants={itemVariants}
                        >
                            <GrowthVisualizer goals={goals} />
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                                <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-light">Growth Pattern</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </RoomWrapper>
    );
};

export default FutureRoom;
