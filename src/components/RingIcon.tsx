import React from 'react';

export default function RingIcon({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Left Wedding Ring */}
      <circle cx="8.5" cy="13.5" r="5" />
      {/* Right Wedding Ring */}
      <circle cx="15.5" cy="13.5" r="5" />
      {/* Diamond Sparkle Gem */}
      <path d="M12 3.5l1.5 2.5L12 8.5l-1.5-2.5z" fill="currentColor" opacity="0.9" />
      <path d="M12 2.5v1" />
      <path d="M10 4h4" />
    </svg>
  );
}
