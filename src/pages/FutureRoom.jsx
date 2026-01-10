import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import GoalList from '../components/rooms/GoalList';

const FutureRoom = ({ onBack }) => {
    return (
        <RoomWrapper
            title="Future Room"
            onBack={onBack}
            colorClass="bg-future-dusk"
            lightText={true}
        >
            <div className="max-w-4xl mx-auto">
                <header className="mb-20 text-center">
                    <p className="text-cream-200/60 tracking-[0.4em] uppercase text-[10px] font-light mb-4">
                        Planting Seeds for Someday
                    </p>
                    <h1 className="text-5xl font-extralight tracking-[0.3em] text-cream-50 uppercase">
                        Horizon
                    </h1>
                    <div className="mt-8 w-16 h-[1px] bg-white/20 mx-auto opacity-40" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        <GoalList lightText={true} />
                    </div>

                    <div className="lg:col-span-4 space-y-12">
                        <section className="p-8 rounded-[2.2rem] bg-white/10 backdrop-blur-md border border-white/20">
                            <h4 className="text-[10px] tracking-[0.2em] uppercase font-light text-cream-200/40 mb-6">Future Self</h4>
                            <p className="text-cream-100 font-light italic leading-relaxed text-sm">
                                "In six months, what will you be glad you started today?"
                            </p>
                        </section>

                        <div className="relative group overflow-hidden rounded-[2.2rem] border border-white/10">
                            <img
                                src="/paintings/Default.png"
                                alt="Vision"
                                className="w-full h-64 object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3s]"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <span className="text-white/80 text-[10px] tracking-[0.4em] uppercase font-light">Vision Board</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RoomWrapper>
    );
};

export default FutureRoom;
