import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import GratitudeJournal from '../components/rooms/GratitudeJournal';
import JournalWithImages from '../components/memory/JournalWithImages';
import { useApp } from '../context/appContextCore';

const MemoryCorner = ({ onBack }) => {
    const { documentation, mindDumps } = useApp();

    return (
        <RoomWrapper
            title="Memory Corner"
            onBack={onBack}
            colorClass="bg-[#CAA188]"
            lightText={true}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <header className="mb-12 sm:mb-20 text-center">
                    <p className="text-cream-200/60 tracking-[0.4em] uppercase text-[10px] font-light mb-4">
                        A Collection of Moments
                    </p>
                    <h1 className="text-3xl sm:text-5xl font-extralight tracking-[0.3em] text-cream-50 uppercase">
                        Echoes
                    </h1>
                    <div className="mt-8 w-16 h-[1px] bg-white/20 mx-auto" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Column: Gratitude Journal & Journal with Images */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-white/20 sticky top-8">
                            <GratitudeJournal lightText={true} />
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-white/20">
                            <JournalWithImages lightText={true} />
                        </div>
                    </div>

                    {/* Memories Feed - Right Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {documentation.length === 0 && mindDumps.length === 0 ? (
                            <div className="py-20 sm:py-40 text-center opacity-40">
                                <p className="text-cream-50 font-light italic text-sm sm:text-base">
                                    No memories captured yet. Your reflections will bloom here in time.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Combined Feed of Memories */}
                                {[...documentation, ...mindDumps]
                                    .filter(memory => !memory.prompt?.startsWith('Grateful for:'))
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .map((memory) => (
                                        <div
                                            key={memory.id}
                                            className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-white/20 hover:bg-white/15 transition-all duration-500 shadow-sm"
                                        >
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-[10px] tracking-[0.3em] uppercase font-light text-cream-200/80">
                                                    {new Date(memory.createdAt).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span className="text-[10px] tracking-widest text-cream-200/40 uppercase">
                                                    {memory.prompt ? '📔 Reflection' : '💭 Mind Dump'}
                                                </span>
                                            </div>
                                            <p className="text-cream-100 font-light leading-relaxed mb-6 text-sm sm:text-base">
                                                {memory.prompt || memory.content}
                                            </p>
                                            {memory.aiResponse && (
                                                <div className="pt-6 border-t border-white/10">
                                                    <p className="text-[11px] text-cream-200/60 italic font-light leading-relaxed">
                                                        "{memory.aiResponse.reassurance}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RoomWrapper>
    );
};

export default MemoryCorner;
