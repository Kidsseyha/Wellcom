import React from 'react';

interface IntertwinedRibbonHeartsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function IntertwinedRibbonHearts({
  className = '',
  size = 'lg',
}: IntertwinedRibbonHeartsProps) {
  const sizeMap = {
    sm: 'w-56 sm:w-64 h-auto',
    md: 'w-72 sm:w-88 h-auto',
    lg: 'w-80 sm:w-96 md:w-[460px] h-auto',
    xl: 'w-full max-w-2xl h-auto',
  };

  const containerClass = className || sizeMap[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${containerClass} my-2 select-none pointer-events-none drop-shadow-[0_10px_30px_rgba(217,4,41,0.35)]`}>
      <svg
        viewBox="0 0 960 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
      >
        <defs>
          {/* Glossy 3D Red Gradients */}
          <linearGradient id="glossyRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3844" />
            <stop offset="25%" stopColor="#e6001a" />
            <stop offset="65%" stopColor="#a60017" />
            <stop offset="90%" stopColor="#66000c" />
            <stop offset="100%" stopColor="#330005" />
          </linearGradient>

          <linearGradient id="redHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff8a94" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#ff4754" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#9e0015" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4a0009" stopOpacity="0.9" />
          </linearGradient>

          {/* Deep Shadow */}
          <filter id="heartShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#70000d" floodOpacity="0.45" />
          </filter>
        </defs>

        <g filter="url(#heartShadow)">
          {/* ================= HEART 1 (TOP-LEFT) ================= */}
          {/* Outer / Base 3D Contour */}
          <path
            d="M 380 90 
               C 380 90, 460 30, 540 90 
               C 635 160, 630 300, 540 380 
               C 470 440, 380 430, 310 380 
               C 210 310, 195 160, 290 90 
               C 330 60, 380 90, 380 90 Z"
            fill="none"
            stroke="url(#glossyRed)"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Hollow for Heart Frame effect */}
          <path
            d="M 380 115 
               C 380 115, 450 55, 520 115 
               C 600 175, 600 280, 520 350 
               C 455 410, 375 400, 310 350 
               C 230 280, 230 175, 310 115 
               C 340 92, 380 115, 380 115 Z"
            fill="#17120e"
          />
          {/* Specular Gleam / Highlight on Left-Top Heart */}
          <path
            d="M 295 105 
               C 255 140, 245 220, 295 280"
            fill="none"
            stroke="url(#redHighlight)"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.9"
          />


          {/* ================= HEART 2 (BOTTOM-RIGHT) ================= */}
          {/* Outer / Base 3D Contour */}
          <path
            d="M 610 200 
               C 610 200, 690 140, 770 200 
               C 865 270, 860 410, 770 490 
               C 700 550, 610 540, 540 490 
               C 440 420, 425 270, 520 200 
               C 560 170, 610 200, 610 200 Z"
            fill="none"
            stroke="url(#glossyRed)"
            strokeWidth="50"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Hollow for Heart Frame effect */}
          <path
            d="M 610 225 
               C 610 225, 680 165, 750 225 
               C 830 285, 830 390, 750 460 
               C 685 520, 605 510, 540 460 
               C 460 390, 460 285, 540 225 
               C 570 202, 610 225, 610 225 Z"
            fill="#17120e"
          />
          {/* Specular Gleam / Highlight on Bottom-Right Heart */}
          <path
            d="M 525 215 
               C 485 250, 475 330, 525 390"
            fill="none"
            stroke="url(#redHighlight)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
}
