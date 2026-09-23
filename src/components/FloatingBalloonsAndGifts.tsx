import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface BirthdayItem {
  id: number;
  type: 'balloon' | 'confetti' | 'ribbon' | 'streamer' | 'gift';
  color: string;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
}

export default function FloatingBalloonsAndGifts() {
  const items: BirthdayItem[] = useMemo(() => {
    const list: BirthdayItem[] = [];
    const colors = ['#f43f5e', '#3b82f6', '#eab308', '#a855f7', '#10b981', '#ec4899', '#06b6d4', '#f97316'];
    const types: ('balloon' | 'confetti' | 'ribbon' | 'streamer' | 'gift')[] = ['balloon', 'confetti', 'ribbon', 'streamer', 'gift'];

    // 16 festive birthday items (Balloons, Confetti, Ribbons, Streamers, Gifts)
    for (let i = 0; i < 16; i++) {
      list.push({
        id: i,
        type: types[i % types.length],
        color: colors[i % colors.length],
        startX: (i * 6) + Math.random() * 4,
        startY: 5 + Math.random() * 90,
        size: 24 + (i % 4) * 10,
        duration: 8 + (i % 5) * 3,
        delay: (i * 0.4),
        sway: 25 + (i % 4) * 12,
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
            y: [-20, -160, -20],
            x: [-item.sway, item.sway, -item.sway],
            rotate: [0, 360, 0],
            scale: item.type === 'confetti' ? [0.8, 1.2, 0.8] : [1, 1.05, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          {item.type === 'balloon' && (
            <svg
              width={item.size * 1.1}
              height={item.size * 1.5}
              viewBox="0 0 50 70"
              className="drop-shadow-lg filter"
            >
              <ellipse cx="25" cy="22" rx="20" ry="22" fill={item.color} opacity="0.95" />
              <path d="M 23,44 L 27,44 L 26,48 L 24,48 Z" fill={item.color} />
              <path d="M 25,48 Q 22,58 28,68" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
            </svg>
          )}

          {item.type === 'confetti' && (
            <div
              className="rounded-xs shadow-md opacity-90"
              style={{
                width: item.size * 0.6,
                height: item.size * 0.4,
                backgroundColor: item.color,
                transform: 'rotate(45deg)',
              }}
            />
          )}

          {item.type === 'ribbon' && (
            <div
              className="rounded-full shadow-md border border-white/55 flex items-center justify-center font-bold text-[8px] text-white"
              style={{
                width: item.size * 0.9,
                height: item.size * 0.35,
                backgroundColor: item.color,
                transform: 'skewX(-20deg)',
              }}
            >
              🎀
            </div>
          )}

          {item.type === 'streamer' && (
            <svg
              width={item.size}
              height={item.size * 1.4}
              viewBox="0 0 30 50"
              className="drop-shadow"
            >
              <path
                d="M 15,0 Q 30,12 15,25 Q 0,38 15,50"
                stroke={item.color}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          )}

          {item.type === 'gift' && (
            <div
              className="flex flex-col items-center justify-center rounded-lg shadow-xl border border-white/50 p-1 relative"
              style={{
                width: item.size,
                height: item.size,
                backgroundColor: item.color,
              }}
            >
              <div className="w-full h-2 bg-white/90 rounded-xs mb-1 shadow-xs" />
              <div className="w-2 h-full bg-white/90 absolute rounded-xs shadow-xs" />
              <div className="text-white text-xs z-10 font-bold">🎁</div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
