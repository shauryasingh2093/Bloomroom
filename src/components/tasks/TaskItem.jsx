import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/appContextCore';
import { getContextualEncouragement } from '../../utils/encouragement';

const TaskItem = ({ task, lightText = false }) => {
    const { completeTask, uncompleteTask, postponeTask, skipTask, editTask } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';

    const handleComplete = () => {
        if (task.completed) {
            uncompleteTask(task.id);
        } else {
            completeTask(task.id);
            setMessage(getContextualEncouragement('complete'));
            setShowMessage(true);
            setIsAnimating(true);

            setTimeout(() => {
                setShowMessage(false);
                setIsAnimating(false);
            }, 2000);
        }
    };

    const handlePostpone = () => {
        setMessage(getContextualEncouragement('postpone'));
        setShowMessage(true);

        setTimeout(() => {
            postponeTask(task.id);
        }, 1500);
    };

    const handleSkip = () => {
        setMessage(getContextualEncouragement('skip'));
        setShowMessage(true);

        setTimeout(() => {
            skipTask(task.id);
        }, 1500);
    };

    const handleEdit = () => {
        if (isEditing && editText.trim() !== task.text) {
            editTask(task.id, editText.trim());
        }
        setIsEditing(!isEditing);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleEdit();
        } else if (e.key === 'Escape') {
            setEditText(task.text);
            setIsEditing(false);
        }
    };

    const getPriorityColor = () => {
        switch (task.priority) {
            case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
            default: return 'bg-white/10 text-white/60 border-white/20';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`group relative p-6 rounded-2xl transition-all duration-700 ${task.completed ? 'bg-white/5 opacity-60' : 'bg-white/10 hover:bg-white/15'} border border-white/20 backdrop-blur-md ${isAnimating ? 'scale-[1.02] shadow-xl ring-2 ring-white/10' : ''}`}
        >
            <div className="flex items-center gap-6">
                <button
                    onClick={handleComplete}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${task.completed ? 'bg-white border-white' : 'border-white/30 hover:border-white/60'}`}
                >
                    {task.completed && (
                        <svg className={`w-4 h-4 ${lightText ? 'text-slate-800' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>

                <div className="flex-1">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onBlur={handleEdit}
                            onKeyDown={handleKeyDown}
                            className={`w-full bg-transparent border-none outline-none font-light text-lg ${lightText ? 'text-white' : 'text-slate-800'}`}
                            autoFocus
                        />
                    ) : (
                        <span
                            className={`text-lg font-light tracking-wide transition-all duration-700 ${task.completed ? 'text-white/40 line-through' : textColor}`}
                            onDoubleClick={() => !task.completed && setIsEditing(true)}
                        >
                            {task.text}
                        </span>
                    )}
                </div>

                {!task.completed && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <button
                            className={`px-3 py-1 text-[10px] tracking-widest uppercase font-light border rounded-full transition-colors ${lightText ? 'text-white/60 border-white/20 hover:text-white hover:border-white/40' : 'text-slate-400 border-slate-200 hover:text-slate-600'}`}
                            onClick={handlePostpone}
                        >
                            Later
                        </button>
                        <button
                            className={`px-3 py-1 text-[10px] tracking-widest uppercase font-light border rounded-full transition-colors ${lightText ? 'text-white/60 border-white/20 hover:text-white hover:border-white/40' : 'text-slate-400 border-slate-200 hover:text-slate-600'}`}
                            onClick={handleSkip}
                        >
                            Skip
                        </button>
                    </div>
                )}
            </div>

            {showMessage && (
                <motion.div
                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -10, x: '-50%' }}
                    className="absolute -top-8 left-1/2 whitespace-nowrap px-4 py-2 rounded-full bg-sage-600 text-white text-xs tracking-widest uppercase font-light shadow-lg"
                >
                    {message}
                </motion.div>
            )}
        </motion.div>
    );
};

export default TaskItem;
