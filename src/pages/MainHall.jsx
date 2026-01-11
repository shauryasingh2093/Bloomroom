import React from 'react';

const MainHall = ({ onEnterRoom }) => {
    const rooms = [
        { id: 'planning', name: 'Planning Room', label: 'Plan', pos: 'col-start-1 row-start-2' },
        { id: 'calm', name: 'Calm Room', label: 'Breathe', pos: 'col-start-2 row-start-2' },
        { id: 'future', name: 'Future Room', label: 'Grow', pos: 'col-start-3 row-start-2' },
        { id: 'care', name: 'Care Room', label: 'Care', pos: 'col-start-1 row-start-3' },
        { id: 'memory', name: 'Memory Corner', label: 'Reflect', pos: 'col-start-3 row-start-3' },
    ];

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden">
            {/* Background Image */}
            <img
                src="/Entered.png"
                alt="Bloomroom Main Hall"
                className="absolute inset-0 w-full h-full object-cover animate-fade-in"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none">
                <div className="text-center animate-slide-up px-6">
                    <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.3em] text-cream-50 uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                        Hey kashu! Welcome Home💜
                    </h2>
                    <p className="text-cream-100 font-light mt-8 tracking-[0.2em] italic opacity-90 text-sm md:text-base drop-shadow-md max-w-2xl mx-auto">
                        Choose a room to begin your journey
                    </p>
                </div>
            </div>

            {/* Clickable Hotspots */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-12 p-24 pointer-events-auto">
                {rooms.map((room) => (
                    <button
                        key={room.id}
                        onClick={() => onEnterRoom(room.id)}
                        className={`${room.pos} flex flex-col items-center justify-center group relative overflow-hidden transition-all duration-700`}
                    >
                        <div className="absolute inset-0 bg-cream-50/0 group-hover:bg-cream-50/5 backdrop-blur-0 group-hover:backdrop-blur-[2px] rounded-full transition-all duration-700 scale-50 group-hover:scale-100" />

                        <span className="relative z-10 text-cream-50 font-extralight tracking-[0.4em] uppercase text-xs opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                            {room.label}
                        </span>

                        <div className="mt-4 w-1 h-1 bg-cream-50 rounded-full opacity-40 group-hover:scale-[8] group-hover:opacity-10 transition-all duration-1000" />

                        {/* Room specific tooltips could go here */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 transition-opacity duration-1000 whitespace-nowrap">
                            <span className="text-[10px] text-cream-200 uppercase tracking-widest">{room.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MainHall;
