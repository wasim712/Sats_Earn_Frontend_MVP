'use client';

import React, { useEffect, useRef } from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const WormHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    const logW = 120;
    const logH = 44;

    // Set canvas sizes for high-DPI
    canvas.width = logW * DPR;
    canvas.height = logH * DPR;
    canvas.style.width = `${logW}px`;
    canvas.style.height = `${logH}px`;
    ctx.scale(DPR, DPR);

    const cfg = { bodySegs: 5, segSize: 20 };
    const SS = cfg.segSize;
    const STEP = SS * 0.72;
    const total = cfg.bodySegs + 1;
    const startX = (logW - (total - 1) * STEP) / 2;
    
    const segs: { x: number; y: number }[] = [];
    for (let i = 0; i < total; i++) {
      segs.push({ x: startX + i * STEP, y: logH / 2 });
    }

    const drawRoundRec = (x: number, y: number, w: number, h: number, r: number) => {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    };

    let animationId: number;

    const draw = (ts: number) => {
      ctx.clearRect(0, 0, logW, logH);

      // Wave physics using ts
      segs.forEach((s, i) => {
        const wave = ((total - 1 - i) / (total - 1)) * SS * 0.28;
        s.y = logH / 2 + Math.sin(ts * 0.0022 + i * 0.95) * wave;
      });

      // Draw body segments
      for (let i = 0; i < cfg.bodySegs; i++) {
        const s = segs[i];
        const t = i / Math.max(1, cfg.bodySegs - 1);
        const rv = Math.floor(105 + t * 142);
        const gv = Math.floor(38 + t * 82);
        const al = 0.32 + t * 0.68;

        ctx.fillStyle = `rgba(${rv}, ${gv}, 0, ${al})`;
        ctx.shadowColor = 'rgba(247, 147, 26, 0.18)';
        ctx.shadowBlur = 3;

        drawRoundRec(s.x - SS / 2 + 1, s.y - SS / 2 + 1, SS - 2, SS - 2, SS * 0.36);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Draw head glow
      const hd = segs[total - 1];
      try {
        const grd = ctx.createRadialGradient(hd.x, hd.y, 0, hd.x, hd.y, SS * 1.1);
        grd.addColorStop(0, 'rgba(247, 147, 26, 0.38)');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(hd.x - SS * 1.1, hd.y - SS * 1.1, SS * 2.2, SS * 2.2);
      } catch (e) {
        // gradient fail-safe
      }

      // Draw head base
      try {
        const hg = ctx.createRadialGradient(hd.x - SS * 0.18, hd.y - SS * 0.18, SS * 0.05, hd.x, hd.y, SS * 0.52);
        hg.addColorStop(0, '#ffc04a');
        hg.addColorStop(1, '#f7931a');
        ctx.fillStyle = hg;
      } catch (e) {
        ctx.fillStyle = '#f7931a';
      }

      ctx.shadowColor = '#f7931a';
      ctx.shadowBlur = SS * 0.7;
      drawRoundRec(hd.x - SS / 2 + 1, hd.y - SS / 2 + 1, SS - 2, SS - 2, SS * 0.38);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw head highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(hd.x - SS * 0.14, hd.y - SS * 0.2, SS * 0.18, Math.PI, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();

      // Draw eyes
      const ew = Math.max(1.1, SS * 0.12);
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(hd.x + SS * 0.16, hd.y - SS * 0.22, ew, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hd.x + SS * 0.16, hd.y + SS * 0.22, ew, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <header className="py-16 sm:py-24 text-center max-w-4xl mx-auto px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[radial-gradient(circle,rgba(249,115,22,0.06),transparent_70%)] pointer-events-none -z-10"></div>

      <FadeUp delay={0.1}>
        <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-5">
          SatsEarn Mini-Game
        </div>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 select-none">
          <canvas 
            ref={canvasRef} 
            className="flex-shrink-0 drop-shadow-[0_0_15px_rgba(247,147,26,0.35)]"
          />
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-widest text-white uppercase font-mono">
            SAT WORM
          </h1>
        </div>
      </FadeUp>

      <FadeUp delay={0.3}>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
          A fast, snake-style arcade game built for SatsEarn. <strong className="text-white">Eat the bolts, dodge the hazards, and grow as long as you can</strong> — the deeper you go, the more it fights back.
        </p>
      </FadeUp>

      <FadeUp delay={0.4}>
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-gray-300 bg-sats-black-900 border border-sats-orange-500/15 rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse inline-block"></span>
            Live
          </span>
          <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-gray-300 bg-sats-black-900 border border-sats-orange-500/15 rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sats-orange-500 inline-block"></span>
            Snake / Arcade
          </span>
          <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-gray-300 bg-sats-black-900 border border-sats-orange-500/15 rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sats-orange-500 inline-block"></span>
            24×24 Grid
          </span>
          <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-gray-300 bg-sats-black-900 border border-sats-orange-500/15 rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sats-orange-500 inline-block"></span>
            Keyboard · Touch · D-pad
          </span>
        </div>
      </FadeUp>
    </header>
  );
};
