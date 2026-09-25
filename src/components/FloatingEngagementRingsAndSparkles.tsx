import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import RingIcon from './RingIcon';

interface EngagementItem {
  id: number;
  type: 'ring' | 'sparkle' | 'confetti-gold' | 'confetti-diamond' | 'confetti-rose';
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  rotationSpeed: number;
}

export default function FloatingEngagementRingsAndSparkles() {
  const items: EngagementItem[] = useMemo(() => {
    const list: EngagementItem[] = [];
    const types: ('ring' | 'sparkle' | 'confetti-gold' | 'confetti-diamond' | 'confetti-rose')[] = [
      'ring',
      'sparkle',
      'confetti-gold',
      'ring',
      'sparkle',
      'confetti-diamond',
      'confetti-rose',
      'ring',
      'sparkle',
      'confetti-gold',
      'sparkle',
      'confetti-diamond',
      'ring',
      'confetti-gold',
      'sparkle',
      'confetti-rose',
    ];

    for (let i = 0; i < 18; i++) {
      list.push({
        id: i,
        type: types[i % types.length],
        startX: (i * 5.5) + (Math.random() * 3),
        startY: 8 + (Math.random() * 84),
        size: types[i % types.length] === 'ring' ? 28 + (i % 3) * 8 : types[i % types.length] === 'sparkle' ? 20 + (i % 4) * 6 : 14 + (i % 3) * 6,
        duration: 7 + (i % 6) * 2.5,
        delay: i * 0.35,
        sway: 20 + (i % 5) * 10,
        rotationSpeed: 180 + (i % 3) * 90,
      });
    }
    return list;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.startX}%`,
            top: `${item.startY}%`,
          }}
          animate={{
            y: [-15, -120, -15],
            x: [-item.sway, item.sway, -item.sway],
            rotate: [0, item.rotationSpeed, 0],
            scale: item.type === 'sparkle' ? [0.8, 1.25, 0.8] : [0.9, 1.1, 0.9],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          {item.type === 'ring' && (
            <div className="relative filter drop-shadow-[0_4px_12px_rgba(245,184,15,0.6)]">
              <RingIcon className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 fill-amber-400" />
              {/* Diamond Glow Aura */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-200 blur-[2px] animate-pulse" />
            </div>
          )}

          {item.type === 'sparkle' && (
            <div className="relative flex items-center justify-center filter drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
              <Sparkles
                style={{ width: `${item.size}px`, height: `${item.size}px` }}
                className="text-amber-300 fill-amber-200"
              />
            </div>
          )}

          {item.type === 'confetti-gold' && (
            <div
              className="rounded-xs shadow-lg opacity-90 border border-amber-200/60"
              style={{
                width: `${item.size * 0.8}px`,
                height: `${item.size * 0.45}px`,
                background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
                transform: 'rotate(25deg)',
              }}
            />
          )}

          {item.type === 'confetti-diamond' && (
            <div
              className="rounded-xs shadow-md opacity-85 border border-white/80"
              style={{
                width: `${item.size * 0.6}px`,
                height: `${item.size * 0.6}px`,
                background: 'linear-gradient(135deg, #ffffff 0%, #bae6fd 50%, #38bdf8 100%)',
                transform: 'rotate(45deg)',
              }}
            />
          )}

          {item.type === 'confetti-rose' && (
            <div
              className="rounded-full shadow-md opacity-80 border border-rose-200"
              style={{
                width: `${item.size * 0.5}px`,
                height: `${item.size * 0.5}px`,
                background: 'radial-gradient(circle, #f43f5e 0%, #be123c 100%)',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
