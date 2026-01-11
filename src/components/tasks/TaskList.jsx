import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/appContextCore';
import TaskItem from './TaskItem';
import Input from '../Input';
import Button from '../Button';
import './Tasks.css';

const TaskList = ({ lightText = false }) => {
    const { getTodaysTasks, addTask, getTodaysCompletedCount } = useApp();
    const [newTask, setNewTask] = useState('');

    const todaysTasks = getTodaysTasks();
    const completedCount = getTodaysCompletedCount();
    const totalCount = todaysTasks.length;

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';
    const subTextColor = lightText ? 'text-cream-200/60' : 'text-slate-500';

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            addTask(newTask.trim());
            setNewTask('');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-12 text-center">
                <h3 className={`text-3xl font-extralight tracking-widest ${textColor} uppercase mb-4`}>Today's Intentions</h3>
                {totalCount > 0 && (
                    <span className={`text-sm tracking-widest ${subTextColor} uppercase`}>
                        {completedCount} of {totalCount} bloomed
                    </span>
                )}
            </div>

            <form onSubmit={handleAddTask} className="mb-12 flex gap-4">
                <Input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What's one small thing you want to do today?"
                    className={`flex-1 !bg-white/10 backdrop-blur-md border-white/20 focus:border-white/40 ${lightText ? 'text-white placeholder:text-white/30' : 'text-slate-800'}`}
                />
                <Button type="submit" variant={lightText ? 'primary' : 'blush'} disabled={!newTask.trim()} className={lightText ? '!bg-white/20 !text-white' : ''}>
                    Add
                </Button>
            </form>

            <motion.div layout className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {todaysTasks.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="py-20 text-center opacity-60"
                        >
                            <div className="text-4xl mb-4">🌸</div>
                            <p className={`${subTextColor} font-light tracking-wide italic`}>No intentions yet. What would make today feel okay?</p>
                        </motion.div>
                    ) : (
                        todaysTasks.map((task) => (
                            <TaskItem key={task.id} task={task} lightText={lightText} />
                        ))
                    )}
                </AnimatePresence>
            </motion.div>

            {completedCount > 0 && completedCount === totalCount && (
                <div className={`mt-12 p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center animate-bloom`}>
                    <span className="text-2xl mb-4 block">✨</span>
                    <p className={`${lightText ? 'text-cream-100' : 'text-slate-700'} font-light tracking-wide`}>You did it! All tasks complete.</p>
                    <p className={`${subTextColor} text-sm mt-2 font-light italic`}>You showed up today 🌸</p>
                </div>
            )}
        </div>
    );
};

export default TaskList;
