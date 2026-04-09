'use client';

import React, { useEffect, useRef } from 'react';

const LiquidGlass: React.FC = () => {
  const feImageRef = useRef<SVGFEImageElement>(null);

  useEffect(() => {
    // Load the displacement map
    fetch("https://essykings.github.io/JavaScript/map.png")
      .then((response) => response.blob())
      .then((blob) => {
        const objURL = URL.createObjectURL(blob);
        if (feImageRef.current) {
          feImageRef.current.setAttribute("href", objURL);
        }
      })
      .catch(err => console.error("Failed to load displacement map:", err));
  }, []);

  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
      <filter
        id="glass"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        primitiveUnits="objectBoundingBox"
      >
        <feImage
          ref={feImageRef}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          result="map"
        />
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
        <feDisplacementMap
          id="disp"
          in="blur"
          in2="map"
          scale="0.8"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
};

export default LiquidGlass;
