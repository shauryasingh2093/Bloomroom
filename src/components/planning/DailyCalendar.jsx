import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/appContextCore';

const DailyCalendar = ({ lightText = true }) => {
    const { tasks, selectedDate, setSelectedDate } = useApp();
    const [calendarMonth, setCalendarMonth] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getTasksForDate = (date) => {
        const dateStr = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
        return tasks.filter(task => task.date && task.date.split('T')[0] === dateStr);
    };

    const handleDateClick = (date) => {
        const dateStr = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).toISOString();
        setSelectedDate(dateStr);
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(calendarMonth);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const previousMonth = () => {
        setCalendarMonth(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCalendarMonth(new Date(year, month + 1, 1));
    };

    const today = new Date().toDateString();
    const selectedDateObj = new Date(selectedDate);
    const textColor = lightText ? 'text-cream-50' : 'text-slate-800';

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={previousMonth}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className={`text-sm font-light ${textColor} tracking-wider`}>
                    {monthNames[month]} {year}
                </h3>
                <button
                    onClick={nextMonth}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-[10px] text-white/40 uppercase tracking-wider font-light">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(year, month, day);
                    const isToday = date.toDateString() === today;
                    const isSelected = date.toDateString() === selectedDateObj.toDateString();
                    const tasksForDay = getTasksForDate(date);
                    const completedTasks = tasksForDay.filter(t => t.completed).length;
                    const hasActivity = tasksForDay.length > 0;
                    const allCompleted = hasActivity && completedTasks === tasksForDay.length;

                    return (
                        <motion.div
                            key={day}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleDateClick(date)}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all cursor-pointer ${allCompleted
                                    ? 'bg-green-500/30 text-white font-medium ring-1 ring-green-400/50'
                                    : isSelected
                                        ? 'bg-white/30 text-white font-medium ring-2 ring-white/60'
                                        : isToday
                                            ? 'bg-white/20 text-white font-medium ring-1 ring-white/40'
                                            : hasActivity
                                                ? 'bg-white/10 text-white/90'
                                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            <span>{day}</span>
                            {hasActivity && (
                                <div className="flex gap-0.5 mt-1">
                                    {tasksForDay.slice(0, 3).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1 h-1 rounded-full ${idx < completedTasks ? 'bg-green-400' : 'bg-white/40'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-white/40">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Done</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/40" />
                    <span>Pending</span>
                </div>
            </div>
        </div>
    );
};

export default DailyCalendar;
