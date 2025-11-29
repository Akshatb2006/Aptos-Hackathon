import React, { useState, useEffect, useRef } from 'react';

const VantaWavesBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effect = null;

    const initVanta = async () => {
      try {
        const THREE = await import('three');
        if (!window.THREE) window.THREE = THREE;
        
        const { default: NET } = await import('vanta/dist/vanta.net.min');
        
        effect = NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x2121e3,
          backgroundColor: 0x0a0a0a,
          points: 14,
          maxDistance: 15,
          spacing: 16,
          showDots: true,
          scaleDots: 1.5
        });
        
        setVantaEffect(effect);
      } catch (error) {
        console.error('Failed to load Vanta WAVES:', error);
      }
    };

    if (typeof window !== 'undefined') {
      initVanta();
    }

    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, []);

  return <div ref={vantaRef} className="fixed inset-0 z-0" />;
};

export default VantaWavesBackground;
