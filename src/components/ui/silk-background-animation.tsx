'use client';

import React, { useEffect, useRef, useState } from 'react';

type SilkProps = { showCopy?: boolean; mode?: 'full' | 'lite' }

export const Component = ({ showCopy = true, mode = 'full' }: SilkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const speed = mode === 'lite' ? 0.015 : 0.02;
    const scale = mode === 'lite' ? 1.5 : 2;
    const noiseIntensity = mode === 'lite' ? 0.6 : 0.8;
    const pixelStep = mode === 'lite' ? 4 : 2;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple noise function
    const noise = (x: number, y: number) => {
      const G = 2.71828;
      const rx = G * Math.sin(G * x);
      const ry = G * Math.sin(G * y);
      return (rx * ry * (1 + x)) % 1;
    };

    let last = 0;
    const targetFps = mode === 'lite' ? 30 : 60;
    const minFrameMs = 1000 / targetFps;

    const animate = (now?: number) => {
      if (mode === 'lite' && now != null) {
        if (now - last < minFrameMs) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }
        last = now;
      }
      const { width, height } = canvas;
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#1a1a1a');
      gradient.addColorStop(0.5, '#2a2a2a');
      gradient.addColorStop(1, '#1a1a1a');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Create silk-like pattern
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let x = 0; x < width; x += pixelStep) {
        for (let y = 0; y < height; y += pixelStep) {
          const u = (x / width) * scale;
          const v = (y / height) * scale;
          
          const tOffset = speed * time;
          let tex_x = u;
          let tex_y = v + 0.03 * Math.sin(8.0 * tex_x - tOffset);

          const pattern = 0.6 + 0.4 * Math.sin(
            5.0 * (tex_x + tex_y + 
              Math.cos(3.0 * tex_x + 5.0 * tex_y) + 
              0.02 * tOffset) +
            Math.sin(20.0 * (tex_x + tex_y - 0.1 * tOffset))
          );

          const rnd = noise(x, y);
          const intensity = Math.max(0, pattern - rnd / 15.0 * noiseIntensity);
          
          // Purple-gray silk color
          const r = Math.floor(123 * intensity);
          const g = Math.floor(116 * intensity);
          const b = Math.floor(129 * intensity);
          const a = 255;

          const index = (y * width + x) * 4;
          if (index < data.length) {
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Add subtle overlay for depth
      const overlayGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
      overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
      overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, width, height);

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUpDelay {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInCorner {
          from {
            opacity: 0;
            transform: translateY(-1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-fade-in-up-delay {
          animation: fadeInUpDelay 1s ease-out 0.3s forwards;
        }
        
        .animate-fade-in-corner {
          animation: fadeInCorner 1s ease-out 0.9s forwards;
        }
        
        .silk-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
      `}</style>
      
      <div className="relative h-screen w-full overflow-hidden bg-black">
        {/* Animated Silk Background */}
        <canvas 
          ref={canvasRef}
          className="silk-canvas"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

        {/* Loading copy */}
        {showCopy && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none px-6">
            <h1 className={`opacity-0 ${isLoaded ? 'animate-fade-in-up' : ''} text-[56px] sm:text-[88px] md:text-[124px] leading-tight font-black tracking-[-0.02em] text-white text-center break-words`}>
              Coach
            </h1>
            <div className={`opacity-0 ${isLoaded ? 'animate-fade-in-up-delay' : ''} mt-4 text-xs sm:text-sm md:text-base text-white/90 uppercase tracking-[0.28em] text-center`}
            >
              <span className="mx-1">Fit</span>
              <span className="mx-2">•</span>
              <span className="mx-1">Aura</span>
              <span className="mx-2">•</span>
              <span className="mx-1">Technic</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};



