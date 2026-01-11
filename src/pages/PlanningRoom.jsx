import { motion } from 'framer-motion';
import RoomWrapper from '../components/RoomWrapper';
import TaskList from '../components/tasks/TaskList';
import QuickNotes from '../components/rooms/QuickNotes';
import FocusTimer from '../components/planning/FocusTimer';

const PlanningRoom = ({ onBack }) => {
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
            title="Planning Room"
            onBack={onBack}
            colorClass="bg-planning-dusk"
            lightText={true}
        >
            <motion.div
                className="max-w-6xl mx-auto px-4 sm:px-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.header className="mb-12 sm:mb-16 text-center" variants={itemVariants}>
                    <p className="text-cream-200/60 tracking-[0.3em] uppercase text-xs font-light mb-4">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="text-3xl sm:text-5xl font-extralight tracking-widest text-cream-50 uppercase">
                        Soft Focus
                    </h1>
                    <div className="mt-8 w-24 h-[1px] bg-white/20 mx-auto opacity-60" />
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <motion.div className="lg:col-span-8" variants={itemVariants}>
                        <TaskList lightText={true} />
                    </motion.div>

                    <div className="lg:col-span-4 space-y-8">
                        <motion.div variants={itemVariants}>
                            <QuickNotes lightText={true} />
                        </motion.div>

                        <motion.div
                            className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-white/20"
                            variants={itemVariants}
                        >
                            <FocusTimer lightText={true} />
                        </motion.div>

                        <motion.section
                            className="p-6 sm:p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10"
                            variants={itemVariants}
                        >
                            <h4 className="text-xs tracking-[0.2em] uppercase font-light text-cream-200/40 mb-6">Today's Wisdom</h4>
                            <p className="text-cream-100 font-light leading-relaxed text-sm">
                                Growth is not always upwards. Sometimes it's deep into the roots.
                            </p>
                        </motion.section>
                    </div>
                </div>
            </motion.div>
        </RoomWrapper>
    );
};

export default PlanningRoom;
