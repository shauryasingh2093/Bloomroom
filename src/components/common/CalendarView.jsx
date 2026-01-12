import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const CalendarView = ({ selectedDate, onDateSelect, journalEntries = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const hasEntry = (date) => {
        return journalEntries.some(entry => isSameDay(new Date(entry.date), date));
    };

    return (
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors text-cream-100">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-xl font-light tracking-widest text-cream-50 uppercase">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors text-cream-100">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-4">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-[10px] uppercase tracking-widest text-cream-200/40">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => (
                    <motion.button
                        key={day.toString()}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDateSelect(day)}
                        className={`
                            relative h-10 w-10 flex items-center justify-center rounded-full text-sm font-light transition-all
                            ${!isSameMonth(day, monthStart) ? 'text-white/10' : ''}
                            ${isSameDay(day, selectedDate)
                                ? 'bg-cream-100 text-planning-dusk shadow-md'
                                : isSameMonth(day, monthStart) ? 'text-cream-100 hover:bg-white/10' : ''}
                            ${isToday(day) && !isSameDay(day, selectedDate) ? 'border border-cream-100/30' : ''}
                        `}
                    >
                        <span>{format(day, dateFormat)}</span>

                        {/* Entry Indicator */}
                        {hasEntry(day) && (
                            <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSameDay(day, selectedDate) ? 'bg-planning-dusk' : 'bg-cream-100'}`} />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default CalendarView;
