import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../context/AppContext';
import { getContextualEncouragement } from '../../utils/encouragement';

export default function PlanningRoomUI() {

    const { tasks, addTask, completeTask, deleteTask } = useContext(AppContext);
    const [newTaskText, setNewTaskText] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);

    const todaysTasks = tasks.filter(task => !task.completed);
    const completedToday = tasks.filter(task => task.completed).length;

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            addTask(newTaskText.trim());
            setNewTaskText('');
        }
    };

    const handleCompleteTask = (taskId) => {
        completeTask(taskId);
        if (todaysTasks.length === 1) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <motion.div
                className="bg-white/95 rounded-3xl p-10 shadow-2xl backdrop-blur-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
            >
                {/* Quiet AI Note */}
                <motion.p
                    className="text-center text-lg font-normal italic text-sage-600 mb-8 opacity-80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                >
                    One small thing is enough.
                </motion.p>

                {/* Task List */}
                <div className="min-h-[200px] mb-6">
                    {todaysTasks.length === 0 && !showCelebration ? (
                        <div className="text-center py-12 text-sage-500 text-base">
                            <p>No tasks yet. What would you like to focus on today?</p>
                        </div>
                    ) : showCelebration ? (
                        <motion.div
                            className="text-center py-12 text-xl text-blush-600 font-medium"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <p>{getContextualEncouragement('complete')}</p>
                        </motion.div>
                    ) : (
                        <ul className="list-none p-0 m-0">
                            {todaysTasks.map((task, index) => (
                                <motion.li
                                    key={task.id}
                                    className="flex items-center gap-4 p-4 mb-3 bg-cream-50 border border-sage-100 rounded-2xl transition-all duration-300 hover:bg-cream-100 hover:shadow-sm"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <button
                                        className="flex-shrink-0 w-6 h-6 border-2 border-sage-300 rounded-full bg-transparent cursor-pointer flex items-center justify-center p-0 transition-all duration-300 hover:border-sage-500 hover:bg-sage-50 group"
                                        onClick={() => handleCompleteTask(task.id)}
                                        aria-label="Complete task"
                                    >
                                        <span className="block w-3 h-3 rounded-full bg-transparent transition-all duration-300 group-hover:bg-sage-300"></span>
                                    </button>
                                    <span className="flex-1 text-base text-sage-900 leading-normal">{task.text}</span>
                                    <button
                                        className="flex-shrink-0 w-7 h-7 border-none bg-transparent text-sage-400 text-2xl leading-none cursor-pointer rounded-full flex items-center justify-center p-0 transition-all duration-300 hover:bg-blush-100 hover:text-blush-600"
                                        onClick={() => deleteTask(task.id)}
                                        aria-label="Delete task"
                                    >
                                        ×
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Add Task Form */}
                <form className="flex gap-3 mb-4 flex-col sm:flex-row" onSubmit={handleAddTask}>
                    <input
                        type="text"
                        className="flex-1 px-5 py-3.5 text-base text-sage-900 bg-cream-50 border border-sage-200 rounded-full font-sans transition-all duration-300 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100 placeholder:text-sage-400"
                        placeholder="Add a task..."
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        maxLength={100}
                    />
                    <button
                        type="submit"
                        className="px-8 py-3.5 text-base font-medium text-cream-50 bg-sage-600 rounded-full cursor-pointer font-sans transition-all duration-300 hover:bg-sage-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newTaskText.trim()}
                    >
                        Add
                    </button>
                </form>

                {/* Progress Indicator */}
                {completedToday > 0 && (
                    <motion.p
                        className="text-center text-sm text-sage-500 opacity-70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {completedToday} completed today
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}
