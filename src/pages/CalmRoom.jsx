import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import MindDump from '../components/rooms/MindDump';
import BreathingSphere from '../components/rooms/BreathingSphere';

const CalmRoom = ({ onBack }) => {
    return (
        <RoomWrapper
            title="Calm Room"
            onBack={onBack}
            colorClass="bg-calm-dusk"
            lightText={true}
        >
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                <header className="mb-20 text-center">
                    <h1 className="text-5xl font-extralight tracking-[0.4em] text-cream-50 uppercase">
                        Quiet
                    </h1>
                    <p className="mt-6 text-cream-200/60 font-light tracking-widest italic">
                        Leave the noise at the door.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center w-full">
                    <section className="flex flex-col items-center">
                        <BreathingSphere />
                    </section>

                    <section className="w-full">
                        <MindDump lightText={true} />
                    </section>
                </div>
            </div>
        </RoomWrapper>
    );
};

export default CalmRoom;
