import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import TaskList from '../components/tasks/TaskList';

const PlanningRoom = ({ onBack }) => {
    return (
        <RoomWrapper
            title="Planning Room"
            onBack={onBack}
            colorClass="bg-planning-dusk"
            lightText={true}
        >
            <div className="max-w-4xl mx-auto">
                <header className="mb-16 text-center">
                    <p className="text-cream-200/60 tracking-[0.3em] uppercase text-xs font-light mb-4">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="text-5xl font-extralight tracking-widest text-cream-50 uppercase">
                        Soft Focus
                    </h1>
                    <div className="mt-8 w-24 h-[1px] bg-white/20 mx-auto opacity-60" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <TaskList lightText={true} />
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <section className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                            <h4 className="text-xs tracking-[0.2em] uppercase font-light text-cream-200/40 mb-6">A Gentle Note</h4>
                            <p className="text-cream-100 font-light italic leading-relaxed">
                                "One small thing is enough. You don't have to carry the whole world today. Just this moment, just these intentions."
                            </p>
                            <p className="mt-4 text-xs tracking-widest text-cream-200/60 uppercase font-light">— Bloomroom AI</p>
                        </section>

                        <section className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10">
                            <h4 className="text-xs tracking-[0.2em] uppercase font-light text-cream-200/40 mb-6">Today's Wisdom</h4>
                            <p className="text-cream-100 font-light leading-relaxed">
                                Growth is not always upwards. Sometimes it's deep into the roots.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </RoomWrapper>
    );
};

export default PlanningRoom;
