import React from 'react';

interface RoyalGoldRibbonBannerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export default function RoyalGoldRibbonBanner({
  children,
  className = '',
  onClick,
  title,
}: RoyalGoldRibbonBannerProps) {
  // Rivet generator for default banner
  const renderRivets = () => {
    const dots = [];
    // Top rivets
    for (let x = 75; x <= 425; x += 16) {
      dots.push(
        <g key={`top-${x}`}>
          <circle cx={x} cy={13} r={2} fill="url(#rivetGoldGrad)" stroke="#784504" strokeWidth="0.3" />
          <circle cx={x - 0.5} cy={12.5} r={0.6} fill="#ffffff" opacity={0.9} />
        </g>
      );
    }
    // Bottom rivets
    for (let x = 75; x <= 425; x += 16) {
      dots.push(
        <g key={`bot-${x}`}>
          <circle cx={x} cy={97} r={2} fill="url(#rivetGoldGrad)" stroke="#784504" strokeWidth="0.3" />
          <circle cx={x - 0.5} cy={96.5} r={0.6} fill="#ffffff" opacity={0.9} />
        </g>
      );
    }
    // Left curve rivets
    const leftPts = [[58, 20], [45, 30], [33, 42], [22, 55], [33, 68], [45, 80], [58, 90]];
    leftPts.forEach(([cx, cy], i) => {
      dots.push(
        <g key={`left-${i}`}>
          <circle cx={cx} cy={cy} r={2} fill="url(#rivetGoldGrad)" stroke="#784504" strokeWidth="0.3" />
          <circle cx={cx - 0.5} cy={cy - 0.5} r={0.6} fill="#ffffff" opacity={0.9} />
        </g>
      );
    });
    // Right curve rivets
    const rightPts = [[442, 20], [455, 30], [467, 42], [478, 55], [467, 68], [455, 80], [442, 90]];
    rightPts.forEach(([cx, cy], i) => {
      dots.push(
        <g key={`right-${i}`}>
          <circle cx={cx} cy={cy} r={2} fill="url(#rivetGoldGrad)" stroke="#784504" strokeWidth="0.3" />
          <circle cx={cx - 0.5} cy={cy - 0.5} r={0.6} fill="#ffffff" opacity={0.9} />
        </g>
      );
    });
    return dots;
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center w-full mx-auto ${className || 'max-w-md sm:max-w-lg'}`}
      onClick={onClick}
      title={title}
    >
      {/* 3D Gold Riveted Pointed Plaque SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl"
        viewBox="0 0 500 110"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Outer Frame Bevel Gold */}
          <linearGradient id="frameGoldBanner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff8c4" />
            <stop offset="15%" stopColor="#f5ce53" />
            <stop offset="35%" stopColor="#dfa424" />
            <stop offset="55%" stopColor="#fde488" />
            <stop offset="80%" stopColor="#b4780e" />
            <stop offset="100%" stopColor="#734903" />
          </linearGradient>

          {/* Inner Plaque Warm Metallic Satin Gold */}
          <linearGradient id="plateGoldBanner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff6cc" />
            <stop offset="18%" stopColor="#fae188" />
            <stop offset="45%" stopColor="#f5cd5a" />
            <stop offset="70%" stopColor="#e8ad28" />
            <stop offset="90%" stopColor="#d49516" />
            <stop offset="100%" stopColor="#ba7d0b" />
          </linearGradient>

          {/* Radial Sheen */}
          <radialGradient id="plateRadialBanner" cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#fff4b8" stopOpacity="0.2" />
            <stop offset="85%" stopColor="#c28308" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#804d02" stopOpacity="0.35" />
          </radialGradient>

          {/* Rivet Gradient */}
          <radialGradient id="rivetGoldGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#ffec99" />
            <stop offset="65%" stopColor="#d99818" />
            <stop offset="100%" stopColor="#6e4202" />
          </radialGradient>
        </defs>

        {/* Outer Frame with Pointed Tips */}
        <path
          d="M 60,6 L 440,6 C 458,6 475,20 493,55 C 475,90 458,104 440,104 L 60,104 C 42,104 25,90 7,55 C 25,20 42,6 60,6 Z"
          fill="url(#frameGoldBanner)"
          stroke="#804f03"
          strokeWidth="1"
        />

        {/* Highlight Ridge */}
        <path
          d="M 61,8 L 439,8 C 456,8 472,21 489,55 C 472,89 456,102 439,102 L 61,102 C 44,102 28,89 11,55 C 28,21 44,8 61,8 Z"
          fill="none"
          stroke="#fff9d6"
          strokeWidth="0.9"
          opacity="0.85"
        />

        {/* Rivets */}
        {renderRivets()}

        {/* Inner Groove */}
        <path
          d="M 63,16 L 437,16 C 452,16 464,27 477,55 C 464,83 452,94 437,94 L 63,94 C 48,94 36,83 23,55 C 36,27 48,16 63,16 Z"
          fill="none"
          stroke="#804f03"
          strokeWidth="1.5"
        />

        {/* Center Satin Gold Plate */}
        <path
          d="M 64,18 L 436,18 C 450,18 461,28 474,55 C 461,82 450,92 436,92 L 64,92 C 50,92 39,82 26,55 C 39,28 50,18 64,18 Z"
          fill="url(#plateGoldBanner)"
        />

        {/* Center Radial Glow */}
        <path
          d="M 64,18 L 436,18 C 450,18 461,28 474,55 C 461,82 450,92 436,92 L 64,92 C 50,92 39,82 26,55 C 39,28 50,18 64,18 Z"
          fill="url(#plateRadialBanner)"
          stroke="#946107"
          strokeWidth="0.8"
        />
      </svg>

      {/* Content Container */}
      <div className="relative z-10 w-full pt-3 pb-4 sm:pt-3.5 sm:pb-5 px-10 sm:px-14 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
