import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/appContextCore';
import Button from '../Button';
import Input from '../Input';

const GoalList = ({ lightText = false }) => {
    const { goals, addGoal, deleteGoal, toggleGoal } = useApp();
    const [newGoal, setNewGoal] = useState({ title: '', description: '' });
    const [showForm, setShowForm] = useState(false);

    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';
    const subTextColor = lightText ? 'text-cream-200/60' : 'text-slate-500';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newGoal.title.trim()) {
            addGoal(newGoal);
            setNewGoal({ title: '', description: '' });
            setShowForm(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <h3 className={`text-sm tracking-[0.3em] uppercase font-light ${subTextColor}`}>2026 Goals</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`text-xs tracking-widest uppercase font-light ${lightText ? 'text-cream-200 hover:text-white' : 'text-blue-500 hover:text-blue-700'} transition-colors`}
                >
                    {showForm ? 'Close' : '+ Add Goal'}
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-12"
                    >
                        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 space-y-4">
                            <Input
                                value={newGoal.title}
                                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                placeholder="What's a dream you're nurturing?"
                                className={`!bg-white/10 border-white/20 ${lightText ? 'text-white placeholder:text-white/30' : 'text-slate-800'}`}
                            />
                            <textarea
                                value={newGoal.description}
                                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                placeholder="Tell yourself more about it..."
                                className={`w-full bg-white/10 border border-white/20 rounded-2xl p-4 font-light focus:ring-2 focus:ring-white/10 outline-none h-24 ${lightText ? 'text-white placeholder:text-white/30' : 'text-slate-700'}`}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" variant="primary" className={lightText ? '!bg-white/20 !text-white' : '!bg-slate-800'}>Plant Seed</Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div layout className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {goals.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="py-20 text-center opacity-40"
                        >
                            <p className={`font-light italic ${lightText ? 'text-cream-100' : 'text-slate-500'}`}>No goals planted yet. Plant a seed to start your 2026 journey.</p>
                        </motion.div>
                    ) : (
                        goals.map((goal) => (
                            <motion.div
                                key={goal.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 group hover:bg-white/15 transition-all duration-500 shadow-sm hover:shadow-md ${goal.completed ? 'opacity-60' : ''}`}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <button
                                        onClick={() => toggleGoal(goal.id)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${goal.completed ? 'bg-white/40 border-white/20' : 'border-white/20 hover:border-white/40'}`}
                                    >
                                        {goal.completed && (
                                            <motion.svg
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-3 h-3 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </motion.svg>
                                        )}
                                    </button>
                                    <div className="flex-1">
                                        <h4 className={`text-xl font-light ${textColor} tracking-wide mb-2 ${goal.completed ? 'line-through opacity-50' : ''}`}>{goal.title}</h4>
                                        <p className={`${subTextColor} font-light leading-relaxed ${goal.completed ? 'opacity-50' : ''}`}>{goal.description}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteGoal(goal.id)}
                                        className={`opacity-0 group-hover:opacity-100 p-2 transition-all ${lightText ? 'text-white/40 hover:text-white' : 'text-slate-300 hover:text-red-400'}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mt-6 flex gap-4">
                                    <div className={`h-1 flex-1 ${lightText ? 'bg-white/10' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                                        <div className={`h-full ${goal.completed ? 'bg-white/60 w-full' : 'bg-white/30 w-1/3'} transition-all duration-1000 rounded-full`} />
                                    </div>
                                    <span className={`text-[10px] tracking-widest uppercase ${lightText ? 'text-white/30' : 'text-slate-400'}`}>
                                        {goal.completed ? 'Achieved & Rooted' : 'Growing slowly'}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default GoalList;
