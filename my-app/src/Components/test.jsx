import React from 'react';

export default function BackgroundCurves() {
    return (
        <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#043873' }}>
            {/* Curved Lines Background */}
            <img
                src="../images/Element.png"
                alt="Curved Lines Background"
                className="absolute top-0 left-0 w-full h-auto opacity-50 pointer-events-none z-0"
            />
            <div className="relative z-10">
                {/* Any content here will stay above the background image */}
            </div>
        </div>

    );
}
