'use client';

import React from 'react';

const ArcticLights: React.FC = () => {
  return (
    <div className="fixed inset-0 min-h-screen w-full -z-50 overflow-hidden bg-[#030712]">
      {/* Base Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
        style={{ backgroundImage: "url('/bg-1.jpg')" }}
      />

      {/* Arctic Light Blobs - Layered on top for depth */}
      <div
        className="arctic-light w-[50vw] h-[50vw] bg-indigo-500/10 top-[-10%] left-[-10%]"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="arctic-light w-[40vw] h-[40vw] bg-cyan-500/15 top-[15%] right-[-5%]"
        style={{ animationDelay: '-5s', animationDuration: '22s' }}
      />
      <div
        className="arctic-light w-[60vw] h-[60vw] bg-blue-600/10 bottom-[-20%] left-[25%]"
        style={{ animationDelay: '-12s', animationDuration: '28s' }}
      />

      {/* Overlay: Animated Grain/Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 contrast-125 brightness-110 mix-blend-overlay pointer-events-none" />

      {/* Ambient Gradient to smooth edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
    </div>
  );
};

export default ArcticLights;
