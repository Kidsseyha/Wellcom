import React, { useState } from 'react';
import { motion } from 'motion/react';

// Ornate Khmer Royal Corner Flourish
export function KhmerCornerKbach({
  position = 'top-left',
  className = 'w-12 h-12',
  color = '#f5b80f',
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  color?: string;
}) {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
      default:
        return 'none';
    }
  };

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]`}
      style={{ transform: getTransform() }}
    >
      <defs>
        <linearGradient id={`kbach-gold-grad-${position}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff2a8" />
          <stop offset="35%" stopColor="#f5b80f" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>
      {/* Outer corner frame lines */}
      <path
        d="M2 62 V 12 C 2 6.477 6.477 2 12 2 H 62"
        stroke={`url(#kbach-gold-grad-${position})`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M6 62 V 14 C 6 9.582 9.582 6 14 6 H 62"
        stroke={`url(#kbach-gold-grad-${position})`}
        strokeWidth="1"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      {/* Ornate corner floral curl (Kbach Phni Tes) */}
      <path
        d="M12 12 C 18 12 24 16 26 22 C 28 28 24 34 18 34 C 14 34 10 30 11 25 C 12 20 17 18 20 20"
        stroke={`url(#kbach-gold-grad-${position})`}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 6 C 22 8 32 14 38 24 C 42 30 40 38 34 40 C 29 42 22 36 24 30 C 26 24 32 23 35 26"
        stroke={`url(#kbach-gold-grad-${position})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* Corner Gem / Flower Core */}
      <circle cx="9" cy="9" r="3" fill={`url(#kbach-gold-grad-${position})`} />
      <circle cx="8" cy="8" r="1" fill="#ffffff" opacity="0.9" />
      {/* Accent bead */}
      <circle cx="2" cy="18" r="1.5" fill="#f5b80f" />
      <circle cx="18" cy="2" r="1.5" fill="#f5b80f" />
    </svg>
  );
}

// Interlocking Monogram Crest with Laurel Wreath
export function RoyalWeddingMonogram({
  groomInitial = 'D',
  brideInitial = 'B',
  groomName = 'Groom',
  brideName = 'Bride',
  className = 'w-24 h-24',
}: {
  groomInitial?: string;
  brideInitial?: string;
  groomName?: string;
  brideName?: string;
  className?: string;
}) {
  const gInit = (groomInitial || groomName || 'G').charAt(0).toUpperCase();
  const bInit = (brideInitial || brideName || 'B').charAt(0).toUpperCase();

  return (
    <div className={`relative flex items-center justify-center ${className} select-none`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_14px_rgba(245,184,15,0.45)]"
      >
        <defs>
          <linearGradient id="monogramGold" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="25%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="75%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="monogramRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>
          <radialGradient id="monogramGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx="60" cy="60" r="45" fill="url(#monogramGlow)" />

        {/* Outer Laurel Leaf Wreath Left */}
        <path
          d="M32 92 C 18 78 16 46 30 28 C 34 22 40 18 46 16"
          stroke="url(#monogramGold)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Leaves Left */}
        <path d="M22 80 C 17 76 15 70 20 68 C 24 70 24 76 22 80 Z" fill="url(#monogramGold)" />
        <path d="M18 64 C 13 60 12 53 18 51 C 21 53 21 59 18 64 Z" fill="url(#monogramGold)" />
        <path d="M20 48 C 16 44 16 37 22 36 C 25 38 24 44 20 48 Z" fill="url(#monogramGold)" />
        <path d="M28 34 C 25 29 27 23 33 24 C 35 27 33 32 28 34 Z" fill="url(#monogramGold)" />
        <path d="M38 23 C 36 18 40 13 46 15 C 47 18 43 23 38 23 Z" fill="url(#monogramGold)" />

        {/* Outer Laurel Leaf Wreath Right */}
        <path
          d="M88 92 C 102 78 104 46 90 28 C 86 22 80 18 74 16"
          stroke="url(#monogramGold)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Leaves Right */}
        <path d="M98 80 C 103 76 105 70 100 68 C 96 70 96 76 98 80 Z" fill="url(#monogramGold)" />
        <path d="M102 64 C 107 60 108 53 102 51 C 99 53 99 59 102 64 Z" fill="url(#monogramGold)" />
        <path d="M100 48 C 104 44 104 37 98 36 C 95 38 96 44 100 48 Z" fill="url(#monogramGold)" />
        <path d="M92 34 C 95 29 93 23 87 24 C 85 27 87 32 92 34 Z" fill="url(#monogramGold)" />
        <path d="M82 23 C 84 18 80 13 74 15 C 73 18 77 23 82 23 Z" fill="url(#monogramGold)" />

        {/* Crown / Lotus Tiara at the apex */}
        <path
          d="M50 14 L 54 8 L 60 12 L 66 8 L 70 14 Z"
          fill="url(#monogramGold)"
          stroke="#78350f"
          strokeWidth="0.5"
        />
        <circle cx="60" cy="6" r="1.8" fill="#ffffff" stroke="url(#monogramGold)" strokeWidth="0.8" />
        <circle cx="54" cy="7" r="1.2" fill="url(#monogramGold)" />
        <circle cx="66" cy="7" r="1.2" fill="url(#monogramGold)" />

        {/* Inner Dual Beveled Geometric Rings */}
        <circle cx="60" cy="60" r="36" stroke="url(#monogramRing)" strokeWidth="1.6" strokeDasharray="3 2" />
        <circle cx="60" cy="60" r="32" stroke="url(#monogramRing)" strokeWidth="0.8" opacity="0.7" />

        {/* Bottom Ribbon Knot */}
        <path
          d="M52 95 C 55 93 65 93 68 95 C 72 98 75 106 72 108 C 67 105 63 99 60 97 C 57 99 53 105 48 108 C 45 106 48 98 52 95 Z"
          fill="url(#monogramGold)"
          stroke="#78350f"
          strokeWidth="0.4"
        />
        <circle cx="60" cy="96" r="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.6" />
      </svg>

      {/* Typography Initials in the center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center justify-center gap-0.5 text-amber-900 font-serif font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          <span
            style={{
              fontFamily: 'Norican, cursive',
              fontSize: '28px',
              color: '#92400e',
              textShadow: '0 1px 0 rgba(255,255,255,0.7), 0 0 8px rgba(245,184,15,0.5)',
            }}
            className="transform -translate-x-1 -translate-y-1"
          >
            {gInit}
          </span>
          <span
            style={{
              fontFamily: 'serif',
              fontSize: '15px',
              color: '#d97706',
              fontStyle: 'italic',
            }}
            className="opacity-90 transform -translate-y-0.5"
          >
            &
          </span>
          <span
            style={{
              fontFamily: 'Norican, cursive',
              fontSize: '28px',
              color: '#92400e',
              textShadow: '0 1px 0 rgba(255,255,255,0.7), 0 0 8px rgba(245,184,15,0.5)',
            }}
            className="transform translate-x-1 translate-y-1"
          >
            {bInit}
          </span>
        </div>
      </div>
    </div>
  );
}

// Traditional Khmer Floral Divider (Kbach Pkachan)
export function KhmerDividerKbach({
  className = 'w-48 sm:w-64 h-6',
  color = '#f5b80f',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`flex items-center justify-center my-4 ${className} mx-auto select-none pointer-events-none`}>
      <svg viewBox="0 0 300 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <defs>
          <linearGradient id="dividerGold" x1="0" y1="12" x2="300" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f5b80f" stopOpacity="0" />
            <stop offset="25%" stopColor="#f5b80f" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="75%" stopColor="#f5b80f" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f5b80f" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Left hairline */}
        <line x1="10" y1="12" x2="115" y2="12" stroke="url(#dividerGold)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="118" cy="12" r="1.5" fill="#f5b80f" />
        <circle cx="125" cy="12" r="2.5" fill="#fef08a" stroke="#b45309" strokeWidth="0.5" />

        {/* Center Lotus Flower Crest */}
        <g transform="translate(150, 12)">
          {/* Petals */}
          <path d="M 0 -8 C 3 -4 5 -1 0 5 C -5 -1 -3 -4 0 -8 Z" fill="#fef08a" stroke="#b45309" strokeWidth="0.6" />
          <path d="M -7 -4 C -5 -2 -1 1 -5 5 C -9 3 -8 -1 -7 -4 Z" fill="#f5b80f" stroke="#b45309" strokeWidth="0.5" />
          <path d="M 7 -4 C 5 -2 1 1 5 5 C 9 3 8 -1 7 -4 Z" fill="#f5b80f" stroke="#b45309" strokeWidth="0.5" />
          <circle cx="0" cy="1" r="2" fill="#fff" />
        </g>

        {/* Right hairline */}
        <circle cx="175" cy="12" r="2.5" fill="#fef08a" stroke="#b45309" strokeWidth="0.5" />
        <circle cx="182" cy="12" r="1.5" fill="#f5b80f" />
        <line x1="185" y1="12" x2="290" y2="12" stroke="url(#dividerGold)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// 3D Realistic Royal Wax Seal Button Ornament
export function RoyalWaxSealEmblem({
  className = 'w-16 h-16',
}: {
  className?: string;
}) {
  return (
    <div className={`relative ${className} select-none shrink-0 drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]`}>
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <radialGradient id="waxBase" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
          <radialGradient id="waxInner" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="40%" stopColor="#d97706" />
            <stop offset="90%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>
        </defs>

        {/* Irregular melted wax edges */}
        <path
          d="M40 4 C 48 3 55 6 63 11 C 70 17 76 24 77 33 C 78 42 75 51 70 59 C 64 67 56 74 46 76 C 36 78 26 75 18 69 C 10 63 5 54 4 44 C 3 34 7 24 14 16 C 21 8 30 5 40 4 Z"
          fill="url(#waxBase)"
          stroke="#78350f"
          strokeWidth="1"
        />

        {/* Inner seal circle */}
        <circle cx="40" cy="40" r="26" fill="url(#waxInner)" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.7" />
        <circle cx="40" cy="40" r="23" stroke="#92400e" strokeWidth="1.2" strokeDasharray="3 2" />

        {/* Embossed Double Wedding Rings / Knot in center */}
        <circle cx="34" cy="41" r="9" stroke="#fef3c7" strokeWidth="2.2" strokeOpacity="0.9" />
        <circle cx="46" cy="41" r="9" stroke="#fef3c7" strokeWidth="2.2" strokeOpacity="0.9" />
        {/* Diamond on top */}
        <path d="M40 28 L43 32 L40 36 L37 32 Z" fill="#ffffff" />
        <circle cx="40" cy="27" r="1.5" fill="#fef08a" />
      </svg>
    </div>
  );
}

// Extract Khmer initial character from person name
// Specifically cleans honorific titles and extracts the NEXT letter (អក្សរបន្ទាប់ = given name letter)
export function getKhmerInitial(name: string, fallback: string = 'ម'): string {
  if (!name || !name.trim()) return fallback;
  // Clean honorific prefixes
  const cleaned = name
    .trim()
    .replace(/^(លោក|អ្នកស្រី|កញ្ញា|លោកជំទាវ|ឯកឧត្តម|កូនកំលោះ|កូនក្រមុំ|Mr\.?|Mrs\.?|Ms\.?)\s+/i, '');
  const words = cleaned.trim().split(/\s+/).filter(Boolean);
  
  // In Khmer naming convention, word 1 is surname (e.g. "រ៉ូ" in "រ៉ូ ម៉ាឡេ").
  // The next word (given name, e.g. "ម៉ាឡេ") is what is traditionally used for wedding monogram initials ("ទាញយកអក្សរបន្ទាប់មកប្រើ"):
  const targetWord = words.length > 1 ? words[words.length - 1] : (words[0] || '');
  
  // Extract primary Khmer consonant (\u1780 - \u17A2)
  const match = targetWord.match(/[\u1780-\u17A2]/);
  return match ? match[0] : (targetWord.charAt(0) || fallback);
}

// Cameo Floral Wedding Emblem (Authentic replica of user reference image)
export function CameoFloralWeddingEmblem({
  groomInitialKh = 'ម',
  brideInitialKh = 'វ',
  color = '#6c2925',
  className = 'w-36 h-44 sm:w-40 sm:h-48',
}: {
  groomInitialKh?: string;
  brideInitialKh?: string;
  color?: string;
  className?: string;
}) {
  const gLetter = groomInitialKh || 'ម';
  const bLetter = brideInitialKh || 'វ';
  const themeColor = color || '#6c2925';

  return (
    <div className={`relative flex items-center justify-center ${className} select-none mx-auto`}>
      <svg
        viewBox="0 0 170 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
      >
        <defs>
          <linearGradient id="cameoBorderGrad" x1="20" y1="20" x2="150" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={themeColor} stopOpacity="0.85" />
            <stop offset="50%" stopColor={themeColor} />
            <stop offset="100%" stopColor={themeColor} stopOpacity="0.95" />
          </linearGradient>
          <clipPath id="innerMedallionClip">
            <circle cx="85" cy="105" r="41" />
          </clipPath>
        </defs>

        {/* Ornate Baroque / Rococo Cameo Outer Scrolls */}
        {/* Top Flourishes */}
        <path
          d="M85 24 C 77 12 60 14 62 26 C 64 36 78 35 85 46 C 92 35 106 36 108 26 C 110 14 93 12 85 24 Z"
          fill="none"
          stroke="url(#cameoBorderGrad)"
          strokeWidth="2"
        />
        <circle cx="85" cy="16" r="3" fill={themeColor} />
        <circle cx="75" cy="20" r="1.8" fill={themeColor} />
        <circle cx="95" cy="20" r="1.8" fill={themeColor} />

        {/* Bottom Flourishes */}
        <path
          d="M85 186 C 77 198 60 196 62 184 C 64 174 78 175 85 164 C 92 175 106 174 108 184 C 110 196 93 198 85 186 Z"
          fill="none"
          stroke="url(#cameoBorderGrad)"
          strokeWidth="2"
        />
        <circle cx="85" cy="194" r="3" fill={themeColor} />
        <circle cx="75" cy="190" r="1.8" fill={themeColor} />
        <circle cx="95" cy="190" r="1.8" fill={themeColor} />

        {/* Left Side C-scrolls & Leaves */}
        <path
          d="M48 60 C 32 50 20 68 28 82 C 34 92 46 88 44 105 C 42 122 30 118 28 128 C 20 142 32 160 48 150"
          fill="none"
          stroke="url(#cameoBorderGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M22 75 C 15 72 16 64 24 67 C 28 69 26 77 22 75 Z" fill={themeColor} />
        <path d="M20 105 C 13 103 14 96 22 98 C 25 101 24 107 20 105 Z" fill={themeColor} />
        <path d="M22 135 C 15 138 16 146 24 143 C 28 141 26 133 22 135 Z" fill={themeColor} />

        {/* Right Side C-scrolls & Leaves */}
        <path
          d="M122 60 C 138 50 150 68 142 82 C 136 92 124 88 126 105 C 128 122 140 118 142 128 C 150 142 138 160 122 150"
          fill="none"
          stroke="url(#cameoBorderGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M148 75 C 155 72 154 64 146 67 C 142 69 144 77 148 75 Z" fill={themeColor} />
        <path d="M150 105 C 157 103 156 96 148 98 C 145 101 146 107 150 105 Z" fill={themeColor} />
        <path d="M148 135 C 155 138 154 146 146 143 C 142 141 144 133 148 135 Z" fill={themeColor} />

        {/* Outer Beaded Medallion Ring */}
        <circle cx="85" cy="105" r="51" stroke="url(#cameoBorderGrad)" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="85" cy="105" r="47" stroke="url(#cameoBorderGrad)" strokeWidth="2.5" />
        <circle cx="85" cy="105" r="43.5" stroke="#f6ddd8" strokeWidth="1" />

        {/* Inner Two-Tone Medallion (Clipped) */}
        <g clipPath="url(#innerMedallionClip)">
          {/* Top Half: Light Cream/Blush */}
          <rect x="35" y="55" width="100" height="100" fill="#fdf5f0" />
          {/* Bottom Half: Flowing wave in Theme Color */}
          <path
            d="M35 105 C 55 94 68 116 85 105 C 102 94 115 116 135 105 L 135 160 L 35 160 Z"
            fill={themeColor}
          />
          {/* Thin Gold accent along the wave boundary */}
          <path
            d="M35 105 C 55 94 68 116 85 105 C 102 94 115 116 135 105"
            fill="none"
            stroke="#d4a373"
            strokeWidth="1.2"
          />
        </g>

        {/* Delicate Heart knot in the middle */}
        <path
          d="M85 103 C 82 99 77 100 78 104 C 79 107 85 110 85 110 C 85 110 91 107 92 104 C 93 100 88 99 85 103 Z"
          fill="#d4a373"
          stroke={themeColor}
          strokeWidth="0.6"
        />

        {/* Inner Decorative Fine Ring */}
        <circle cx="85" cy="105" r="41" fill="none" stroke="url(#cameoBorderGrad)" strokeWidth="1.5" />

        {/* Top Groom Letter (Theme Color on Cream) - Native SVG Battambang Text */}
        <text
          x="85"
          y="88"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Battambang', serif"
          fontSize="28"
          fontWeight="900"
          fill={themeColor}
          className="font-battambang select-none pointer-events-none"
        >
          {gLetter}
        </text>

        {/* Bottom Bride Letter (Cream/White on Theme Color) - Native SVG Battambang Text */}
        <text
          x="85"
          y="126"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Battambang', serif"
          fontSize="28"
          fontWeight="900"
          fill="#ffffff"
          className="font-battambang select-none pointer-events-none"
        >
          {bLetter}
        </text>
      </svg>
    </div>
  );
}

// Khmer Wedding Title with Botanical Flourish (Replica of top header in reference image)
export function KhmerWeddingTitleWithBotanicalFlourish({
  line1 = 'សិរីមង្គល',
  line2 = 'អាពាហ៍ពិពាហ៍',
  color = '#6c2925',
  className = '',
}: {
  line1?: string;
  line2?: string;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative inline-block text-center ${className}`}>
      {/* Botanical Vine Flourish sprouting from the top right */}
      <div className="absolute -top-6 -right-10 sm:-top-8 sm:-right-14 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-10">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-90">
          {/* Main Stem curving upwards and right */}
          <path
            d="M10 85 C 20 65 30 45 55 30 C 70 20 85 18 92 12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Branchlets & Leaves */}
          <path d="M35 55 C 38 48 48 46 47 54 C 44 60 36 58 35 55 Z" fill={color} />
          <path d="M45 42 C 52 38 60 40 57 48 C 52 52 46 48 45 42 Z" fill={color} />
          <path d="M60 30 C 68 25 76 28 73 35 C 68 40 61 36 60 30 Z" fill={color} />
          <path d="M75 22 C 82 17 90 20 87 27 C 82 30 76 27 75 22 Z" fill={color} />
          {/* Bud Tip */}
          <circle cx="93" cy="11" r="2.5" fill={color} />
          {/* Tiny decorative berries */}
          <circle cx="48" cy="38" r="1.5" fill="#f43f5e" />
          <circle cx="63" cy="26" r="1.5" fill="#f43f5e" />
          <circle cx="78" cy="18" r="1.5" fill="#f43f5e" />
        </svg>
      </div>

      {/* Two Line Title in Battambang Font */}
      <div className="flex flex-col items-center">
        <span
          className="font-battambang font-bold text-2xl sm:text-3xl md:text-4xl tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          style={{ fontFamily: "'Battambang', serif", color }}
        >
          {line1}
        </span>
        <span
          className="font-battambang font-bold text-2xl sm:text-3xl md:text-4xl tracking-wide leading-tight mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          style={{ fontFamily: "'Battambang', serif", color }}
        >
          {line2}
        </span>
      </div>
    </div>
  );
}

// Hanging Floral Garland Strings (Pink lotus/buds dangling from the arch)
export function HangingGarlandsOverlay() {
  const garlands = [
    { left: '12%', length: 90, delay: '0s' },
    { left: '22%', length: 130, delay: '0.4s' },
    { left: '32%', length: 80, delay: '0.8s' },
    { left: '68%', length: 85, delay: '0.2s' },
    { left: '78%', length: 135, delay: '0.6s' },
    { left: '88%', length: 95, delay: '1s' },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 h-44 pointer-events-none overflow-hidden z-10 select-none">
      {garlands.map((g, idx) => (
        <div
          key={`garland-${idx}`}
          className="absolute top-0 flex flex-col items-center animate-pulse"
          style={{
            left: g.left,
            animationDuration: '3.5s',
            animationDelay: g.delay,
          }}
        >
          {/* Golden bead string */}
          <div
            className="w-[1px] bg-gradient-to-b from-amber-400/80 via-amber-300/60 to-amber-400"
            style={{ height: `${g.length}px` }}
          />
          {/* Small Gold Ring */}
          <div className="w-1.5 h-1.5 rounded-full border border-amber-400 bg-amber-200/80 -mt-0.5" />
          {/* Hanging Pink Lotus / Rose Bud */}
          <svg viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-5 -mt-0.5 drop-shadow-sm">
            {/* Green calyx */}
            <path d="M6 2 L8 0 L10 2 L8 5 Z" fill="#65a30d" />
            {/* Pink Petals */}
            <path d="M8 4 C 4 7 4 15 8 20 C 12 15 12 7 8 4 Z" fill="#f472b6" />
            <path d="M8 6 C 5.5 9 5.5 15 8 18 C 10.5 15 10.5 9 8 6 Z" fill="#fbcfe8" />
            <circle cx="8" cy="18" r="1" fill="#ec4899" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// Rose Gold & Royal Gold Ornate Guest Plaque (ការរចនាស៊ុមស្លាកឈ្មោះភ្ញៀវ)
export function RoseGoldOrnateGuestPlaque({
  children,
  className = '',
  accentColor = '#881337',
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  return (
    <div className={`relative inline-flex items-center justify-center w-full max-w-sm sm:max-w-md mx-auto select-none ${className}`}>
      <svg
        viewBox="0 0 420 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_25px_rgba(136,19,55,0.22)] filter"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Shimmering Rose-Gold & Royal Gold Foil Gradient */}
          <linearGradient id="rgPlaqueFoil" x1="0" y1="0" x2="420" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="18%" stopColor="#fff6c7" />
            <stop offset="36%" stopColor="#f5b80f" />
            <stop offset="55%" stopColor="#fef08a" />
            <stop offset="72%" stopColor="#e11d48" />
            <stop offset="86%" stopColor="#ffd7d9" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          {/* Deep Royal Border Gradient */}
          <linearGradient id="rgPlaqueBorder" x1="0" y1="0" x2="0" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#881337" />
            <stop offset="35%" stopColor="#9f1239" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>

          <filter id="rgParchmentShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#881337" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Central Pure Ivory/White Card Surface */}
        <rect
          x="44"
          y="12"
          width="332"
          height="60"
          rx="8"
          fill="#ffffff"
          stroke="url(#rgPlaqueFoil)"
          strokeWidth="3.5"
          filter="url(#rgParchmentShadow)"
        />

        {/* Inner Dual Inset Hairlines */}
        <rect
          x="49"
          y="17"
          width="322"
          height="50"
          rx="5"
          fill="none"
          stroke="url(#rgPlaqueBorder)"
          strokeWidth="1.2"
          strokeOpacity="0.65"
        />

        {/* --- LEFT ORNATE KHMER KBACH WING (Golden-Rose Floral Bracket) --- */}
        <g id="rg-left-kbach-wing">
          <path
            d="M48 10 
               C 38 10, 24 6, 18 16 
               C 12 24, 20 34, 12 42 
               C 4 50, 14 62, 20 68 
               C 28 76, 40 74, 48 74 
               L 48 10 Z"
            fill="url(#rgPlaqueFoil)"
            stroke="url(#rgPlaqueBorder)"
            strokeWidth="1.2"
          />
          {/* Intricate Kbach Phni Tes carvings on Left */}
          <path
            d="M 44 20 C 34 20, 26 16, 24 24 C 22 32, 32 36, 26 42 C 20 48, 28 58, 36 60 C 42 62, 44 64, 44 64"
            fill="none"
            stroke="#881337"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 36 28 C 30 26, 26 30, 28 36 C 30 40, 36 38, 36 34"
            fill="none"
            stroke="#be123c"
            strokeWidth="1.2"
          />
          <circle cx="16" cy="42" r="3.5" fill="url(#rgPlaqueFoil)" stroke="#881337" strokeWidth="0.8" />
          <circle cx="16" cy="42" r="1.5" fill="#ffffff" />
          <circle cx="28" cy="22" r="2" fill="#881337" />
          <circle cx="28" cy="62" r="2" fill="#881337" />
        </g>

        {/* --- RIGHT ORNATE KHMER KBACH WING (Golden-Rose Floral Bracket) --- */}
        <g id="rg-right-kbach-wing" transform="translate(420, 0) scale(-1, 1)">
          <path
            d="M48 10 
               C 38 10, 24 6, 18 16 
               C 12 24, 20 34, 12 42 
               C 4 50, 14 62, 20 68 
               C 28 76, 40 74, 48 74 
               L 48 10 Z"
            fill="url(#rgPlaqueFoil)"
            stroke="url(#rgPlaqueBorder)"
            strokeWidth="1.2"
          />
          {/* Intricate Kbach Phni Tes carvings on Right */}
          <path
            d="M 44 20 C 34 20, 26 16, 24 24 C 22 32, 32 36, 26 42 C 20 48, 28 58, 36 60 C 42 62, 44 64, 44 64"
            fill="none"
            stroke="#881337"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 36 28 C 30 26, 26 30, 28 36 C 30 40, 36 38, 36 34"
            fill="none"
            stroke="#be123c"
            strokeWidth="1.2"
          />
          <circle cx="16" cy="42" r="3.5" fill="url(#rgPlaqueFoil)" stroke="#881337" strokeWidth="0.8" />
          <circle cx="16" cy="42" r="1.5" fill="#ffffff" />
          <circle cx="28" cy="22" r="2" fill="#881337" />
          <circle cx="28" cy="62" r="2" fill="#881337" />
        </g>

        {/* Corner Accents on Card Border */}
        <circle cx="56" cy="24" r="2" fill="#881337" />
        <circle cx="364" cy="24" r="2" fill="#881337" />
        <circle cx="56" cy="60" r="2" fill="#881337" />
        <circle cx="364" cy="60" r="2" fill="#881337" />
      </svg>

      {/* Guest Name Content Centered Inside */}
      <div className="absolute inset-0 flex items-center justify-center px-12 sm:px-16 py-2">
        {children}
      </div>
    </div>
  );
}

// Ornate Golden-Winged Guest Plaque (Direct Replica of reference image E-t.PNG)
export function KhmerRoyalGoldenGuestPlaque({
  children,
  className = '',
  borderColor = '#d4af37',
}: {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}) {
  return (
    <div className={`relative inline-flex items-center justify-center w-full max-w-sm sm:max-w-md mx-auto select-none ${className}`}>
      <svg
        viewBox="0 0 420 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_25px_rgba(0,0,0,0.35)] filter"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Rich Golden Foil Shimmer Gradient */}
          <linearGradient id="plaqueGoldFoil" x1="0" y1="0" x2="420" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="15%" stopColor="#fff6c7" />
            <stop offset="35%" stopColor="#f5b80f" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="85%" stopColor="#fff8db" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Deep Golden Stroke Gradient */}
          <linearGradient id="plaqueBorderGold" x1="0" y1="0" x2="0" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="30%" stopColor="#b45309" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          {/* Soft Parchment Inner Shadow */}
          <filter id="parchmentShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Central Pure Ivory/White Card Surface */}
        <rect
          x="44"
          y="12"
          width="332"
          height="60"
          rx="6"
          fill="#ffffff"
          stroke="url(#plaqueGoldFoil)"
          strokeWidth="3.5"
          filter="url(#parchmentShadow)"
        />

        {/* Inner Gold Inset Hairlines */}
        <rect
          x="49"
          y="17"
          width="322"
          height="50"
          rx="3"
          fill="none"
          stroke="url(#plaqueBorderGold)"
          strokeWidth="1"
          strokeOpacity="0.6"
        />

        {/* --- LEFT ORNATE KHMER KBACH WING (Golden Floral Bracket) --- */}
        <g id="left-kbach-wing">
          {/* Gold wing background silhouette */}
          <path
            d="M48 10 
               C 38 10, 24 6, 18 16 
               C 12 24, 20 34, 12 42 
               C 4 50, 14 62, 20 68 
               C 28 76, 40 74, 48 74 
               L 48 10 Z"
            fill="url(#plaqueGoldFoil)"
            stroke="url(#plaqueBorderGold)"
            strokeWidth="1.2"
          />
          {/* Intricate Kbach Phni Tes carvings on Left */}
          <path
            d="M 44 20 C 34 20, 26 16, 24 24 C 22 32, 32 36, 26 42 C 20 48, 28 58, 36 60 C 42 62, 44 64, 44 64"
            fill="none"
            stroke="#78350f"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 36 28 C 30 26, 26 30, 28 36 C 30 40, 36 38, 36 34"
            fill="none"
            stroke="#92400e"
            strokeWidth="1.2"
          />
          <circle cx="16" cy="42" r="3.5" fill="url(#plaqueGoldFoil)" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="16" cy="42" r="1.5" fill="#ffffff" />
          <circle cx="28" cy="22" r="2" fill="#78350f" />
          <circle cx="28" cy="62" r="2" fill="#78350f" />
        </g>

        {/* --- RIGHT ORNATE KHMER KBACH WING (Golden Floral Bracket) --- */}
        <g id="right-kbach-wing" transform="translate(420, 0) scale(-1, 1)">
          {/* Gold wing background silhouette */}
          <path
            d="M48 10 
               C 38 10, 24 6, 18 16 
               C 12 24, 20 34, 12 42 
               C 4 50, 14 62, 20 68 
               C 28 76, 40 74, 48 74 
               L 48 10 Z"
            fill="url(#plaqueGoldFoil)"
            stroke="url(#plaqueBorderGold)"
            strokeWidth="1.2"
          />
          {/* Intricate Kbach Phni Tes carvings on Right */}
          <path
            d="M 44 20 C 34 20, 26 16, 24 24 C 22 32, 32 36, 26 42 C 20 48, 28 58, 36 60 C 42 62, 44 64, 44 64"
            fill="none"
            stroke="#78350f"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 36 28 C 30 26, 26 30, 28 36 C 30 40, 36 38, 36 34"
            fill="none"
            stroke="#92400e"
            strokeWidth="1.2"
          />
          <circle cx="16" cy="42" r="3.5" fill="url(#plaqueGoldFoil)" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="16" cy="42" r="1.5" fill="#ffffff" />
          <circle cx="28" cy="22" r="2" fill="#78350f" />
          <circle cx="28" cy="62" r="2" fill="#78350f" />
        </g>

        {/* Corner Accents on Card Border */}
        <circle cx="56" cy="24" r="2" fill="#d97706" />
        <circle cx="364" cy="24" r="2" fill="#d97706" />
        <circle cx="56" cy="60" r="2" fill="#d97706" />
        <circle cx="364" cy="60" r="2" fill="#d97706" />
      </svg>

      {/* Guest Name Content Centered Inside */}
      <div className="absolute inset-0 flex items-center justify-center px-12 sm:px-16 py-2">
        {children}
      </div>
    </div>
  );
}

// Authentic Angkor Temple Arch with Stone Pillars, Vines & Top Branch with Love Birds (Matching E-t.PNG)
export function AngkorTemplePillarsOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {/* Top Foliage & Birds on Branch */}
      <div className="absolute top-0 inset-x-0 h-32 pointer-events-none">
        {/* Branch sweeping from top right across to center */}
        <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-95">
          <defs>
            <linearGradient id="branchGrad" x1="400" y1="0" x2="180" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2e1d0f" />
              <stop offset="60%" stopColor="#4a3520" />
              <stop offset="100%" stopColor="#3d2817" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4d7c0f" />
              <stop offset="60%" stopColor="#365314" />
              <stop offset="100%" stopColor="#1a2e05" />
            </linearGradient>
          </defs>
          {/* Main Tree Branch */}
          <path
            d="M 410 5 C 360 10, 310 25, 260 22 C 220 20, 180 35, 140 38"
            stroke="url(#branchGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 330 20 C 310 32, 280 40, 250 42"
            stroke="url(#branchGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 210 26 C 190 38, 170 48, 150 46"
            stroke="url(#branchGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Green Ivy Leaves on the branch */}
          <g fill="url(#leafGrad)">
            {/* Clustered leaves */}
            <path d="M 380 8 C 395 -2, 405 12, 388 18 Z" />
            <path d="M 360 12 C 375 2, 385 16, 368 22 Z" />
            <path d="M 340 18 C 350 8, 362 20, 345 28 Z" />
            <path d="M 310 20 C 322 10, 332 24, 315 32 Z" />
            <path d="M 285 24 C 298 14, 308 28, 290 35 Z" />
            <path d="M 255 24 C 265 15, 275 28, 260 36 Z" />
            <path d="M 225 28 C 235 18, 246 32, 230 40 Z" />
            <path d="M 180 36 C 190 26, 200 40, 185 48 Z" />
            <path d="M 150 40 C 160 30, 170 45, 155 52 Z" />
          </g>

          {/* Two White Love Doves perched lovingly on the branch */}
          <g transform="translate(242, 12)">
            {/* Left Dove */}
            <g transform="translate(0, 0)">
              {/* Body */}
              <ellipse cx="6" cy="10" rx="4.5" ry="7" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
              {/* Head */}
              <circle cx="6" cy="3" r="3.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
              {/* Beak */}
              <polygon points="7,2 10,3 7,4" fill="#f59e0b" />
              {/* Pink/soft blush chest */}
              <ellipse cx="6.5" cy="8" rx="2.5" ry="4" fill="#fce7f3" opacity="0.6" />
              {/* Tail */}
              <polygon points="4,15 8,15 6,24" fill="#e2e8f0" />
            </g>

            {/* Right Dove (Facing Left towards its partner) */}
            <g transform="translate(12, 1)">
              {/* Body */}
              <ellipse cx="6" cy="10" rx="4.5" ry="7" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
              {/* Head */}
              <circle cx="5" cy="3" r="3.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
              {/* Beak */}
              <polygon points="4,2 1,3 4,4" fill="#f59e0b" />
              {/* Soft purple/pink blush chest */}
              <ellipse cx="5.5" cy="8" rx="2.5" ry="4" fill="#ede9fe" opacity="0.6" />
              {/* Tail */}
              <polygon points="4,15 8,15 6,24" fill="#e2e8f0" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

// Authentic Golden Teardrop Locket with Spire Finial (Matching Monogram in E-t.PNG)
export function KhmerGoldenTeardropLocket({
  groom = 'រ៉ូ ម៉ាឡេ',
  bride = 'អួម វល្ខ័ក',
  className = 'w-28 h-36 sm:w-32 sm:h-40',
}: {
  groom?: string;
  bride?: string;
  className?: string;
}) {
  const gLetter = (groom || 'ម៉ាឡេ').replace(/^(លោក|អ្នក|កញ្ញា|ឯកឧត្តម|លោកជំទាវ)\s*/, '').trim().charAt(0) || 'ម';
  const bLetter = (bride || 'វល្ខ័ក').replace(/^(លោក|អ្នក|កញ្ញា|ឯកឧត្តម|លោកជំទាវ)\s*/, '').trim().charAt(0) || 'វ';

  return (
    <div className={`relative flex items-center justify-center ${className} select-none mx-auto`}>
      <svg
        viewBox="0 0 160 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_20px_rgba(217,119,6,0.45)]"
      >
        <defs>
          <linearGradient id="locketGoldGrad" x1="10" y1="0" x2="150" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="25%" stopColor="#f5b80f" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="75%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          <linearGradient id="locketSpireGrad" x1="80" y1="0" x2="80" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#fde047" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <radialGradient id="innerLocketBackdrop" cx="50%" cy="55%" r="45%">
            <stop offset="0%" stopColor="#fffdf0" />
            <stop offset="70%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
        </defs>

        {/* --- Top Flame / Spire Tiara (Kbach Phni Phloeung) --- */}
        <path
          d="M 80 4 
             C 77 16, 68 24, 66 32 
             C 64 40, 72 46, 80 48 
             C 88 46, 96 40, 94 32 
             C 92 24, 83 16, 80 4 Z"
          fill="url(#locketSpireGrad)"
          stroke="#78350f"
          strokeWidth="1"
        />
        {/* Spire side curls */}
        <path
          d="M 70 30 C 58 20, 52 34, 62 44 C 68 50, 76 50, 78 52"
          fill="none"
          stroke="url(#locketGoldGrad)"
          strokeWidth="2.2"
        />
        <path
          d="M 90 30 C 102 20, 108 34, 98 44 C 92 50, 84 50, 82 52"
          fill="none"
          stroke="url(#locketGoldGrad)"
          strokeWidth="2.2"
        />
        <circle cx="80" cy="8" r="2" fill="#ffffff" />

        {/* --- Main Teardrop / Oval Medallion Frame --- */}
        {/* Outer Frame */}
        <path
          d="M 80 50 
             C 42 50, 22 85, 22 125 
             C 22 168, 48 198, 80 198 
             C 112 198, 138 168, 138 125 
             C 138 85, 118 50, 80 50 Z"
          fill="url(#innerLocketBackdrop)"
          stroke="url(#locketGoldGrad)"
          strokeWidth="4.5"
        />

        {/* Inner Beaded Accent Ring */}
        <path
          d="M 80 58 
             C 48 58, 30 90, 30 125 
             C 30 162, 52 190, 80 190 
             C 108 190, 130 162, 130 125 
             C 130 90, 112 58, 80 58 Z"
          fill="none"
          stroke="#d97706"
          strokeWidth="1.2"
          strokeDasharray="3 2"
        />

        {/* Bottom Filigree Finial */}
        <path
          d="M 74 196 C 70 204, 76 208, 80 208 C 84 208, 90 204, 86 196 Z"
          fill="url(#locketGoldGrad)"
          stroke="#78350f"
          strokeWidth="0.8"
        />

        {/* Center Khmer Monogram Calligraphy */}
        {/* Top Groom Letter */}
        <text
          x="80"
          y="108"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Battambang', 'Moul', serif"
          fontSize="30"
          fontWeight="bold"
          fill="#92400e"
          stroke="#451a03"
          strokeWidth="0.6"
          className="font-battambang select-none pointer-events-none"
        >
          {gLetter}
        </text>

        {/* Center Connecting Heart Knot */}
        <path
          d="M 80 123 C 78 120, 74 121, 75 124 C 76 126, 80 129, 80 129 C 80 129, 84 126, 85 124 C 86 121, 82 120, 80 123 Z"
          fill="#d97706"
        />

        {/* Bottom Bride Letter */}
        <text
          x="80"
          y="148"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Battambang', 'Moul', serif"
          fontSize="30"
          fontWeight="bold"
          fill="#b45309"
          stroke="#451a03"
          strokeWidth="0.6"
          className="font-battambang select-none pointer-events-none"
        >
          {bLetter}
        </text>
      </svg>
    </div>
  );
}

// Golden Glitter Play / Open Envelope Button (Matching Reference Image E-t.PNG)
export function GoldenGlitterPlayButton({
  onOpen,
  isOpening = false,
  labelKh = 'បើកសំបុត្រ',
}: {
  onOpen: () => void;
  isOpening?: boolean;
  labelKh?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center group select-none">
      {/* Glowing Golden Circle Button */}
      <button
        type="button"
        id="open-invitation-golden-btn"
        onClick={onOpen}
        disabled={isOpening}
        aria-label="Open invitation"
        className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-white via-amber-50 to-white flex items-center justify-center shadow-[0_6px_25px_rgba(245,158,11,0.5),0_0_15px_rgba(245,158,11,0.35)] hover:shadow-[0_8px_32px_rgba(245,158,11,0.7),0_0_25px_rgba(245,184,15,0.6)] active:scale-95 transition-all duration-300 border-[3.5px] border-amber-400 cursor-pointer"
      >
        {/* Shimmering Golden Glitter Outer Ring */}
        <div className="absolute -inset-1.5 rounded-full border border-dashed border-amber-300/80 animate-spin pointer-events-none" style={{ animationDuration: '12s' }} />

        {/* Inner Golden Play Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="#d97706"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 sm:w-7 sm:h-7 translate-x-0.5 text-amber-600 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        >
          <path d="M 7 4 L 19 12 L 7 20 Z" />
        </svg>
      </button>

      {/* Khmer text below: បើកសំបុត្រ */}
      <span
        onClick={onOpen}
        className="mt-2 text-sm sm:text-base font-moul text-amber-950 font-bold tracking-wider cursor-pointer group-hover:text-amber-800 transition-colors drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]"
      >
        {labelKh}
      </span>
    </div>
  );
}

// Vintage Scalloped Plaque for Guest Name (Replica of the white bracketed badge)
export function VintageScallopedGuestPlaque({
  children,
  className = '',
  borderColor = '#6c2925',
}: {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}) {
  return (
    <div className={`relative inline-flex items-center justify-center w-full max-w-md mx-auto select-none ${className}`}>
      {/* Plaque Background & Border */}
      <svg
        viewBox="0 0 380 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_20px_rgba(108,46,40,0.18)]"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="plaqueInnerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feOffset dx="0" dy="1" />
            <feGaussianBlur stdDeviation="1.5" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.08" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Vintage Scalloped / Cartouche bracket outline */}
        {/* Main White Plaque Body */}
        <path
          d="M 28 8 
             Q 36 8 40 4 
             L 340 4 
             Q 344 8 352 8 
             Q 364 8 368 18 
             L 374 37.5 
             L 368 57 
             Q 364 67 352 67 
             Q 344 67 340 71 
             L 40 71 
             Q 36 67 28 67 
             Q 16 67 12 57 
             L 6 37.5 
             L 12 18 
             Q 16 8 28 8 Z"
          fill="#ffffff"
          stroke={borderColor}
          strokeWidth="2.5"
          filter="url(#plaqueInnerShadow)"
        />

        {/* Inner Fine Accent Border */}
        <path
          d="M 32 13 
             L 348 13 
             Q 358 13 362 21 
             L 367 37.5 
             L 362 54 
             Q 358 62 348 62 
             L 32 62 
             Q 22 62 18 54 
             L 13 37.5 
             L 18 21 
             Q 22 13 32 13 Z"
          fill="none"
          stroke={borderColor}
          strokeWidth="1"
          strokeOpacity="0.45"
        />

        {/* Left & Right End Notches */}
        <circle cx="10" cy="37.5" r="2" fill={borderColor} />
        <circle cx="370" cy="37.5" r="2" fill={borderColor} />
      </svg>

      {/* Content centered inside */}
      <div className="absolute inset-0 flex items-center justify-center px-8 sm:px-12 py-2">
        {children}
      </div>
    </div>
  );
}

// Circular Play / Open Button (Replica of the round open button in reference image)
export function CircularPlayOpenButton({
  onOpen,
  isOpening = false,
  color = '#6c2925',
  labelKh = 'បើកសំបុត្រ',
}: {
  onOpen: () => void;
  isOpening?: boolean;
  color?: string;
  labelKh?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center group select-none">
      {/* Circular Play Button */}
      <button
        type="button"
        id="open-invitation-circle-btn"
        onClick={onOpen}
        disabled={isOpening}
        aria-label="Open invitation"
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_25px_rgba(108,46,40,0.35)] hover:shadow-[0_12px_32px_rgba(108,46,40,0.5)] active:scale-95 transition-all duration-300 border-[3.5px] cursor-pointer"
        style={{ borderColor: color }}
      >
        {/* Subtle pulsing outer ring */}
        <div
          className="absolute -inset-2 rounded-full border-2 border-dashed opacity-40 animate-spin"
          style={{ borderColor: color, animationDuration: '14s' }}
        />

        {/* Inner Play Triangle */}
        <svg
          viewBox="0 0 24 24"
          fill={color}
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 sm:w-7 sm:h-7 translate-x-0.5 group-hover:scale-110 transition-transform duration-300"
        >
          <path d="M 7 4 L 19 12 L 7 20 Z" />
        </svg>
      </button>

      {/* Text Label Below: បើកសំបុត្រ */}
      <span
        onClick={onOpen}
        className="mt-2 text-sm sm:text-base font-moul tracking-wider cursor-pointer group-hover:underline transition-all drop-shadow-sm"
        style={{ color }}
      >
        {labelKh}
      </span>
    </div>
  );
}

// ==========================================
// ROMANTIC ROSE GARDEN & IONIC ARCH OVERLAY (Matching User Reference Image)
// ==========================================
export function RomanticRoseGardenArchOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {/* Top Hanging Cherry Blossoms & Foliage */}
      <div className="absolute top-0 inset-x-0 h-40 pointer-events-none z-20">
        <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-90">
          <defs>
            <linearGradient id="blossomBranchGrad" x1="0" y1="0" x2="400" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4a2511" />
              <stop offset="100%" stopColor="#2e1408" />
            </linearGradient>
            <radialGradient id="pinkBlossomGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="70%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </radialGradient>
          </defs>

          {/* Left sweeping blossom branch */}
          <path d="M-10 0 C 40 10, 80 25, 120 15 C 150 8, 170 20, 190 12" stroke="url(#blossomBranchGrad)" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 15 C 70 30, 95 38, 110 40" stroke="url(#blossomBranchGrad)" strokeWidth="2" strokeLinecap="round" />

          {/* Right sweeping blossom branch */}
          <path d="M410 0 C 360 10, 320 25, 280 15 C 250 8, 230 20, 210 12" stroke="url(#blossomBranchGrad)" strokeWidth="4" strokeLinecap="round" />
          <path d="M350 15 C 330 30, 305 38, 290 40" stroke="url(#blossomBranchGrad)" strokeWidth="2" strokeLinecap="round" />

          {/* Hanging Soft Pink Cherry Blossoms Left */}
          <g fill="url(#pinkBlossomGlow)">
            <circle cx="35" cy="18" r="7" opacity="0.9" />
            <circle cx="55" cy="24" r="8" opacity="0.95" />
            <circle cx="75" cy="20" r="6.5" opacity="0.85" />
            <circle cx="95" cy="30" r="7.5" opacity="0.95" />
            <circle cx="115" cy="22" r="6" opacity="0.8" />
            <circle cx="135" cy="28" r="7" opacity="0.9" />
            <circle cx="160" cy="18" r="5.5" opacity="0.85" />
            <circle cx="80" cy="38" r="5" opacity="0.75" />
            <circle cx="105" cy="44" r="4.5" opacity="0.7" />
          </g>

          {/* Hanging Soft Pink Cherry Blossoms Right */}
          <g fill="url(#pinkBlossomGlow)">
            <circle cx="365" cy="18" r="7" opacity="0.9" />
            <circle cx="345" cy="24" r="8" opacity="0.95" />
            <circle cx="325" cy="20" r="6.5" opacity="0.85" />
            <circle cx="305" cy="30" r="7.5" opacity="0.95" />
            <circle cx="285" cy="22" r="6" opacity="0.8" />
            <circle cx="265" cy="28" r="7" opacity="0.9" />
            <circle cx="240" cy="18" r="5.5" opacity="0.85" />
            <circle cx="320" cy="38" r="5" opacity="0.75" />
            <circle cx="295" cy="44" r="4.5" opacity="0.7" />
          </g>
        </svg>
      </div>

      {/* Floating Cherry Blossom Petals in the Air */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
        {[
          { top: '18%', left: '22%', size: 'w-3 h-4', delay: '0s', dur: '5s' },
          { top: '28%', left: '78%', size: 'w-2.5 h-3.5', delay: '1.2s', dur: '6s' },
          { top: '42%', left: '16%', size: 'w-3 h-4', delay: '2.5s', dur: '5.5s' },
          { top: '55%', left: '84%', size: 'w-2 h-3', delay: '0.8s', dur: '4.8s' },
          { top: '68%', left: '30%', size: 'w-3 h-4', delay: '3.1s', dur: '6.2s' },
          { top: '75%', left: '72%', size: 'w-2.5 h-3.5', delay: '1.7s', dur: '5.2s' },
        ].map((petal, idx) => (
          <div
            key={`petal-${idx}`}
            className={`absolute ${petal.size} opacity-75 animate-bounce pointer-events-none`}
            style={{
              top: petal.top,
              left: petal.left,
              animationDuration: petal.dur,
              animationDelay: petal.delay,
            }}
          >
            <svg viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs rotate-12">
              <path d="M10 0 C 18 8, 20 20, 10 28 C 0 20, 2 8, 10 0 Z" fill="#fbcfe8" opacity="0.85" />
              <path d="M10 4 C 15 10, 16 18, 10 24 C 4 18, 5 10, 10 4 Z" fill="#f472b6" opacity="0.6" />
            </svg>
          </div>
        ))}
      </div>

      {/* Grand Classical Roman Ionic Arch Structure */}
      <svg
        viewBox="0 0 420 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full absolute inset-0 z-20 pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.18)]"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Pure White Marble Linear Gradients */}
          <linearGradient id="marbleArchGrad" x1="0" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="10%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="90%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          <linearGradient id="columnShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="25%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="columnFlute" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.7" />
          </linearGradient>

          <filter id="archShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.16" />
          </filter>
        </defs>

        {/* --- TOP ARCH (Classical Roman Rounded Arch with Outer Molding) --- */}
        <g filter="url(#archShadow)">
          {/* Outermost Arch Frame Outline */}
          <path
            d="M 12 720 L 12 240 C 12 110, 95 18, 210 18 C 325 18, 408 110, 408 240 L 408 720"
            stroke="url(#marbleArchGrad)"
            strokeWidth="24"
            strokeLinecap="square"
            fill="none"
          />

          {/* Stepped Arch Inner Molding Rim */}
          <path
            d="M 32 720 L 32 240 C 32 125, 105 40, 210 40 C 315 40, 388 125, 388 240 L 388 720"
            stroke="#ffffff"
            strokeWidth="10"
            fill="none"
          />

          <path
            d="M 44 720 L 44 240 C 44 135, 115 54, 210 54 C 305 54, 376 135, 376 240 L 376 720"
            stroke="#e2e8f0"
            strokeWidth="3.5"
            fill="none"
          />

          <path
            d="M 50 720 L 50 240 C 50 142, 120 62, 210 62 C 300 62, 370 142, 370 240 L 370 720"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            fill="none"
          />
        </g>

        {/* --- TOP KEYSTONE & CREST EMBLEM (Center Apex of the Arch) --- */}
        <g transform="translate(210, 20)">
          {/* Keystone Block */}
          <polygon
            points="-22, -6  22, -6  16, 32  -16, 32"
            fill="url(#marbleArchGrad)"
            stroke="#94a3b8"
            strokeWidth="1.5"
            filter="url(#archShadow)"
          />
          {/* Keystone stepped inner bevel */}
          <polygon
            points="-18, -2  18, -2  13, 28  -13, 28"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          {/* Delicate Top Gold/Green Acanthus Leaf Crest */}
          <path
            d="M0 -12 C -6 -4, -10 6, 0 16 C 10 6, 6 -4, 0 -12 Z"
            fill="#65a30d"
            opacity="0.85"
          />
          <path
            d="M0 -14 L 0 14"
            stroke="#f5b80f"
            strokeWidth="1.2"
          />
          <circle cx="0" cy="12" r="2.5" fill="#f5b80f" />
        </g>

        {/* --- LEFT IONIC COLUMN (Capital with Volute Scrolls, Fluted Shaft, Plinth Base) --- */}
        <g id="left-column">
          {/* Ionic Capital Scroll Volute */}
          <g transform="translate(4, 205)">
            {/* Abacus Top Plate */}
            <rect x="0" y="0" width="56" height="8" rx="2" fill="url(#marbleArchGrad)" stroke="#94a3b8" strokeWidth="1" />
            {/* Left Scroll (Volute Spiral) */}
            <circle cx="8" cy="18" r="9" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.8" />
            <circle cx="8" cy="18" r="5.5" fill="none" stroke="#64748b" strokeWidth="1.2" />
            <circle cx="8" cy="18" r="2" fill="#94a3b8" />
            {/* Right Scroll (Volute Spiral) */}
            <circle cx="48" cy="18" r="9" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.8" />
            <circle cx="48" cy="18" r="5.5" fill="none" stroke="#64748b" strokeWidth="1.2" />
            <circle cx="48" cy="18" r="2" fill="#94a3b8" />
            {/* Connecting Cushion & Egg-and-Dart band (000000 detailing) */}
            <rect x="8" y="10" width="40" height="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            {/* Egg-and-Dart 0000 Beads */}
            <circle cx="16" cy="17" r="2.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
            <circle cx="24" cy="17" r="2.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
            <circle cx="32" cy="17" r="2.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
            <circle cx="40" cy="17" r="2.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
          </g>

          {/* Fluted Column Shaft Left */}
          <rect x="10" y="235" width="44" height="485" fill="url(#columnShade)" stroke="#94a3b8" strokeWidth="1" />
          {/* Flute Vertical Channels */}
          <line x1="16" y1="236" x2="16" y2="720" stroke="url(#columnFlute)" strokeWidth="3" />
          <line x1="23" y1="236" x2="23" y2="720" stroke="url(#columnFlute)" strokeWidth="3" />
          <line x1="30" y1="236" x2="30" y2="720" stroke="url(#columnFlute)" strokeWidth="3" />
          <line x1="37" y1="236" x2="37" y2="720" stroke="url(#columnFlute)" strokeWidth="3" />
          <line x1="44" y1="236" x2="44" y2="720" stroke="url(#columnFlute)" strokeWidth="3" />
          <line x1="50" y1="236" x2="50" y2="720" stroke="url(#columnFlute)" strokeWidth="2" />
        </g>

        {/* --- RIGHT IONIC COLUMN (Capital with Volute Scrolls, Fluted Shaft, Plinth Base) --- */}
        <g id="right-column" transform="translate(420, 0) scale(-1, 1)">
          {/* Ionic Capital Scroll Volute */}
          <g transform="translate(4, 205)">
            <rect x="0" y="0" width="56" height="8" rx="2" fill="url(#marbleArchGrad)" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="8" cy="18" r="9" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.8" />
            <circle cx="8" cy="18" r="5.5" fill="none" stroke="#64748b" strokeWidth="1.2" />
            <circle cx="8" cy="18" r="2" fill="#94a3b8" />
            <circle cx="48" cy="18" r="9" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.8" />
            <circle cx="48" cy="18" r="5.5" fill="none" stroke="#64748b" strokeWidth="1.2" />
            <circle cx="48" cy="18" r="2" fill="#94a3b8" />
            <rect x="8" y="10" width="40" height="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="16" cy="17" r="2.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
            <circle cx="24" cy="17" r="2.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
            <circle cx="32" cy="17" r="2.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
            <circle cx="40" cy="17" r="2.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
          </g>

          {/* Fluted Column Shaft Right */}
          <rect x="10" y="235" width="44" height="485" fill="url(#columnShade)" stroke="#94a3b8" strokeWidth="1" />
          <line x1="16" y1="236" x2="16" y2="720" stroke="url(#columnFlute)" strokeWidth="3" />
          <line x1="23" y1="236" x2="23" y2="720" stroke="url(#columnFlute)" strokeWidth="3" />
          <line x1="30" y1="236" x2="30" y2="720" stroke="url(#columnFlute)" strokeWidth="3" />
          <line x1="37" y1="236" x2="37" y2="720" stroke="url(#columnFlute)" strokeWidth="3" />
          <line x1="44" y1="236" x2="44" y2="720" stroke="url(#columnFlute)" strokeWidth="3" />
          <line x1="50" y1="236" x2="50" y2="720" stroke="url(#columnFlute)" strokeWidth="2" />
        </g>
      </svg>

      {/* --- BOTTOM CORNER FLORAL TOPIARY & PINK ROSES (Matching Reference Image) --- */}
      {/* Bottom Left Rose Bush with Green Topiary Hedge and Glowing White Butterfly */}
      <div className="absolute -bottom-4 -left-6 w-36 sm:w-44 h-44 sm:h-52 pointer-events-none z-30 select-none">
        <svg viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
          <defs>
            <linearGradient id="topiaryGreenGrad" x1="0" y1="0" x2="180" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="45%" stopColor="#4d7c0f" />
              <stop offset="100%" stopColor="#1e3a07" />
            </linearGradient>

            <radialGradient id="pinkRoseGrad1" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fbcfe8" />
              <stop offset="60%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#9f1239" />
            </radialGradient>

            <radialGradient id="pinkRoseGrad2" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffe4e6" />
              <stop offset="30%" stopColor="#fda4af" />
              <stop offset="70%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
          </defs>

          {/* Manicured Green Topiary Mound Background */}
          <path
            d="M-20 200 C -20 120, 30 70, 85 85 C 130 100, 160 145, 170 200 Z"
            fill="url(#topiaryGreenGrad)"
          />
          <circle cx="45" cy="110" r="28" fill="#65a30d" opacity="0.4" />
          <circle cx="105" cy="120" r="32" fill="#4d7c0f" opacity="0.5" />

          {/* Dense Mound of Pink English Roses (Arranged in lush rounded tiers) */}
          <g id="left-rose-cluster">
            <g transform="translate(65, 120)">
              <circle cx="0" cy="0" r="18" fill="url(#pinkRoseGrad1)" stroke="#ffe4e6" strokeWidth="1" />
              <path d="M-8 -4 C-4 -12, 6 -12, 10 -4 C 12 4, 4 10, -4 8" fill="none" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M-4 2 C0 -4, 6 -2, 4 4" fill="none" stroke="#ffe4e6" strokeWidth="1.2" />
            </g>

            <g transform="translate(108, 138)">
              <circle cx="0" cy="0" r="17" fill="url(#pinkRoseGrad2)" stroke="#ffe4e6" strokeWidth="1" />
              <path d="M-7 -4 C-3 -11, 7 -11, 9 -4 C 11 4, 3 9, -3 7" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </g>

            <g transform="translate(30, 148)">
              <circle cx="0" cy="0" r="19" fill="url(#pinkRoseGrad2)" stroke="#ffe4e6" strokeWidth="1" />
              <path d="M-8 -5 C-4 -14, 8 -14, 11 -5 C 13 5, 5 11, -4 9" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </g>

            <g transform="translate(72, 155)">
              <circle cx="0" cy="0" r="22" fill="url(#pinkRoseGrad1)" stroke="#ffffff" strokeWidth="1.2" />
              <path d="M-10 -5 C-5 -15, 10 -15, 13 -5 C 15 6, 6 13, -5 10" fill="none" stroke="#ffffff" strokeWidth="1.8" />
              <circle cx="1" cy="0" r="5" fill="#f43f5e" />
            </g>

            <g transform="translate(120, 170)">
              <circle cx="0" cy="0" r="18" fill="url(#pinkRoseGrad1)" stroke="#ffe4e6" strokeWidth="1" />
              <path d="M-7 -4 C-3 -11, 7 -11, 9 -4" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </g>

            <g transform="translate(25, 185)">
              <circle cx="0" cy="0" r="20" fill="url(#pinkRoseGrad1)" />
              <path d="M-8 -4 C-4 -12, 6 -12, 10 -4" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </g>

            <g transform="translate(70, 192)">
              <circle cx="0" cy="0" r="21" fill="url(#pinkRoseGrad2)" />
              <path d="M-9 -5 C-5 -14, 8 -14, 11 -5" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          </g>

          {/* Delicate Glowing White Butterfly Perched on the Roses */}
          <g transform="translate(125, 105) scale(0.9) rotate(-15)">
            <circle cx="10" cy="10" r="16" fill="#ffffff" opacity="0.4" filter="blur(4px)" />
            <path d="M10 10 C 2 2, 0 12, 6 18 C 10 15, 10 12, 10 10 Z" fill="#ffffff" opacity="0.95" stroke="#fbcfe8" strokeWidth="0.8" />
            <path d="M10 10 C 18 0, 24 8, 16 16 C 12 14, 11 12, 10 10 Z" fill="#ffffff" opacity="0.95" stroke="#fbcfe8" strokeWidth="0.8" />
            <line x1="10" y1="8" x2="10" y2="16" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M10 8 Q 7 4 6 5" stroke="#d97706" strokeWidth="0.6" fill="none" />
            <path d="M10 8 Q 13 4 14 5" stroke="#d97706" strokeWidth="0.6" fill="none" />
          </g>
        </svg>
      </div>

      {/* Bottom Right Rose Bush with Green Topiary Hedge and Glowing White Butterfly */}
      <div className="absolute -bottom-4 -right-6 w-36 sm:w-44 h-44 sm:h-52 pointer-events-none z-30 select-none">
        <svg viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] scale-x-[-1]">
          <path
            d="M-20 200 C -20 120, 30 70, 85 85 C 130 100, 160 145, 170 200 Z"
            fill="url(#topiaryGreenGrad)"
          />
          <circle cx="45" cy="110" r="28" fill="#65a30d" opacity="0.4" />
          <circle cx="105" cy="120" r="32" fill="#4d7c0f" opacity="0.5" />

          <g id="right-rose-cluster">
            <g transform="translate(65, 120)">
              <circle cx="0" cy="0" r="18" fill="url(#pinkRoseGrad1)" stroke="#ffe4e6" strokeWidth="1" />
              <path d="M-8 -4 C-4 -12, 6 -12, 10 -4 C 12 4, 4 10, -4 8" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            <g transform="translate(108, 138)">
              <circle cx="0" cy="0" r="17" fill="url(#pinkRoseGrad2)" stroke="#ffe4e6" strokeWidth="1" />
              <path d="M-7 -4 C-3 -11, 7 -11, 9 -4" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            <g transform="translate(30, 148)">
              <circle cx="0" cy="0" r="19" fill="url(#pinkRoseGrad2)" stroke="#ffe4e6" strokeWidth="1" />
              <path d="M-8 -5 C-4 -14, 8 -14, 11 -5" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            <g transform="translate(72, 155)">
              <circle cx="0" cy="0" r="22" fill="url(#pinkRoseGrad1)" stroke="#ffffff" strokeWidth="1.2" />
              <path d="M-10 -5 C-5 -15, 10 -15, 13 -5" fill="none" stroke="#ffffff" strokeWidth="1.8" />
            </g>
            <g transform="translate(120, 170)">
              <circle cx="0" cy="0" r="18" fill="url(#pinkRoseGrad1)" stroke="#ffe4e6" strokeWidth="1" />
            </g>
            <g transform="translate(25, 185)">
              <circle cx="0" cy="0" r="20" fill="url(#pinkRoseGrad1)" />
            </g>
            <g transform="translate(70, 192)">
              <circle cx="0" cy="0" r="21" fill="url(#pinkRoseGrad2)" />
            </g>
          </g>

          <g transform="translate(125, 105) scale(0.9) rotate(-15)">
            <circle cx="10" cy="10" r="16" fill="#ffffff" opacity="0.4" filter="blur(4px)" />
            <path d="M10 10 C 2 2, 0 12, 6 18 C 10 15, 10 12, 10 10 Z" fill="#ffffff" opacity="0.95" stroke="#fbcfe8" strokeWidth="0.8" />
            <path d="M10 10 C 18 0, 24 8, 16 16 C 12 14, 11 12, 10 10 Z" fill="#ffffff" opacity="0.95" stroke="#fbcfe8" strokeWidth="0.8" />
            <line x1="10" y1="8" x2="10" y2="16" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 3D ROSE GOLD METALLIC CALLIGRAPHY (Matching Names in Reference Image)
// ==========================================
export function RoseGoldAnniversaryCalligraphy({
  groom = 'លោក សុខ',
  bride = 'អ្នកស្រី ម៉ារី',
  className = '',
}: {
  groom?: string;
  bride?: string;
  className?: string;
}) {
  const groomClean = (groom || 'លោក សុខ').trim();
  const brideClean = (bride || 'អ្នកស្រី ម៉ារី').trim();

  return (
    <div className={`relative flex flex-col items-center justify-center my-2 sm:my-3 select-none ${className}`}>
      {/* Background Translucent Glowing Play Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28 sm:w-36 sm:h-36">
          <polygon points="36,25 78,50 36,75" fill="#ffffff" opacity="0.9" />
        </svg>
      </div>

      {/* 3D Rose Gold Couple Names Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Ornate Top Calligraphy Swirl */}
        <svg viewBox="0 0 160 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 sm:w-36 h-auto mb-1 opacity-80">
          <path
            d="M 10 14 C 40 24, 60 4, 80 14 C 100 24, 120 4, 150 14"
            stroke="url(#roseGoldMetallicGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="80" cy="14" r="3" fill="#e8a598" />
        </svg>

        {/* Groom Line */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl leading-relaxed tracking-wide py-0.5 font-extrabold"
          style={{
            fontFamily: "'Noto Serif Khmer', serif",
            fontWeight: 800,
            color: '#701a2b',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(112, 26, 43, 0.22)',
          }}
        >
          {groomClean}
        </h2>

        {/* Romantic Heart Flourish Divider */}
        <div className="flex items-center justify-center gap-2 my-1">
          <span className="w-8 h-[1.5px] bg-[#c26153]/70" />
          <span
            className="text-sm sm:text-base px-2 font-bold"
            style={{
              fontFamily: "'Noto Serif Khmer', serif",
              fontWeight: 800,
              color: '#881337',
              textShadow: '0 1px 2px rgba(255,255,255,0.95)',
            }}
          >
            &
          </span>
          <span className="w-8 h-[1.5px] bg-[#c26153]/70" />
        </div>

        {/* Bride Line */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl leading-relaxed tracking-wide py-0.5 font-extrabold"
          style={{
            fontFamily: "'Noto Serif Khmer', serif",
            fontWeight: 800,
            color: '#701a2b',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(112, 26, 43, 0.22)',
          }}
        >
          {brideClean}
        </h2>

        {/* Bottom Calligraphy Vine Swirl */}
        <svg viewBox="0 0 180 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 sm:w-40 h-auto mt-1 opacity-80">
          <defs>
            <linearGradient id="roseGoldMetallicGrad" x1="0" y1="0" x2="180" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fdf2f8" />
              <stop offset="25%" stopColor="#fbcfe8" />
              <stop offset="50%" stopColor="#e8a598" />
              <stop offset="75%" stopColor="#c26153" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
          </defs>
          <path
            d="M 20 16 C 50 4, 70 28, 90 16 C 110 4, 130 28, 160 16"
            stroke="url(#roseGoldMetallicGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M 82 16 C 84 10, 96 10, 98 16" stroke="url(#roseGoldMetallicGrad)" strokeWidth="1.2" />
          <circle cx="90" cy="16" r="2.5" fill="#c26153" />
          <circle cx="35" cy="10" r="1.5" fill="#e8a598" />
          <circle cx="145" cy="10" r="1.5" fill="#e8a598" />
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// THEAP KHMER TEMPLATE 1 - REALISTIC 3D WAX SEAL (Matching theapkhmer.com/template1/opening-screen1)
// ==========================================
export function TheapKhmerTemplate1WaxSeal({
  initials = 'KL',
  className = 'w-24 h-24 sm:w-28 sm:h-28',
  onClick,
}: {
  initials?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-full cursor-pointer flex items-center justify-center select-none transition-transform hover:scale-105 active:scale-95 drop-shadow-[0_12px_30px_rgba(180,120,40,0.55)] ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
      >
        <defs>
          <radialGradient id="waxBaseGrad" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#eab308" />
            <stop offset="65%" stopColor="#ca8a04" />
            <stop offset="85%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#713f12" />
          </radialGradient>

          <radialGradient id="waxInnerRidgeGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="40%" stopColor="#d97706" />
            <stop offset="80%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>

          <linearGradient id="monogramGoldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#d97706" />
            <stop offset="70%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          <filter id="embossFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
            <feOffset in="blur" dx="-1" dy="-1" result="offset" />
            <feSpecularLighting in="blur" surfaceScale="2" specularConstant="1.2" specularExponent="15" result="specOut">
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>

        {/* Organic Molten Wax Droplet Rim with Natural Uneven Edges */}
        <path
          d="M 60 4 C 76 3, 90 9, 102 20 C 114 32, 118 46, 117 62 C 116 78, 109 92, 98 103 C 86 114, 72 118, 56 117 C 40 116, 26 109, 16 98 C 5 86, 1 72, 3 56 C 5 40, 13 26, 24 16 C 36 6, 48 4, 60 4 Z"
          fill="url(#waxBaseGrad)"
        />

        {/* Outer Molten Bevel Ring */}
        <path
          d="M 60 12 C 73 11, 85 16, 94 25 C 103 34, 108 47, 107 60 C 106 73, 100 85, 91 94 C 82 103, 69 108, 56 107 C 43 106, 31 100, 22 91 C 13 82, 9 69, 11 56 C 12 43, 19 31, 28 22 C 37 13, 47 12, 60 12 Z"
          fill="url(#waxInnerRidgeGrad)"
          stroke="#ca8a04"
          strokeWidth="1.5"
        />

        {/* Center Recessed Wax Pool */}
        <circle cx="60" cy="60" r="38" fill="url(#waxBaseGrad)" opacity="0.95" />
        <circle cx="60" cy="60" r="37.5" fill="none" stroke="#713f12" strokeWidth="1.2" opacity="0.7" />
        <circle cx="60" cy="60" r="35" fill="none" stroke="#fef08a" strokeWidth="0.8" opacity="0.6" />

        {/* Traditional Khmer / English Calligraphy Monogram Motif */}
        <g transform="translate(60, 60)" filter="url(#embossFilter)">
          {/* Ornate Flourish Vines Surrounding Monogram */}
          <path
            d="M-22 8 C -26 -2, -18 -18, -4 -16 C 4 -14, 2 -4, -6 -2 C -14 0, -18 12, -8 18 C 2 24, 16 16, 14 4"
            fill="none"
            stroke="url(#monogramGoldGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M -4 -16 C -2 -24, 12 -22, 16 -12 C 20 -2, 14 10, 20 18"
            fill="none"
            stroke="url(#monogramGoldGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="-6" cy="-2" r="1.8" fill="#451a03" />
          <circle cx="14" cy="4" r="1.8" fill="#451a03" />

          {/* Monogram Letters */}
          <text
            x="0"
            y="7"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Great Vibes', 'Playfair Display', serif"
            fontSize="26"
            fontWeight="bold"
            letterSpacing="0.08em"
            fill="#451a03"
            opacity="0.85"
          >
            {initials}
          </text>
          <text
            x="-0.5"
            y="6.5"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Great Vibes', 'Playfair Display', serif"
            fontSize="26"
            fontWeight="bold"
            letterSpacing="0.08em"
            fill="url(#monogramGoldGrad)"
          >
            {initials}
          </text>
        </g>
      </svg>
    </div>
  );
}

// ==========================================
// GOLDEN BOTANICAL BRANCHES (TheapKhmer Template 1 Signature Background Artwork)
// ==========================================
export function TheapKhmerBotanicalBranches() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {/* Top Left Delicate Botanical Branch */}
      <div className="absolute top-0 left-0 w-64 sm:w-72 h-80 sm:h-96 pointer-events-none opacity-85">
        <svg viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="goldVineGrad1" x1="0" y1="0" x2="240" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
          {/* Main stem sweeping down and right */}
          <path d="M -10 -10 C 20 40, 60 70, 85 130 C 110 190, 130 230, 160 280" stroke="url(#goldVineGrad1)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 40 45 C 70 60, 110 75, 140 70" stroke="url(#goldVineGrad1)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 75 110 C 120 120, 160 140, 185 160" stroke="url(#goldVineGrad1)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 110 180 C 150 200, 180 230, 200 260" stroke="url(#goldVineGrad1)" strokeWidth="1.2" strokeLinecap="round" />

          {/* Delicate Oval Leaves along Stems */}
          {[
            { cx: 30, cy: 30, rx: 7, ry: 4, rot: 35 },
            { cx: 55, cy: 50, rx: 8, ry: 4.5, rot: 45 },
            { cx: 80, cy: 60, rx: 9, ry: 5, rot: 20 },
            { cx: 110, cy: 68, rx: 8, ry: 4, rot: 15 },
            { cx: 135, cy: 68, rx: 7, ry: 3.5, rot: 0 },
            { cx: 68, cy: 95, rx: 8, ry: 4.5, rot: 55 },
            { cx: 95, cy: 115, rx: 9, ry: 5, rot: 30 },
            { cx: 130, cy: 125, rx: 8, ry: 4.5, rot: 25 },
            { cx: 155, cy: 135, rx: 7.5, ry: 4, rot: 35 },
            { cx: 180, cy: 152, rx: 7, ry: 3.5, rot: 45 },
            { cx: 98, cy: 155, rx: 8.5, ry: 4.5, rot: 60 },
            { cx: 125, cy: 185, rx: 8, ry: 4.5, rot: 40 },
            { cx: 155, cy: 205, rx: 8, ry: 4, rot: 30 },
            { cx: 180, cy: 228, rx: 7.5, ry: 3.8, rot: 45 },
            { cx: 198, cy: 252, rx: 6.5, ry: 3.5, rot: 50 },
            { cx: 145, cy: 250, rx: 7.5, ry: 4, rot: 65 },
            { cx: 158, cy: 275, rx: 7, ry: 3.5, rot: 60 },
          ].map((leaf, idx) => (
            <ellipse
              key={`tl-leaf-${idx}`}
              cx={leaf.cx}
              cy={leaf.cy}
              rx={leaf.rx}
              ry={leaf.ry}
              transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
              stroke="url(#goldVineGrad1)"
              strokeWidth="1.2"
              fill="none"
              opacity="0.9"
            />
          ))}
        </svg>
      </div>

      {/* Bottom Right Delicate Botanical Branch */}
      <div className="absolute bottom-0 right-0 w-64 sm:w-72 h-80 sm:h-96 pointer-events-none opacity-85 scale-x-[-1] scale-y-[-1]">
        <svg viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M -10 -10 C 20 40, 60 70, 85 130 C 110 190, 130 230, 160 280" stroke="url(#goldVineGrad1)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 40 45 C 70 60, 110 75, 140 70" stroke="url(#goldVineGrad1)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 75 110 C 120 120, 160 140, 185 160" stroke="url(#goldVineGrad1)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 110 180 C 150 200, 180 230, 200 260" stroke="url(#goldVineGrad1)" strokeWidth="1.2" strokeLinecap="round" />

          {[
            { cx: 30, cy: 30, rx: 7, ry: 4, rot: 35 },
            { cx: 55, cy: 50, rx: 8, ry: 4.5, rot: 45 },
            { cx: 80, cy: 60, rx: 9, ry: 5, rot: 20 },
            { cx: 110, cy: 68, rx: 8, ry: 4, rot: 15 },
            { cx: 135, cy: 68, rx: 7, ry: 3.5, rot: 0 },
            { cx: 68, cy: 95, rx: 8, ry: 4.5, rot: 55 },
            { cx: 95, cy: 115, rx: 9, ry: 5, rot: 30 },
            { cx: 130, cy: 125, rx: 8, ry: 4.5, rot: 25 },
            { cx: 155, cy: 135, rx: 7.5, ry: 4, rot: 35 },
            { cx: 180, cy: 152, rx: 7, ry: 3.5, rot: 45 },
            { cx: 98, cy: 155, rx: 8.5, ry: 4.5, rot: 60 },
            { cx: 125, cy: 185, rx: 8, ry: 4.5, rot: 40 },
            { cx: 155, cy: 205, rx: 8, ry: 4, rot: 30 },
            { cx: 180, cy: 228, rx: 7.5, ry: 3.8, rot: 45 },
            { cx: 198, cy: 252, rx: 6.5, ry: 3.5, rot: 50 },
            { cx: 145, cy: 250, rx: 7.5, ry: 4, rot: 65 },
            { cx: 158, cy: 275, rx: 7, ry: 3.5, rot: 60 },
          ].map((leaf, idx) => (
            <ellipse
              key={`br-leaf-${idx}`}
              cx={leaf.cx}
              cy={leaf.cy}
              rx={leaf.rx}
              ry={leaf.ry}
              transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
              stroke="url(#goldVineGrad1)"
              strokeWidth="1.2"
              fill="none"
              opacity="0.9"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// THEAP KHMER TEMPLATE 1 - ARCHITECTURAL INVITATION COVER OVERLAY
// (Matching theapkhmer.com/template1/invitation-cover1)
// ==========================================
export function TheapKhmerCover1ArchOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {/* Top Floral Blossom & Lantern Garland */}
      <div className="absolute top-0 inset-x-0 h-48 pointer-events-none z-20">
        <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-95">
          <defs>
            <radialGradient id="creamRoseGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#fef3c7" />
              <stop offset="70%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            <linearGradient id="hangingLanternGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <radialGradient id="lanternCandleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Left Floral Corner Garland */}
          <g transform="translate(10, -10)">
            <circle cx="25" cy="35" r="18" fill="url(#creamRoseGrad)" opacity="0.95" />
            <circle cx="55" cy="25" r="16" fill="url(#creamRoseGrad)" opacity="0.9" />
            <circle cx="45" cy="55" r="15" fill="url(#creamRoseGrad)" opacity="0.85" />
            <circle cx="80" cy="30" r="14" fill="url(#creamRoseGrad)" opacity="0.9" />
            <circle cx="75" cy="58" r="13" fill="url(#creamRoseGrad)" opacity="0.8" />
          </g>

          {/* Right Floral Corner Garland */}
          <g transform="translate(390, -10) scale(-1, 1)">
            <circle cx="25" cy="35" r="18" fill="url(#creamRoseGrad)" opacity="0.95" />
            <circle cx="55" cy="25" r="16" fill="url(#creamRoseGrad)" opacity="0.9" />
            <circle cx="45" cy="55" r="15" fill="url(#creamRoseGrad)" opacity="0.85" />
            <circle cx="80" cy="30" r="14" fill="url(#creamRoseGrad)" opacity="0.9" />
          </g>

          {/* Right Hanging Moroccan Brass Lantern with Warm Candle Light */}
          <g transform="translate(325, 45)">
            {/* Hanging Chain */}
            <line x1="16" y1="-45" x2="16" y2="0" stroke="url(#hangingLanternGold)" strokeWidth="1.5" />
            {/* Lantern Cap */}
            <polygon points="16,0 26,10 6,10" fill="url(#hangingLanternGold)" />
            {/* Lantern Glass Body */}
            <polygon points="6,10 26,10 22,38 10,38" fill="#fef9c3" opacity="0.85" stroke="url(#hangingLanternGold)" strokeWidth="1.5" />
            {/* Inner Glowing Flame */}
            <circle cx="16" cy="24" r="12" fill="url(#lanternCandleGlow)" />
            <ellipse cx="16" cy="24" rx="2.5" ry="5" fill="#ffffff" />
            {/* Lantern Base */}
            <rect x="8" y="38" width="16" height="5" rx="1" fill="url(#hangingLanternGold)" />
            <circle cx="16" cy="45" r="2.5" fill="url(#hangingLanternGold)" />
          </g>

          {/* Left Hanging Lantern */}
          <g transform="translate(55, 60) scale(0.85)">
            <line x1="16" y1="-60" x2="16" y2="0" stroke="url(#hangingLanternGold)" strokeWidth="1.5" />
            <polygon points="16,0 26,10 6,10" fill="url(#hangingLanternGold)" />
            <polygon points="6,10 26,10 22,38 10,38" fill="#fef9c3" opacity="0.85" stroke="url(#hangingLanternGold)" strokeWidth="1.5" />
            <circle cx="16" cy="24" r="12" fill="url(#lanternCandleGlow)" />
            <ellipse cx="16" cy="24" rx="2.5" ry="5" fill="#ffffff" />
            <rect x="8" y="38" width="16" height="5" rx="1" fill="url(#hangingLanternGold)" />
          </g>
        </svg>
      </div>

      {/* Classical Stepped Cream Arch Frame */}
      <svg
        viewBox="0 0 420 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full absolute inset-0 z-10 pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="theapArchBorder" x1="0" y1="0" x2="420" y2="720" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Outer Arch Contour */}
        <path
          d="M 28 720 L 28 220 C 28 100, 110 32, 210 32 C 310 32, 392 100, 392 220 L 392 720"
          stroke="url(#theapArchBorder)"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Inner Gold Hairline Contour */}
        <path
          d="M 36 720 L 36 225 C 36 110, 115 42, 210 42 C 305 42, 384 110, 384 225 L 384 720"
          stroke="#ca8a04"
          strokeWidth="1"
          strokeDasharray="4 2"
          fill="none"
          opacity="0.8"
        />
      </svg>

      {/* Bottom Pillars & Warm Candle Clusters (Matching TheapKhmer template1/invitation-cover1) */}
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-20">
        <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-95">
          <defs>
            <radialGradient id="candleFlameGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Left Pillar Base with Pillar Candles */}
          <g transform="translate(15, 45)">
            {/* Marble Base Pedestal */}
            <rect x="0" y="55" width="70" height="40" rx="3" fill="#fefce8" stroke="#d97706" strokeWidth="1.5" />
            {/* Candle 1 (Tall) */}
            <rect x="12" y="15" width="12" height="40" rx="2" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" />
            <circle cx="18" cy="10" r="9" fill="url(#candleFlameGlow)" />
            <ellipse cx="18" cy="10" rx="2" ry="4" fill="#ffffff" />

            {/* Candle 2 (Medium) */}
            <rect x="28" y="25" width="14" height="30" rx="2" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" />
            <circle cx="35" cy="20" r="8" fill="url(#candleFlameGlow)" />
            <ellipse cx="35" cy="20" rx="1.8" ry="3.5" fill="#ffffff" />

            {/* Candle 3 (Short) */}
            <rect x="46" y="35" width="12" height="20" rx="2" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" />
            <circle cx="52" cy="30" r="7" fill="url(#candleFlameGlow)" />
          </g>

          {/* Right Pillar Base with Pillar Candles */}
          <g transform="translate(385, 45) scale(-1, 1)">
            <rect x="0" y="55" width="70" height="40" rx="3" fill="#fefce8" stroke="#d97706" strokeWidth="1.5" />
            <rect x="12" y="15" width="12" height="40" rx="2" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" />
            <circle cx="18" cy="10" r="9" fill="url(#candleFlameGlow)" />
            <ellipse cx="18" cy="10" rx="2" ry="4" fill="#ffffff" />

            <rect x="28" y="25" width="14" height="30" rx="2" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" />
            <circle cx="35" cy="20" r="8" fill="url(#candleFlameGlow)" />

            <rect x="46" y="35" width="12" height="20" rx="2" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" />
            <circle cx="52" cy="30" r="7" fill="url(#candleFlameGlow)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// BEVELED RECTANGULAR OPEN BUTTON: សូមចុចបើកធៀប (Matching User Reference Image)
// ==========================================
export function RoseGoldBeveledOpenButton({
  onOpen,
  isOpening = false,
  labelKh = 'សូមចុចបើកធៀប',
  className = '',
}: {
  onOpen: () => void;
  isOpening?: boolean;
  labelKh?: string;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-col items-center select-none w-full max-w-xs sm:max-w-sm ${className}`}>
      <button
        id="open-anniversary-invitation-btn"
        type="button"
        onClick={onOpen}
        disabled={isOpening}
        className="group relative w-full py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl cursor-pointer overflow-hidden transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] drop-shadow-[0_8px_20px_rgba(136,19,55,0.28)]"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe4e6 100%)',
          border: '1.5px solid #d97706',
          boxShadow: 'inset 0 0 0 1.5px #fef08a, 0 8px 24px rgba(136,19,55,0.22)',
        }}
      >
        {/* Shimmer Light Bar */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#d97706] animate-pulse">
            <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 17.5 L6 21 L7 14 L2 9 L9 8 Z" fill="url(#btnStarGold)" stroke="#b45309" strokeWidth="0.8" />
            <defs>
              <linearGradient id="btnStarGold" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
          </svg>

          <span
            className="font-khmer-os-bokor text-base sm:text-lg tracking-wider"
            style={{
              fontFamily: "'Khmer OS Bokor', 'Bokor', display",
              color: '#881337',
              textShadow: '0 1px 2px rgba(255,255,255,0.9)',
            }}
          >
            {isOpening ? 'កំពុងបើកធៀប...' : labelKh}
          </span>

          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#d97706] animate-pulse scale-x-[-1]">
            <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 17.5 L6 21 L7 14 L2 9 L9 8 Z" fill="url(#btnStarGold)" stroke="#b45309" strokeWidth="0.8" />
          </svg>
        </div>
      </button>
    </div>
  );
}

// ==========================================================
// KHMER FILIGREE GOLD DIVIDER (Matching Screenshot (28).png)
// ==========================================================
export function FiligreeGoldOrnamentDivider({
  className = 'w-56 sm:w-72 h-6',
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${className} mx-auto select-none pointer-events-none my-1`}>
      <svg viewBox="0 0 320 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <defs>
          <linearGradient id="filigreeGoldGrad" x1="0" y1="14" x2="320" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
            <stop offset="15%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#c59b27" />
            <stop offset="85%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Horizontal center lines */}
        <line x1="10" y1="14" x2="110" y2="14" stroke="url(#filigreeGoldGrad)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="210" y1="14" x2="310" y2="14" stroke="url(#filigreeGoldGrad)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="25" y1="10" x2="100" y2="10" stroke="url(#filigreeGoldGrad)" strokeWidth="0.8" opacity="0.7" />
        <line x1="220" y1="10" x2="295" y2="10" stroke="url(#filigreeGoldGrad)" strokeWidth="0.8" opacity="0.7" />
        
        {/* Ornate Center Flourish Motif */}
        <g transform="translate(160, 14)">
          <circle cx="0" cy="0" r="3.5" fill="#fef08a" stroke="#b48432" strokeWidth="1" />
          <path d="M 0 -8 C 4 -4 6 -1 0 5 C -6 -1 -4 -4 0 -8 Z" fill="#d4af37" stroke="#854d0e" strokeWidth="0.6" />
          <path d="M 0 8 C 4 4 6 1 0 -5 C -6 1 -4 4 0 8 Z" fill="#d4af37" stroke="#854d0e" strokeWidth="0.6" />
          
          <path d="M -8 0 C -16 -8 -28 -8 -36 0 C -42 6 -38 12 -32 10 C -26 8 -24 -2 -14 -2 C -8 -2 -4 0 0 0" fill="none" stroke="url(#filigreeGoldGrad)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M -12 -3 C -20 -10 -32 -10 -40 -3" fill="none" stroke="url(#filigreeGoldGrad)" strokeWidth="1" opacity="0.8" />
          <circle cx="-32" cy="10" r="1.5" fill="#fef08a" />
          
          <path d="M 8 0 C 16 -8 28 -8 36 0 C 42 6 38 12 32 10 C 26 8 24 -2 14 -2 C 8 -2 4 0 0 0" fill="none" stroke="url(#filigreeGoldGrad)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 12 -3 C 20 -10 32 -10 40 -3" fill="none" stroke="url(#filigreeGoldGrad)" strokeWidth="1" opacity="0.8" />
          <circle cx="32" cy="10" r="1.5" fill="#fef08a" />
        </g>
      </svg>
    </div>
  );
}

function extractKhmerInitial(nameKh?: string, fallbackChar = 'ម'): string {
  if (!nameKh || !nameKh.trim()) return fallbackChar;
  const parts = nameKh.trim().split(/\s+/).filter(Boolean);
  const cleanParts = parts.filter(p => !/^(លោក|កញ្ញា|លោកស្រី|អ្នកនាង)$/.test(p));
  if (cleanParts.length >= 1) {
    const givenName = cleanParts[cleanParts.length - 1];
    if (givenName.startsWith('ម៉') || givenName.startsWith('ម')) {
      return 'ម';
    }
    const match = givenName.match(/^([\u1780-\u17b3])/);
    return match ? match[1] : givenName.charAt(0);
  }
  return fallbackChar;
}

function extractNameInitial(nameEn?: string, nameKh?: string, fallbackChar = 'M'): string {
  if (nameEn && nameEn.trim()) {
    const parts = nameEn.trim().split(/\s+/).filter(Boolean);
    const cleanParts = parts.filter(p => !/^(mr|ms|mrs|dr|miss)\.?$/i.test(p));
    if (cleanParts.length >= 2) {
      // Cambodian naming convention in Latin script: [Surname] [GivenName] -> GivenName is last word (e.g. "Ro Male" -> "Male", "Uom Volak" -> "Volak")
      const givenName = cleanParts[cleanParts.length - 1];
      return givenName.charAt(0).toUpperCase();
    } else if (cleanParts.length === 1) {
      return cleanParts[0].charAt(0).toUpperCase();
    }
  }

  if (nameKh && nameKh.trim()) {
    const parts = nameKh.trim().split(/\s+/).filter(Boolean);
    const cleanParts = parts.filter(p => !/^(លោក|កញ្ញា|លោកស្រី|អ្នកនាង)$/.test(p));
    if (cleanParts.length >= 2) {
      const givenName = cleanParts[cleanParts.length - 1];
      return givenName.charAt(0);
    } else if (cleanParts.length === 1) {
      return cleanParts[0].charAt(0);
    }
  }

  return fallbackChar;
}

// ===================================================================
// FILIGREE GOLD CIRCULAR MONOGRAM CREST (Matching Screenshot (28).png)
// ===================================================================
export function FiligreeGoldCircularMonogramCrest({
  groom,
  bride,
  groomEn,
  brideEn,
  groomInitialEn,
  brideInitialEn,
  language = 'kh',
  className = 'w-44 h-44 sm:w-52 sm:h-52',
}: {
  groom?: string;
  bride?: string;
  groomEn?: string;
  brideEn?: string;
  groomInitialEn?: string;
  brideInitialEn?: string;
  language?: string;
  className?: string;
}) {
  const isKhmer = language === 'kh';

  const gInit = isKhmer
    ? extractKhmerInitial(groom, 'ម')
    : (groomInitialEn && groomInitialEn.length === 1 ? groomInitialEn.toUpperCase() : extractNameInitial(groomEn, groom, 'M'));

  const bInit = isKhmer
    ? extractKhmerInitial(bride, 'វ')
    : (brideInitialEn && brideInitialEn.length === 1 ? brideInitialEn.toUpperCase() : extractNameInitial(brideEn, bride, 'V'));

  const letterFont = isKhmer ? "'AKbalthom Kbach', 'AKbalthom-Kbach', 'Moulpali', 'Moul', serif" : "'Great Vibes', 'Norican', cursive";
  const letterFontSize = isKhmer ? '36px' : '44px';

  return (
    <div className={`relative flex items-center justify-center ${className} select-none mx-auto drop-shadow-[0_10px_25px_rgba(180,132,50,0.4)] my-2`}>
      {/* Ambient Pulsing Gold Glow Aura */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-r from-amber-300/30 via-yellow-400/20 to-amber-500/30 blur-xl animate-pulse pointer-events-none scale-110" />

      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="crestGoldGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="20%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#b48432" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="crestLeafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b4c272" />
            <stop offset="50%" stopColor="#708238" />
            <stop offset="100%" stopColor="#3b4b1c" />
          </linearGradient>
          <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Fine Beaded Halo Ring */}
        <circle cx="100" cy="100" r="88" stroke="url(#crestGoldGrad)" strokeWidth="0.8" strokeDasharray="1.5 3" opacity="0.85" />

        {/* Outer Filigree Baroque & Botanical Olive Leaf Wreath Work (12 Radial Clusters) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
          <g key={idx} transform={`rotate(${angle} 100 100)`}>
            {/* Delicate Outer Scroll Arc */}
            <path
              d="M 100 30 C 90 18 74 22 78 36 C 81 46 94 46 100 60 C 106 46 119 46 122 36 C 126 22 110 18 100 30 Z"
              fill="none"
              stroke="url(#crestGoldGrad)"
              strokeWidth="1.8"
              strokeLinecap="round"
              filter="url(#goldGlow)"
            />
            {/* Botanical Olive-Green Leaves */}
            <path
              d="M 100 26 C 94 18 86 20 88 28 C 92 32 98 30 100 26 Z"
              fill="url(#crestLeafGrad)"
              stroke="#3b4b1c"
              strokeWidth="0.5"
            />
            <path
              d="M 100 26 C 106 18 114 20 112 28 C 108 32 102 30 100 26 Z"
              fill="url(#crestLeafGrad)"
              stroke="#3b4b1c"
              strokeWidth="0.5"
            />
            <path
              d="M 88 36 C 82 30 76 34 78 40 C 84 44 88 40 88 36 Z"
              fill="url(#crestLeafGrad)"
              stroke="#3b4b1c"
              strokeWidth="0.4"
            />
            <path
              d="M 112 36 C 118 30 124 34 122 40 C 116 44 112 40 112 36 Z"
              fill="url(#crestLeafGrad)"
              stroke="#3b4b1c"
              strokeWidth="0.4"
            />
            {/* Gold Accents & Berries */}
            <circle cx="100" cy="20" r="2.4" fill="#fef08a" stroke="#854d0e" strokeWidth="0.6" />
            <circle cx="85" cy="28" r="1.6" fill="url(#crestGoldGrad)" />
            <circle cx="115" cy="28" r="1.6" fill="url(#crestGoldGrad)" />
          </g>
        ))}

        {/* Dual Inner Gold Beveled Rings */}
        <circle cx="100" cy="100" r="54" stroke="url(#crestGoldGrad)" strokeWidth="3.2" filter="url(#goldGlow)" />
        <circle cx="100" cy="100" r="50" stroke="#708238" strokeWidth="1.2" strokeDasharray="3 2" />
        <circle cx="100" cy="100" r="46" stroke="url(#crestGoldGrad)" strokeWidth="1.5" opacity="0.95" />

        {/* Translucent Ivory background disc with soft gold rim glow */}
        <circle cx="100" cy="100" r="45" fill="#ffffff" fillOpacity="0.92" stroke="#fef08a" strokeWidth="0.8" />
      </svg>

      {/* Center Calligraphic Script Monogram: e.g. "ម & វ" or "M & V" with smooth transition */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <motion.div
          key={isKhmer ? 'khmer-crest' : 'english-crest'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex items-center justify-center font-serif font-bold"
        >
          <span
            style={{
              fontFamily: letterFont,
              fontSize: letterFontSize,
              color: '#a17417',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #854d0e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.95)) drop-shadow(0 2px 5px rgba(184,134,11,0.35))',
              lineHeight: 1,
            }}
            className="transform -translate-x-0.5 -translate-y-0.5"
          >
            {gInit}
          </span>
          <span
            style={{
              fontFamily: letterFont,
              fontSize: isKhmer ? '22px' : '28px',
              color: '#b8860b',
              margin: isKhmer ? '0 4px' : '0 3px',
              textShadow: '0 1px 2px rgba(255,255,255,0.95), 0 0 6px rgba(254,240,138,0.6)',
            }}
            className="transform translate-y-0.5 opacity-95"
          >
            &
          </span>
          <span
            style={{
              fontFamily: letterFont,
              fontSize: letterFontSize,
              color: '#a17417',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #854d0e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.95)) drop-shadow(0 2px 5px rgba(184,134,11,0.35))',
              lineHeight: 1,
            }}
            className="transform translate-x-0.5 translate-y-0.5"
          >
            {bInit}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// =================================================================
// FILIGREE GOLD PILL OPEN BUTTON (Matching Screenshot (28).png)
// =================================================================
export function FiligreeGoldPillOpenButton({
  onOpen,
  isOpening = false,
  labelKh = 'បើកលិខិតអញ្ជើញ',
  className = '',
}: {
  onOpen: () => void;
  isOpening?: boolean;
  labelKh?: string;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-col items-center select-none w-full max-w-xs sm:max-w-sm mt-3 sm:mt-4 ${className}`}>
      <button
        id="open-traditional-wedding-invitation-btn"
        type="button"
        onClick={onOpen}
        disabled={isOpening}
        className="group relative w-full py-3 sm:py-3.5 px-8 sm:px-10 rounded-full cursor-pointer overflow-hidden transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] drop-shadow-[0_8px_22px_rgba(180,132,50,0.35)]"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 50%, #fef3c7 100%)',
          border: '2px solid #c59b27',
          boxShadow: 'inset 0 0 0 1.5px #fde047, 0 8px 25px rgba(197,155,39,0.3)',
        }}
      >
        {/* Shimmer Light Bar */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          <span
            className="font-khmer-os-bokor text-base sm:text-lg tracking-wider"
            style={{
              fontFamily: "'Khmer OS Bokor', 'Bokor', display",
              color: '#926102',
              textShadow: '0 1px 2px rgba(255,255,255,0.9), 0 0 6px rgba(254,240,138,0.8)',
            }}
          >
            {isOpening ? 'កំពុងបើក...' : labelKh}
          </span>
        </div>
      </button>
    </div>
  );
}

// ===================================================================
// FILIGREE GOLD OVAL MONOGRAM CREST (Matching Screenshot (1).png)
// ===================================================================
export function FiligreeGoldOvalMonogramCrest({
  groom,
  bride,
  groomEn,
  brideEn,
  groomInitialEn,
  brideInitialEn,
  language = 'kh',
  className = 'w-44 h-56 sm:w-52 sm:h-64',
}: {
  groom?: string;
  bride?: string;
  groomEn?: string;
  brideEn?: string;
  groomInitialEn?: string;
  brideInitialEn?: string;
  language?: string;
  className?: string;
}) {
  const isKhmer = language === 'kh';

  const gInit = isKhmer
    ? extractKhmerInitial(groom, 'ក')
    : (groomInitialEn && groomInitialEn.length === 1 ? groomInitialEn.toUpperCase() : extractNameInitial(groomEn, groom, 'K'));

  const bInit = isKhmer
    ? extractKhmerInitial(bride, 'ស')
    : (brideInitialEn && brideInitialEn.length === 1 ? brideInitialEn.toUpperCase() : extractNameInitial(brideEn, bride, 'S'));

  const letterFont = isKhmer ? "'AKbalthom Kbach', 'AKbalthom-Kbach', 'Moul', serif" : "'Playfair Display', 'Cinzel', serif";

  return (
    <div className={`relative flex items-center justify-center ${className} select-none mx-auto drop-shadow-[0_12px_28px_rgba(197,155,39,0.35)] my-2`}>
      <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="crestGoldGradOval" x1="0" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="20%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#b48432" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <filter id="goldGlowOval" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Filigree Oval Baroque Scroll Frame Flourishes */}
        <g stroke="url(#crestGoldGradOval)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#goldGlowOval)">
          {/* Top Flourish Crown */}
          <path d="M 100 25 C 92 12 75 14 80 28 C 84 38 94 38 100 52 C 106 38 116 38 120 28 C 125 14 108 12 100 25 Z" />
          <path d="M 85 32 C 75 25 65 35 75 45 C 80 48 90 48 95 55" />
          <path d="M 115 32 C 125 25 135 35 125 45 C 120 48 110 48 105 55" />
          
          {/* Bottom Flourish */}
          <path d="M 100 215 C 92 228 75 226 80 212 C 84 202 94 202 100 188 C 106 202 116 202 120 212 C 125 226 108 228 100 215 Z" />
          <path d="M 85 208 C 75 215 65 205 75 195 C 80 192 90 192 95 185" />
          <path d="M 115 208 C 125 215 135 205 125 195 C 120 192 110 192 105 185" />

          {/* Left & Right Side Swirls */}
          <path d="M 45 120 C 35 110 35 90 48 98 C 55 102 55 115 62 120 C 55 125 55 138 48 142 C 35 150 35 130 45 120 Z" />
          <path d="M 155 120 C 165 110 165 90 152 98 C 145 102 145 115 138 120 C 145 125 145 138 152 142 C 165 150 165 130 155 120 Z" />
        </g>

        {/* Triple Beveled Oval Rings */}
        <ellipse cx="100" cy="120" rx="46" ry="64" stroke="url(#crestGoldGradOval)" strokeWidth="3" filter="url(#goldGlowOval)" />
        <ellipse cx="100" cy="120" rx="42" ry="60" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 2" />
        <ellipse cx="100" cy="120" rx="38" ry="56" stroke="url(#crestGoldGradOval)" strokeWidth="1.5" opacity="0.9" />

        {/* Soft Translucent Ivory Background Fill */}
        <ellipse cx="100" cy="120" rx="37" ry="55" fill="#ffffff" fillOpacity="0.95" />
      </svg>

      {/* Elegant Diagonally Placed Gold Monogram Initials with Ampersand */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <motion.div
          key={isKhmer ? 'khmer-oval-crest' : 'english-oval-crest'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-28 h-36 flex items-center justify-center"
        >
          {/* First Initial (Top-Left) */}
          <span
            style={{
              fontFamily: letterFont,
              fontSize: isKhmer ? '36px' : '44px',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #854d0e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.95)) drop-shadow(0 2px 4px rgba(184,134,11,0.3))',
            }}
            className="absolute top-6 left-5 font-bold"
          >
            {gInit}
          </span>

          {/* Golden Elegant Ampersand (Center) */}
          <span
            style={{
              fontFamily: letterFont,
              fontSize: isKhmer ? '20px' : '24px',
              color: '#b8860b',
              textShadow: '0 1px 2px rgba(255,255,255,0.95)',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90"
          >
            &
          </span>

          {/* Second Initial (Bottom-Right) */}
          <span
            style={{
              fontFamily: letterFont,
              fontSize: isKhmer ? '36px' : '44px',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #854d0e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.95)) drop-shadow(0 2px 4px rgba(184,134,11,0.3))',
            }}
            className="absolute bottom-6 right-5 font-bold"
          >
            {bInit}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// ===================================================================
// MODERN WEDDING CRYSTAL OCTAGON CREST (Matching Screenshot (3).png)
// ===================================================================
export function ModernWeddingCrystalOctagonCrest({
  groom,
  bride,
  groomEn,
  brideEn,
  groomInitialEn,
  brideInitialEn,
  language = 'kh',
  className = 'w-24 h-24 sm:w-28 sm:h-28',
}: {
  groom?: string;
  bride?: string;
  groomEn?: string;
  brideEn?: string;
  groomInitialEn?: string;
  brideInitialEn?: string;
  language?: string;
  className?: string;
}) {
  const isKhmer = language === 'kh';

  const gInit = isKhmer
    ? extractKhmerInitial(groom, 'ដ')
    : (groomInitialEn && groomInitialEn.length === 1 ? groomInitialEn.toUpperCase() : extractNameInitial(groomEn, groom, 'D'));

  const bInit = isKhmer
    ? extractKhmerInitial(bride, 'ប')
    : (brideInitialEn && brideInitialEn.length === 1 ? brideInitialEn.toUpperCase() : extractNameInitial(brideEn, bride, 'B'));

  const letterFont = isKhmer ? "'AKbalthom Kbach', 'AKbalthom-Kbach', 'Moul', serif" : "'Great Vibes', 'Norican', cursive";

  return (
    <div className={`relative flex items-center justify-center ${className} select-none mx-auto drop-shadow-[0_8px_20px_rgba(212,175,55,0.4)] my-1`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="octGoldGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="75%" stopColor="#b48432" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <filter id="goldOctGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Filigree Octagonal Border */}
        <polygon points="60,8 98,22 112,60 98,98 60,112 22,98 8,60 22,22" stroke="url(#octGoldGrad)" strokeWidth="2" filter="url(#goldOctGlow)" fill="none" />
        <polygon points="60,12 94,25 108,60 94,95 60,108 26,95 12,60 26,25" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="2 1.5" fill="none" />
        <polygon points="60,16 90,28 104,60 90,92 60,104 30,92 16,60 30,28" stroke="url(#octGoldGrad)" strokeWidth="1.2" opacity="0.9" fill="#ffffff" fillOpacity="0.88" />

        {/* Outer Corner Ornate Jewels */}
        <circle cx="60" cy="8" r="2" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
        <circle cx="60" cy="112" r="2" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
        <circle cx="8" cy="60" r="2" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
        <circle cx="112" cy="60" r="2" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
      </svg>

      {/* Center Initials (e.g. ដ & ប / D & B) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        <div className="flex items-center justify-center font-bold">
          <span
            style={{
              fontFamily: letterFont,
              fontSize: isKhmer ? '22px' : '26px',
              color: '#854d0e',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 60%, #78350f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 1px rgba(255,255,255,0.9)',
            }}
          >
            {gInit}
          </span>
          <span className="text-[11px] text-[#b8860b] mx-0.5 opacity-90">&</span>
          <span
            style={{
              fontFamily: letterFont,
              fontSize: isKhmer ? '22px' : '26px',
              color: '#854d0e',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 60%, #78350f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 1px rgba(255,255,255,0.9)',
            }}
          >
            {bInit}
          </span>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// FULL CRYSTAL ROCOCO BORDER FRAME (Matching Screenshot (3).png)
// ===================================================================
export function ModernWeddingFullCrystalRococoFrame({ className = 'absolute inset-0' }: { className?: string }) {
  return (
    <div className={`${className} pointer-events-none z-10 select-none overflow-hidden`}>
      <svg viewBox="0 0 400 700" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="rococoGoldGrad" x1="0" y1="0" x2="400" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="20%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#d4af37" />
            <stop offset="75%" stopColor="#b48432" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="crystalShimmerGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#e0f2fe" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#fbcfe8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="lotusPetalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>

          <filter id="crystalGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Double Gold Filigree Outer Frame Border */}
        <rect x="14" y="14" width="372" height="672" rx="24" stroke="url(#rococoGoldGrad)" strokeWidth="3" fill="none" />
        <rect x="20" y="20" width="360" height="660" rx="18" stroke="#d4af37" strokeWidth="1" strokeDasharray="4 2" fill="none" />
        <rect x="24" y="24" width="352" height="652" rx="14" stroke="url(#rococoGoldGrad)" strokeWidth="1.5" opacity="0.85" fill="none" />

        {/* Top Center Pedestal Crown with Pointed Marquise Diamond Crystal (Screenshot 3) */}
        <g transform="translate(200, 36)" filter="url(#crystalGlowFilter)">
          <path d="M -30 -12 C -20 -28 20 -28 30 -12 C 25 -4 18 -8 0 -2 C -18 -8 -25 -4 -30 -12 Z" fill="url(#rococoGoldGrad)" stroke="#78350f" strokeWidth="0.8" />
          <path d="M 0 -28 L 14 -4 L 0 20 L -14 -4 Z" fill="url(#crystalShimmerGrad)" stroke="#ffffff" strokeWidth="1.2" />
          <path d="M 0 -28 L 0 20 M -14 -4 L 14 -4 M -14 -4 L 0 -12 L 14 -4 M -14 -4 L 0 6 L 14 -4" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
        </g>

        {/* Top Draped Bead Chains & Hanging Teardrop Crystals */}
        <path d="M 60 40 Q 130 65 200 40 Q 270 65 340 40" stroke="url(#rococoGoldGrad)" strokeWidth="1.2" strokeDasharray="2 3" fill="none" />
        <path d="M 90 44 Q 145 75 200 48 Q 255 75 310 44" stroke="url(#rococoGoldGrad)" strokeWidth="1" strokeDasharray="1.5 2.5" fill="none" />

        {/* Hanging Teardrop Crystal Pendants */}
        {[70, 120, 160, 240, 280, 330].map((x, idx) => (
          <g key={`drop-${idx}`} transform={`translate(${x}, 52)`}>
            <line x1="0" y1="0" x2="0" y2="12" stroke="url(#rococoGoldGrad)" strokeWidth="0.8" />
            <polygon points="0,12 3.5,18 0,26 -3.5,18" fill="url(#crystalShimmerGrad)" stroke="#ffffff" strokeWidth="0.6" />
          </g>
        ))}

        {/* Bottom Left Corner: Large Crystal Cluster & Golden Swirls (Screenshot 3) */}
        <g transform="translate(20, 520)" filter="url(#crystalGlowFilter)">
          <path d="M 0 140 C 40 140 70 120 80 80 C 85 50 65 30 40 40 C 20 48 30 75 50 65 C 65 55 55 35 35 45" fill="none" stroke="url(#rococoGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="35,120 50,40 75,70 55,130" fill="url(#crystalShimmerGrad)" stroke="#ffffff" strokeWidth="1" />
          <polygon points="55,130 75,70 100,90 75,140" fill="url(#crystalShimmerGrad)" stroke="#ffffff" strokeWidth="1" />
          <polygon points="15,135 35,70 50,120" fill="url(#crystalShimmerGrad)" stroke="#ffffff" strokeWidth="1" />
          <g transform="translate(85, 110)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
              <path key={i} transform={`rotate(${a})`} d="M 0 0 C -8 -15 -4 -25 0 -30 C 4 -25 8 -15 0 0 Z" fill="url(#lotusPetalGrad)" stroke="#d4af37" strokeWidth="0.5" />
            ))}
            <circle cx="0" cy="0" r="4" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
          </g>
        </g>

        {/* Bottom Right Corner: Large Crystal Cluster & Golden Swirls (Screenshot 3) */}
        <g transform="translate(380, 520) scale(-1, 1)" filter="url(#crystalGlowFilter)">
          <path d="M 0 140 C 40 140 70 120 80 80 C 85 50 65 30 40 40 C 20 48 30 75 50 65 C 65 55 55 35 35 45" fill="none" stroke="url(#rococoGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="35,120 50,40 75,70 55,130" fill="url(#crystalShimmerGrad)" stroke="#ffffff" strokeWidth="1" />
          <polygon points="55,130 75,70 100,90 75,140" fill="url(#crystalShimmerGrad)" stroke="#ffffff" strokeWidth="1" />
          <polygon points="15,135 35,70 50,120" fill="url(#crystalShimmerGrad)" stroke="#ffffff" strokeWidth="1" />
          <g transform="translate(85, 110)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
              <path key={i} transform={`rotate(${a})`} d="M 0 0 C -8 -15 -4 -25 0 -30 C 4 -25 8 -15 0 0 Z" fill="url(#lotusPetalGrad)" stroke="#d4af37" strokeWidth="0.5" />
            ))}
            <circle cx="0" cy="0" r="4" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
          </g>
        </g>

        {/* Top Left & Right Corner Lotus Flowers */}
        <g transform="translate(45, 45)" filter="url(#crystalGlowFilter)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <path key={i} transform={`rotate(${a})`} d="M 0 0 C -6 -12 -3 -20 0 -24 C 3 -20 6 -12 0 0 Z" fill="url(#lotusPetalGrad)" stroke="#d4af37" strokeWidth="0.5" />
          ))}
          <circle cx="0" cy="0" r="3" fill="#fef08a" />
        </g>
        <g transform="translate(355, 45)" filter="url(#crystalGlowFilter)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <path key={i} transform={`rotate(${a})`} d="M 0 0 C -6 -12 -3 -20 0 -24 C 3 -20 6 -12 0 0 Z" fill="url(#lotusPetalGrad)" stroke="#d4af37" strokeWidth="0.5" />
          ))}
          <circle cx="0" cy="0" r="3" fill="#fef08a" />
        </g>
      </svg>
    </div>
  );
}

// ===================================================================
// MODERN WEDDING FLORAL CALENDAR COVER (Matching download.jfif)
// ===================================================================
export function ModernWeddingFloralCalendarCover({
  groom = 'ជា ដារ៉ា',
  bride = 'សុខ បុប្ផា',
  groomEn = 'Chea Dara',
  brideEn = 'Sok Bopha',
  dateKh = 'ថ្ងៃព្រហស្បតិ៍ ទី១២ ខែមីនា ឆ្នាំ២០២៦',
  timeKh = 'វេលាម៉ោង ៥:00 ល្ងាច',
  locationKh = 'សណ្ឋាគារ សូហ្វីតែល ភ្នំពេញ ភូគីត្រា',
  guestName = 'មិត្តសម្លាញ់រស់សាយទាង 2 ឧត្តមស្វាមី',
  language = 'kh',
  onOpenInvitation,
  isOpening = false,
}: {
  groom?: string;
  bride?: string;
  groomEn?: string;
  brideEn?: string;
  dateKh?: string;
  timeKh?: string;
  locationKh?: string;
  guestName?: string;
  language?: string;
  onOpenInvitation?: () => void;
  isOpening?: boolean;
}) {
  return (
    <div className="relative w-full h-full min-h-[640px] sm:min-h-[700px] flex flex-col justify-between items-center text-center p-4 sm:p-6 bg-white/95 text-neutral-900 rounded-[28px] overflow-hidden select-none border border-[#d4af37]/40 shadow-2xl">
      {/* Top Left White Roses & Top Right Pink Roses */}
      <div className="absolute top-0 left-0 w-36 sm:w-44 h-36 sm:h-44 pointer-events-none z-10">
        <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-top-left.png" className="w-full h-full object-contain filter brightness-105" alt="" />
      </div>
      <div className="absolute top-0 right-0 w-36 sm:w-44 h-36 sm:h-44 pointer-events-none z-10">
        <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-top-right.png" className="w-full h-full object-contain filter hue-rotate-[320deg] brightness-105" alt="" />
      </div>

      {/* Bottom Left & Right Large Bouquet of White Roses & Gold Leaf Accents */}
      <div className="absolute bottom-0 left-0 w-40 sm:w-48 h-40 sm:h-48 pointer-events-none z-10">
        <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-bottom-left.png" className="w-full h-full object-contain filter brightness-110 saturate-125" alt="" />
      </div>
      <div className="absolute bottom-0 right-0 w-44 sm:w-52 h-44 sm:h-52 pointer-events-none z-10">
        <img src="https://focuz-staging-space.sgp1.cdn.digitaloceanspaces.com/plan-essential/template/free/template-1/contents/peony-bottom-right.png" className="w-full h-full object-contain filter brightness-110 saturate-125" alt="" />
      </div>

      {/* Section 1: Header Titles with Golden Scroll Heart Emblem */}
      <div className="relative z-20 pt-2 sm:pt-4 flex flex-col items-center w-full">
        {/* Top Heart Golden Scroll Flourish Emblem */}
        <div className="w-20 sm:w-24 h-6 text-[#d4af37] my-1">
          <svg viewBox="0 0 100 24" fill="none" className="w-full h-full">
            <path d="M 10 12 Q 30 2 50 12 Q 70 2 90 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 50 4 C 42 -4 30 8 50 20 C 70 8 58 -4 50 4 Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <h1
          className="text-lg sm:text-2xl font-akbalthom-kbach font-bold tracking-wide text-[#1c1917] my-0.5"
          style={{ fontFamily: "'AKbalthom Kbach', 'AKbalthom-Kbach', 'Moul', serif" }}
        >
          {language === 'kh' ? 'សិរីមង្គលអាពាហ៍ពិពាហ៍' : 'Auspicious Wedding Celebration'}
        </h1>

        <span
          className="text-lg sm:text-2xl text-neutral-800 tracking-wide font-serif italic"
          style={{ fontFamily: "'Norican', 'Great Vibes', cursive" }}
        >
          The wedding day
        </span>
      </div>

      {/* Section 2: Groom & Bride Names Column Grid */}
      <div className="relative z-20 my-2 w-full max-w-xs sm:max-w-sm flex items-center justify-between px-2">
        {/* Groom */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-[11px] font-khmer text-rose-800 font-semibold">{language === 'kh' ? 'កូនប្រុសនាម' : 'Groom'}</span>
          <span className="text-sm sm:text-base font-akbalthom-kbach font-bold text-neutral-900 mt-0.5">{groom || 'តឿន សុខនី'}</span>
        </div>

        {/* Center Flame Drop Locket */}
        <div className="mx-2 flex flex-col items-center">
          <div className="w-6 h-8 text-[#b8860b] flex items-center justify-center">
            <svg viewBox="0 0 24 32" fill="none" className="w-full h-full">
              <path d="M 12 2 C 6 12 2 18 2 22 C 2 28 6.5 30 12 30 C 17.5 30 22 28 22 22 C 22 18 18 12 12 2 Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
              <circle cx="12" cy="20" r="3" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Bride */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-[11px] font-khmer text-rose-800 font-semibold">{language === 'kh' ? 'កូនស្រីនាម' : 'Bride'}</span>
          <span className="text-sm sm:text-base font-akbalthom-kbach font-bold text-neutral-900 mt-0.5">{bride || 'ពិន សុជាតា'}</span>
        </div>
      </div>

      {/* Section 3: Date, Time & Venue Details */}
      <div className="relative z-20 my-1 flex flex-col items-center space-y-0.5 max-w-xs sm:max-w-sm px-2 text-center text-xs font-khmer text-neutral-800 leading-snug">
        <p className="font-bold text-neutral-900">
          {dateKh || 'ថ្ងៃព្រហស្បតិ៍ ទី១២ ខែមីនា ឆ្នាំ២០២៦'} {timeKh || 'វេលាម៉ោង ៥:០០ ល្ងាច'}
        </p>
        <p className="opacity-90">
          {locationKh || 'ស្ថិតនៅគេហដ្ឋានខាងស្រី ភូមិកណ្តាល ឃុំវិហារលួង'}
        </p>
      </div>

      {/* Section 4: Guest Invitation Plaque */}
      <div className="relative z-20 my-2 w-full max-w-xs sm:max-w-sm flex flex-col items-center">
        <span className="text-xs sm:text-sm font-akbalthom-kbach font-bold text-neutral-900 mb-1">
          {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
        </span>

        {/* Curved Filigree Gold Arch Container */}
        <div className="relative w-full py-2 px-4 flex flex-col items-center">
          {/* Top Double Curved Gold Arch */}
          <div className="w-48 sm:w-56 h-3 text-[#d4af37] mb-1">
            <svg viewBox="0 0 160 12" fill="none" className="w-full h-full">
              <path d="M 0 10 Q 80 0 160 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M 20 6 Q 80 -2 140 6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
            </svg>
          </div>

          <span className="font-akbalthom-kbach text-xs sm:text-sm font-bold text-amber-950 text-center tracking-wide my-0.5 px-2">
            {guestName || 'មិត្តសម្លាញ់រស់សាយទាង 2 ឧត្តមស្វាមី'}
          </span>

          {/* Bottom Double Curved Gold Arch */}
          <div className="w-48 sm:w-56 h-3 text-[#d4af37] mt-1 rotate-180">
            <svg viewBox="0 0 160 12" fill="none" className="w-full h-full">
              <path d="M 0 10 Q 80 0 160 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M 20 6 Q 80 -2 140 6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Section 5: Cute Bride & Groom Illustration + Mini March Calendar Grid */}
      <div className="relative z-20 my-1 w-full max-w-xs sm:max-w-sm flex items-end justify-between px-2 gap-2">
        {/* Cute Groom holding Bride's veil Illustration */}
        <div className="relative w-28 sm:w-32 h-20 sm:h-24 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
            {/* Cartoon Groom */}
            <circle cx="30" cy="30" r="10" fill="#374151" />
            <path d="M 20 50 L 40 50 L 35 75 L 25 75 Z" fill="#1f2937" />
            <path d="M 22 42 L 30 42 L 28 50 Z" fill="#ffffff" />
            
            {/* Veil Line being held */}
            <path d="M 38 40 Q 60 48 80 35" stroke="#e5e7eb" strokeWidth="3" strokeDasharray="3 1" />
            
            {/* Cartoon Bride */}
            <circle cx="90" cy="28" r="9" fill="#fbcfe8" />
            <path d="M 80 45 Q 90 35 100 45 L 105 75 L 75 75 Z" fill="#ffffff" stroke="#f472b6" strokeWidth="1" />
            <path d="M 85 20 Q 95 12 105 25 Q 95 40 80 40 Z" fill="#ffffff" fillOpacity="0.8" />
          </svg>
        </div>

        {/* Date / Time Clock & Mini Calendar Grid */}
        <div className="flex flex-col items-end text-right font-mono text-[10px] text-neutral-800 space-y-1">
          <div className="flex items-center gap-1 text-amber-800 font-bold">
            <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[8px]">🕒</span>
            <span>12/03/2026 Time 5:00pm</span>
          </div>

          {/* March Mini Calendar Grid */}
          <div className="bg-white/80 p-1.5 rounded-lg border border-amber-300/60 shadow-xs flex flex-col items-center">
            <span className="font-serif italic font-bold text-xs text-neutral-900 mb-0.5">March</span>
            <div className="grid grid-cols-7 gap-0.5 text-[8px] text-center font-bold">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
              <span>8</span><span>9</span><span>10</span><span>11</span>
              {/* Highlight Date 12 with a Golden Heart */}
              <span className="relative font-black text-amber-700">
                12
                <span className="absolute inset-0 -m-0.5 border border-amber-500 rounded-full bg-amber-200/50" />
              </span>
              <span>13</span><span>14</span>
              <span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span><span>21</span>
              <span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27</span><span>28</span>
              <span>29</span><span>30</span><span>31</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Open Invitation Button */}
      {onOpenInvitation && (
        <div className="relative z-20 pt-2 pb-1 w-full max-w-xs sm:max-w-sm flex justify-center">
          <ModernWeddingScallopedOpenButton
            onOpen={onOpenInvitation}
            isOpening={isOpening}
            labelKh={language === 'kh' ? 'បើកលិខិតអញ្ជើញ' : 'Open Invitation'}
          />
        </div>
      )}
    </div>
  );
}
export function ShapedTitleText({
  text,
  shape = 'straight',
  className = '',
  style = {},
  fontFamily,
  color = '#b8860b',
}: {
  text: string;
  shape?: 'straight' | 'arch-up' | 'arch-down' | 'wave';
  className?: string;
  style?: React.CSSProperties;
  fontFamily?: string;
  color?: string;
}) {
  const uid = React.useId().replace(/:/g, '');
  const pathId = `titlePath-${uid}`;
  const gradId = `titleGrad-${uid}`;
  const filterId = `titleFilter-${uid}`;

  let pathD = 'M 15 62 Q 200 12 385 62'; // arch-up
  if (shape === 'arch-down') {
    pathD = 'M 15 15 Q 200 68 385 15';
  } else if (shape === 'wave') {
    pathD = 'M 15 42 Q 110 10 200 42 T 385 42';
  }

  const effectiveFontFamily = fontFamily || "'Khmer OS Bokor', 'Bokor', 'Moul', 'AKbalthom Kbach', serif";

  return (
    <h1
      className={`relative w-full max-w-[340px] sm:max-w-[420px] mx-auto select-none my-1 flex justify-center items-center text-center text-xl sm:text-2xl md:text-3xl font-bold tracking-wide ${className}`}
      style={{
        fontFamily: effectiveFontFamily,
        color: color,
        ...style,
      }}
    >
      {shape === 'straight' || !shape ? (
        <span
          style={{
            fontFamily: effectiveFontFamily,
            color: color,
          }}
        >
          {text}
        </span>
      ) : (
        <div className="w-full h-auto overflow-visible">
          <svg viewBox="0 0 400 85" className="w-full h-auto overflow-visible">
            <defs>
              <path id={pathId} d={pathD} fill="none" />
            </defs>
            <text
              fill={color || '#b8860b'}
              style={{
                fontFamily: effectiveFontFamily,
                fontSize: text.length > 25 ? '20px' : text.length > 18 ? '24px' : '28px',
                fontWeight: 'bold',
                letterSpacing: '1px',
              }}
            >
              <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                {text}
              </textPath>
            </text>
          </svg>
        </div>
      )}
    </h1>
  );
}

// =========================================================================
// WEDDING INVITATION TEMPLATE: WHITE DOVES, WATERCOLOR BLUE FLORA & GOLD ROSETTES
// (Faithfully matching uploaded template design)
// =========================================================================

// Traditional Khmer Golden 4-Petal Rosette (ផ្កាច័ន្ទមាស)
export function KhmerGoldenRosette({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} filter drop-shadow-[0_3px_6px_rgba(180,120,20,0.45)]`}>
      <defs>
        <radialGradient id="rosetteGoldCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="35%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <linearGradient id="rosettePetalGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8db" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="85%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>
      {/* 4 Petals rotated at 0, 90, 180, 270 degrees */}
      {[0, 90, 180, 270].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 50 50)`}>
          {/* Outer Petal Silhouette with Embossed Ridges */}
          <path
            d="M 50 10 C 56 21 68 31 68 40 C 68 47 61 50 50 50 C 39 50 32 47 32 40 C 32 31 44 21 50 10 Z"
            fill="url(#rosettePetalGold)"
            stroke="#78350f"
            strokeWidth="1.5"
          />
          {/* Inner Petal Bevel Ridge */}
          <path
            d="M 50 15 C 54 24 63 32 63 40 C 63 45 57 47 50 47 C 43 47 37 45 37 40 C 37 32 46 24 50 15 Z"
            fill="none"
            stroke="#fff8db"
            strokeWidth="1.2"
            opacity="0.9"
          />
          {/* Central Ridge Spine */}
          <line x1="50" y1="12" x2="50" y2="45" stroke="#78350f" strokeWidth="0.8" opacity="0.6" />
          {/* Pointed Tip Diamond Bead */}
          <polygon points="50,2 54,8 50,13 46,8" fill="url(#rosettePetalGold)" stroke="#78350f" strokeWidth="0.8" />
          {/* Diagonal Corner Bead at 45 deg */}
          <circle cx="71" cy="29" r="3.2" fill="url(#rosetteGoldCenter)" stroke="#78350f" strokeWidth="0.8" />
        </g>
      ))}
      {/* Outer Center Ring */}
      <circle cx="50" cy="50" r="16.5" fill="url(#rosetteGoldCenter)" stroke="#78350f" strokeWidth="1.4" />
      {/* Beaded Decorative Ring */}
      <circle cx="50" cy="50" r="13" stroke="#fff8db" strokeWidth="1.4" strokeDasharray="2.5 2.5" fill="none" />
      {/* Inner Central Raised Pearl */}
      <circle cx="50" cy="50" r="9.5" fill="url(#rosetteGoldCenter)" stroke="#854d0e" strokeWidth="1.2" />
      <circle cx="48" cy="48" r="2.5" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}

// Watercolor Slate-Blue Flowers & Sage Eucalyptus Corner Clustered Foliage
export function WatercolorBlueFloraCorner({
  position,
  className = '',
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}) {
  const isTop = position.startsWith('top');
  const isLeft = position.endsWith('left');

  return (
    <div
      className={`absolute ${position.includes('top') ? 'top-0' : 'bottom-0'} ${position.includes('left') ? 'left-0' : 'right-0'} pointer-events-none z-10 ${className}`}
      style={{
        transform: `${!isLeft ? 'scaleX(-1)' : ''} ${!isTop ? 'scaleY(-1)' : ''}`.trim() || undefined,
      }}
    >
      <svg
        viewBox="0 0 240 240"
        className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`petalBlue1-${position}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f0f6fa" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#bfd4e6" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#7e9ebb" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4f6e8b" stopOpacity="0.98" />
          </radialGradient>
          <radialGradient id={`petalBlue2-${position}`} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e2edf7" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#96b2ca" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#415d78" stopOpacity="0.98" />
          </radialGradient>
          <linearGradient id={`eucalyptusGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b4ceba" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#82a188" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#55755d" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={`stamenGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* --- Eucalyptus Branches & Sage Leaves --- */}
        <g opacity="0.9">
          {/* Main Curved Twigs */}
          <path d="M 0 0 C 45 35, 90 90, 130 185" stroke="#637666" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 35 30 C 80 42, 145 65, 205 105" stroke="#637666" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 90 95 C 145 130, 175 165, 205 220" stroke="#637666" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Eucalyptus Leaf Disks */}
          <ellipse cx="75" cy="45" rx="16" ry="11" transform="rotate(25 75 45)" fill="url(#eucalyptusGrad-${position})" stroke="#55755d" strokeWidth="0.6" />
          <ellipse cx="120" cy="62" rx="18" ry="12" transform="rotate(35 120 62)" fill="url(#eucalyptusGrad-${position})" stroke="#55755d" strokeWidth="0.6" />
          <ellipse cx="165" cy="88" rx="19" ry="13" transform="rotate(45 165 88)" fill="url(#eucalyptusGrad-${position})" stroke="#55755d" strokeWidth="0.6" />
          <ellipse cx="195" cy="118" rx="17" ry="11" transform="rotate(55 195 118)" fill="url(#eucalyptusGrad-${position})" stroke="#55755d" strokeWidth="0.6" />
          <ellipse cx="105" cy="135" rx="18" ry="12" transform="rotate(65 105 135)" fill="url(#eucalyptusGrad-${position})" stroke="#55755d" strokeWidth="0.6" />
          <ellipse cx="130" cy="175" rx="17" ry="11" transform="rotate(75 130 175)" fill="url(#eucalyptusGrad-${position})" stroke="#55755d" strokeWidth="0.6" />
          <ellipse cx="165" cy="155" rx="16" ry="10" transform="rotate(40 165 155)" fill="url(#eucalyptusGrad-${position})" stroke="#55755d" strokeWidth="0.6" />
        </g>

        {/* --- Blooming Dusty Blue Watercolor Peony --- */}
        <g transform="translate(15, 15)">
          {/* Outer Layer of Translucent Petals */}
          <path d="M 55 12 C 85 -5, 110 18, 92 48 C 75 42, 62 30, 55 12 Z" fill="url(#petalBlue1-${position})" opacity="0.85" />
          <path d="M 92 35 C 128 22, 145 52, 110 82 C 98 65, 92 48, 92 35 Z" fill="url(#petalBlue2-${position})" opacity="0.88" />
          <path d="M 85 82 C 115 100, 98 135, 62 118 C 68 100, 80 88, 85 82 Z" fill="url(#petalBlue1-${position})" opacity="0.88" />
          <path d="M 40 100 C 22 130, -8 112, 12 82 C 24 88, 35 95, 40 100 Z" fill="url(#petalBlue2-${position})" opacity="0.88" />
          <path d="M 8 58 C -15 35, 8 5, 36 28 C 24 40, 12 48, 8 58 Z" fill="url(#petalBlue1-${position})" opacity="0.85" />

          {/* Mid Layer Petals */}
          <path d="M 52 30 C 75 18, 92 35, 80 58 C 64 52, 58 42, 52 30 Z" fill="url(#petalBlue2-${position})" opacity="0.92" />
          <path d="M 75 52 C 98 58, 92 88, 70 88 C 64 70, 70 58, 75 52 Z" fill="url(#petalBlue1-${position})" opacity="0.94" />
          <path d="M 58 75 C 52 98, 30 92, 30 70 C 40 64, 52 70, 58 75 Z" fill="url(#petalBlue2-${position})" opacity="0.92" />
          <path d="M 30 58 C 18 40, 35 22, 52 40 C 40 46, 35 52, 30 58 Z" fill="url(#petalBlue1-${position})" opacity="0.94" />

          {/* Deep Core Center */}
          <circle cx="56" cy="56" r="19" fill="url(#petalBlue2-${position})" opacity="0.96" />
          <circle cx="56" cy="56" r="13" fill="#2d455d" opacity="0.9" />

          {/* Warm Golden Stamens Cluster */}
          <g fill="url(#stamenGrad-${position})">
            <circle cx="56" cy="56" r="3.4" />
            <circle cx="50" cy="52" r="2.2" />
            <circle cx="62" cy="53" r="2.3" />
            <circle cx="54" cy="62" r="2.2" />
            <circle cx="61" cy="60" r="2.1" />
            <circle cx="51" cy="59" r="1.9" />
            <circle cx="58" cy="49" r="2" />
            <circle cx="46" cy="55" r="1.7" />
            <circle cx="65" cy="56" r="1.8" />
          </g>
        </g>

        {/* Secondary Delicate Peony Bud */}
        <g transform="translate(88, 8) scale(0.72)" opacity="0.92">
          <ellipse cx="34" cy="34" rx="23" ry="18" fill="url(#petalBlue1-${position})" />
          <ellipse cx="36" cy="32" rx="16" ry="13" fill="url(#petalBlue2-${position})" />
          <circle cx="37" cy="32" r="4.5" fill="url(#stamenGrad-${position})" />
        </g>
      </svg>
    </div>
  );
}

// Two White Wedding Doves in Flight Sharing a Coral-Peach Heart
export function WeddingDovesWithHeart({ className = 'w-48 sm:w-56 h-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 130"
      className={`${className} overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="doveShadingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="75%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="heartCoralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="40%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>

      {/* --- Center Shared Coral Heart --- */}
      <g transform="translate(120, 60)">
        <path
          d="M 0 16 C -18 4, -22 -14, -8 -16 C -1 -17, 0 -8, 0 -6 C 0 -8, 1 -17, 8 -16 C 22 -14, 18 4, 0 16 Z"
          fill="url(#heartCoralGrad)"
          stroke="#1e293b"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Subtle Heart Highlight */}
        <path
          d="M -6 -11 C -12 -10, -14 0, -4 8"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
      </g>

      {/* --- Left Dove in Flight (Facing Right) --- */}
      <g>
        {/* Left Wing (Spread Upward with Feather Lines) */}
        <path
          d="M 75 52 C 72 40, 65 25, 45 10 C 44 14, 46 22, 50 28 C 45 28, 42 32, 45 37 C 49 42, 52 46, 56 48 C 50 49, 47 54, 52 58 C 57 62, 65 65, 75 62 Z"
          fill="url(#doveShadingGrad)"
          stroke="#1e293b"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Wing Feather Ridges */}
        <path d="M 48 20 C 54 28, 62 42, 68 50" stroke="#1e293b" strokeWidth="1.2" fill="none" />
        <path d="M 52 35 C 58 42, 64 50, 70 54" stroke="#1e293b" strokeWidth="1.2" fill="none" />
        <path d="M 58 48 C 64 54, 70 58, 74 60" stroke="#1e293b" strokeWidth="1.2" fill="none" />

        {/* Dove Body, Head, Beak */}
        <path
          d="M 68 62 C 60 72, 40 85, 20 86 C 28 80, 32 75, 32 70 C 22 72, 18 68, 22 62 C 30 65, 40 62, 50 58 C 65 52, 85 45, 98 42 C 105 40, 110 43, 112 47 C 114 49, 118 49, 119 50 C 117 52, 113 53, 110 54 C 105 60, 95 65, 85 64 Z"
          fill="url(#doveShadingGrad)"
          stroke="#1e293b"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Tail Feather Lines */}
        <path d="M 22 84 C 28 78, 38 72, 46 68" stroke="#1e293b" strokeWidth="1.2" fill="none" />
        <path d="M 25 76 C 30 72, 36 68, 42 66" stroke="#1e293b" strokeWidth="1.2" fill="none" />

        {/* Dove Eye */}
        <circle cx="106" cy="44" r="1.6" fill="#1e293b" />
        {/* Beak Touching Heart */}
        <polygon points="112,47 119,50 112,52" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.2" />
      </g>

      {/* --- Right Dove in Flight (Facing Left) --- */}
      <g transform="translate(240, 0) scale(-1, 1)">
        {/* Right Wing (Spread Upward with Feather Lines) */}
        <path
          d="M 75 52 C 72 40, 65 25, 45 10 C 44 14, 46 22, 50 28 C 45 28, 42 32, 45 37 C 49 42, 52 46, 56 48 C 50 49, 47 54, 52 58 C 57 62, 65 65, 75 62 Z"
          fill="url(#doveShadingGrad)"
          stroke="#1e293b"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Wing Feather Ridges */}
        <path d="M 48 20 C 54 28, 62 42, 68 50" stroke="#1e293b" strokeWidth="1.2" fill="none" />
        <path d="M 52 35 C 58 42, 64 50, 70 54" stroke="#1e293b" strokeWidth="1.2" fill="none" />
        <path d="M 58 48 C 64 54, 70 58, 74 60" stroke="#1e293b" strokeWidth="1.2" fill="none" />

        {/* Dove Body, Head, Beak */}
        <path
          d="M 68 62 C 60 72, 40 85, 20 86 C 28 80, 32 75, 32 70 C 22 72, 18 68, 22 62 C 30 65, 40 62, 50 58 C 65 52, 85 45, 98 42 C 105 40, 110 43, 112 47 C 114 49, 118 49, 119 50 C 117 52, 113 53, 110 54 C 105 60, 95 65, 85 64 Z"
          fill="url(#doveShadingGrad)"
          stroke="#1e293b"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Tail Feather Lines */}
        <path d="M 22 84 C 28 78, 38 72, 46 68" stroke="#1e293b" strokeWidth="1.2" fill="none" />
        <path d="M 25 76 C 30 72, 36 68, 42 66" stroke="#1e293b" strokeWidth="1.2" fill="none" />

        {/* Dove Eye */}
        <circle cx="106" cy="44" r="1.6" fill="#1e293b" />
        {/* Beak Touching Heart */}
        <polygon points="112,47 119,50 112,52" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

// Traditional Khmer Crest Divider (ក្បាច់ភ្ញីទេសមាស)
export function KhmerRoyalCrestDivider({ className = 'w-48 sm:w-56 h-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      className={`${className} overflow-visible filter drop-shadow-[0_2px_4px_rgba(180,120,20,0.3)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="crestGoldFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8db" />
          <stop offset="30%" stopColor="#fef08a" />
          <stop offset="65%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* Central flame spire / lotus tip */}
      <path
        d="M 100 2 C 95 12, 88 18, 93 25 C 96 29, 100 29, 100 29 C 100 29, 104 29, 107 25 C 112 18, 105 12, 100 2 Z"
        fill="url(#crestGoldFillGrad)"
        stroke="#854d0e"
        strokeWidth="1.2"
      />
      <circle cx="100" cy="18" r="2" fill="#fffbeb" stroke="#854d0e" strokeWidth="0.6" />

      {/* Flanking left filigree wing */}
      <path
        d="M 94 24 C 84 20, 75 16, 68 20 C 62 23, 64 30, 72 28 C 80 26, 88 28, 94 32 C 98 34, 100 34, 100 34"
        stroke="#854d0e"
        strokeWidth="1.5"
        fill="url(#crestGoldFillGrad)"
      />
      <path
        d="M 68 22 C 55 20, 42 22, 32 25 C 24 28, 28 34, 35 32 C 45 29, 60 28, 70 30"
        stroke="#854d0e"
        strokeWidth="1.2"
        fill="url(#crestGoldFillGrad)"
      />
      <circle cx="28" cy="28" r="2.5" fill="url(#crestGoldFillGrad)" stroke="#854d0e" strokeWidth="0.8" />
      <circle cx="48" cy="24" r="1.5" fill="#fef08a" stroke="#854d0e" strokeWidth="0.6" />

      {/* Flanking right filigree wing (mirrored) */}
      <g transform="translate(200, 0) scale(-1, 1)">
        <path
          d="M 94 24 C 84 20, 75 16, 68 20 C 62 23, 64 30, 72 28 C 80 26, 88 28, 94 32 C 98 34, 100 34, 100 34"
          stroke="#854d0e"
          strokeWidth="1.5"
          fill="url(#crestGoldFillGrad)"
        />
        <path
          d="M 68 22 C 55 20, 42 22, 32 25 C 24 28, 28 34, 35 32 C 45 29, 60 28, 70 30"
          stroke="#854d0e"
          strokeWidth="1.2"
          fill="url(#crestGoldFillGrad)"
        />
        <circle cx="28" cy="28" r="2.5" fill="url(#crestGoldFillGrad)" stroke="#854d0e" strokeWidth="0.8" />
        <circle cx="48" cy="24" r="1.5" fill="#fef08a" stroke="#854d0e" strokeWidth="0.6" />
      </g>
    </svg>
  );
}

// =========================================================================
// MODERN WEDDING COVER TEMPLATE: CLASSICAL COLONNADE ARCH & ROCOCO MEDALLION
// (Faithfully matching user's uploaded reference image style)
// =========================================================================

// Upward-sweeping feather / leaf flourish attached to the top title
export function TitleFeatherFlourish({ className = 'w-9 sm:w-11 h-12 sm:h-14' }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} overflow-visible inline-block`}>
      {/* Main Curved Spine */}
      <path
        d="M 6 64 C 12 52, 20 36, 26 20 C 29 12, 33 4, 44 2 C 38 8, 32 18, 30 26 C 36 21, 42 20, 48 22 C 40 26, 34 32, 32 38 C 37 35, 43 35, 46 38 C 39 42, 32 47, 30 54 C 34 52, 39 53, 41 56 C 32 60, 24 61, 16 62 C 11 63, 8 64, 6 64 Z"
        fill="#701a2b"
      />
      {/* Decorative leaf tip beads */}
      <circle cx="44" cy="2" r="1.8" fill="#701a2b" />
      <circle cx="48" cy="22" r="1.4" fill="#701a2b" />
      <circle cx="46" cy="38" r="1.4" fill="#701a2b" />
      <circle cx="41" cy="56" r="1.2" fill="#701a2b" />
    </svg>
  );
}

// Hanging delicate flower garlands from the arch ceiling
export function HangingFloralGarlands({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full pointer-events-none ${className}`}>
      <defs>
        <linearGradient id="garlandPinkBud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
      </defs>
      {[
        { x: 35, h: 90, buds: [40, 85] },
        { x: 65, h: 140, buds: [50, 95, 135] },
        { x: 100, h: 175, buds: [55, 110, 170] },
        { x: 140, h: 120, buds: [50, 115] },
        { x: 190, h: 160, buds: [60, 155] },
        { x: 240, h: 125, buds: [55, 120] },
        { x: 280, h: 180, buds: [60, 115, 175] },
        { x: 315, h: 145, buds: [50, 100, 140] },
        { x: 345, h: 95, buds: [45, 90] },
      ].map((strand, i) => (
        <g key={i}>
          <line x1={strand.x} y1="0" x2={strand.x} y2={strand.h} stroke="#ca8a04" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 3" />
          {strand.buds.map((by, bi) => (
            <g key={bi} transform={`translate(${strand.x}, ${by})`}>
              {/* Green Calyx / Sepals */}
              <path d="M -2.5 -3 C -1 -1 0 1 0 2.5 C 0 1 1 -1 2.5 -3 Z" fill="#65a30d" />
              {/* Pink Rosebud Petals */}
              <path d="M 0 0 C -3.5 3 -3.5 8 0 12 C 3.5 8 3.5 3 0 0 Z" fill="url(#garlandPinkBud)" stroke="#9d174d" strokeWidth="0.4" />
              <path d="M -1 2 C -2 4 -1.5 7 0 9" stroke="#fbcfe8" strokeWidth="0.6" fill="none" opacity="0.75" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

// Rococo Acanthus Filigree Oval Frame with Yin-Yang Wave Monogram Medallion
export function RococoYinYangMonogramSeal({
  groomInitial = 'ធ',
  brideInitial = 'ន',
  className = 'w-32 h-32 sm:w-36 sm:h-36',
}: {
  groomInitial?: string;
  brideInitial?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className} select-none flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(112,26,43,0.3)]`}>
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        <defs>
          <clipPath id="archYinYangInnerClip">
            <circle cx="80" cy="80" r="38" />
          </clipPath>
        </defs>

        {/* --- Outer Baroque / Rococo Acanthus Leaf Scrollwork Frame --- */}
        <g stroke="#701a2b" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Top Crown Acanthus Scroll */}
          <path d="M 80 16 C 74 22, 70 28, 80 36 C 90 28, 86 22, 80 16 Z" fill="#701a2b" />
          <path d="M 80 12 C 76 16, 72 18, 68 16 C 65 22, 72 26, 76 28" fill="none" />
          <path d="M 80 12 C 84 16, 88 18, 92 18 C 95 22, 88 26, 84 28" fill="none" />

          {/* Top Left Leaf Sprays */}
          <path d="M 64 24 C 54 20, 45 26, 48 36 C 54 34, 60 36, 64 42" fill="#701a2b" fillOpacity="0.12" />
          <path d="M 52 28 C 42 30, 38 40, 42 48 C 48 46, 52 48, 56 54" />
          <path d="M 40 43 C 30 46, 26 58, 32 68 C 38 64, 42 68, 44 74" fill="#701a2b" fillOpacity="0.12" />

          {/* Top Right Leaf Sprays */}
          <path d="M 96 24 C 106 20, 115 26, 112 36 C 106 34, 100 36, 96 42" fill="#701a2b" fillOpacity="0.12" />
          <path d="M 108 28 C 118 30, 122 40, 118 48 C 112 46, 108 48, 104 54" />
          <path d="M 120 43 C 130 46, 134 58, 128 68 C 122 64, 118 68, 116 74" fill="#701a2b" fillOpacity="0.12" />

          {/* Left Side Volute Scrolls */}
          <path d="M 32 73 C 22 78, 24 93, 34 98 C 40 94, 44 98, 46 104" fill="#701a2b" fillOpacity="0.12" />
          <path d="M 38 96 C 30 104, 36 118, 46 122 C 52 116, 58 118, 62 124" />
          <path d="M 50 118 C 46 128, 56 136, 68 134 C 72 128, 76 130, 80 136" fill="#701a2b" fillOpacity="0.12" />

          {/* Right Side Volute Scrolls */}
          <path d="M 128 73 C 138 78, 136 93, 126 98 C 120 94, 116 98, 114 104" fill="#701a2b" fillOpacity="0.12" />
          <path d="M 122 96 C 130 104, 124 118, 114 122 C 108 116, 102 118, 98 124" />
          <path d="M 110 118 C 114 128, 104 136, 92 134 C 88 128, 84 130, 80 136" fill="#701a2b" fillOpacity="0.12" />

          {/* Bottom Finial Spire */}
          <path d="M 80 140 C 76 134, 72 128, 80 120 C 88 128, 84 134, 80 140 Z" fill="#701a2b" />
          <circle cx="80" cy="144" r="2.2" fill="#701a2b" />
        </g>

        {/* Outer Circular Beaded Ring */}
        <circle cx="80" cy="80" r="45" stroke="#701a2b" strokeWidth="2.5" fill="#ffffff" />
        <circle cx="80" cy="80" r="41" stroke="#d4af37" strokeWidth="1.2" strokeDasharray="2.5 2.5" fill="none" />

        {/* --- Inner Medallion with Wavy S-Curve Split --- */}
        <g clipPath="url(#archYinYangInnerClip)">
          {/* Top Half (Light Cream / Blush Pink) */}
          <rect x="30" y="30" width="100" height="100" fill="#fff6f5" />

          {/* Bottom Half (Rich Mahogany / Dark Burgundy) with S-curve Wave */}
          <path
            d="M 35 80 C 50 68, 68 68, 80 80 C 92 92, 110 92, 125 80 L 125 125 L 35 125 Z"
            fill="#5c2227"
          />

          {/* Dividing S-Curve Seam Line */}
          <path
            d="M 35 80 C 50 68, 68 68, 80 80 C 92 92, 110 92, 125 80"
            stroke="#d4af37"
            strokeWidth="1.6"
            fill="none"
          />

          {/* Miniature Heart at the center wave junction */}
          <path
            d="M 80 77 C 77 74, 74 76, 74 79 C 74 83, 80 86, 80 86 C 80 86, 86 83, 86 79 C 86 76, 83 74, 80 77 Z"
            fill="#f472b6"
            stroke="#ffffff"
            strokeWidth="0.8"
          />
          {/* Delicate Heart Flourish Loop */}
          <path d="M 83 78 C 88 74, 92 78, 88 82" stroke="#d4af37" strokeWidth="0.8" fill="none" />
        </g>

        {/* Inner Gold Rim */}
        <circle cx="80" cy="80" r="38" stroke="#701a2b" strokeWidth="1.8" fill="none" />

        {/* Top Groom Initial (Dark Burgundy) */}
        <text
          x="80"
          y="66"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#701a2b"
          style={{
            fontFamily: "'Khmer OS Muol Light', 'Moul', serif",
            fontSize: '19px',
            fontWeight: 'bold',
          }}
        >
          {groomInitial}
        </text>

        {/* Bottom Bride Initial (Crisp White) */}
        <text
          x="80"
          y="98"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          style={{
            fontFamily: "'Khmer OS Muol Light', 'Moul', serif",
            fontSize: '19px',
            fontWeight: 'bold',
          }}
        >
          {brideInitial}
        </text>
      </svg>
    </div>
  );
}

// Scalloped / Bracketed Horizontal White Parchment Plaque for Guest Name
export function ScallopedParchmentGuestPlaque({
  guestName = 'ឈ្មោះភ្ញៀវកិត្តិយស',
  onClick,
  isAdmin = false,
}: {
  guestName?: string;
  onClick?: () => void;
  isAdmin?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative w-full max-w-[360px] sm:max-w-[400px] h-[58px] sm:h-[64px] flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(112,26,43,0.18)] ${
        isAdmin ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''
      }`}
    >
      <svg
        viewBox="0 0 380 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Outer Ornate Scalloped / Bracketed Shape */}
        <path
          d="M 24 6 
             L 356 6 
             C 362 6, 366 10, 368 15 
             C 374 16, 378 22, 374 30 
             C 378 38, 374 44, 368 45 
             C 366 50, 362 54, 356 54 
             L 24 54 
             C 18 54, 14 50, 12 45 
             C 6 44, 2 38, 6 30 
             C 2 22, 6 16, 12 15 
             C 14 10, 18 6, 24 6 Z"
          fill="#ffffff"
          stroke="#701a2b"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Inner Delicate Gold Rim */}
        <path
          d="M 26 10 
             L 354 10 
             C 358 10, 362 13, 364 17 
             C 368 18, 371 23, 368 30 
             C 371 37, 368 42, 364 43 
             C 362 47, 358 50, 354 50 
             L 26 50 
             C 22 50, 18 47, 16 43 
             C 12 42, 9 37, 12 30 
             C 9 23, 12 18, 16 17 
             C 18 13, 22 10, 26 10 Z"
          fill="none"
          stroke="#c59b27"
          strokeWidth="1.2"
          opacity="0.85"
        />

        {/* Corner Accents */}
        <circle cx="20" cy="30" r="1.8" fill="#701a2b" />
        <circle cx="360" cy="30" r="1.8" fill="#701a2b" />
      </svg>

      <span
        style={{
          fontFamily: "'Moul', 'Khmer OS Muol Light', serif",
          color: '#701a2b',
          fontSize: '17px',
          textShadow: '0 1px 1px rgba(255,255,255,0.9)',
          lineHeight: '35px',
        }}
        className="relative z-10 px-8 text-center truncate max-w-[320px] sm:max-w-[360px] font-bold tracking-wide"
      >
        {guestName}
      </span>
    </div>
  );
}

// Circular Play / Open Button with "បើកសំបុត្រ" prompt
export function ColonnadePlayOpenButton({
  onOpen,
  isOpening = false,
  language = 'kh',
}: {
  onOpen: () => void;
  isOpening?: boolean;
  language?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 select-none">
      {/* Circular Play Button */}
      <button
        id="open-modern-wedding-btn"
        type="button"
        onClick={onOpen}
        disabled={isOpening}
        className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 border-[2.8px] border-[#701a2b] flex items-center justify-center cursor-pointer shadow-[0_6px_20px_rgba(112,26,43,0.3)] transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-[0_8px_25px_rgba(112,26,43,0.4)]"
      >
        {/* Subtle Ambient Pulse Ring */}
        <div className="absolute inset-0 rounded-full border border-[#701a2b]/30 animate-ping opacity-30 pointer-events-none" />

        {/* Inner Delicate Rim */}
        <div className="absolute inset-1 rounded-full border border-[#d4af37]/50 pointer-events-none" />

        {/* Centered Burgundy Play Triangle Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="#701a2b"
          className="w-6 h-6 sm:w-7 sm:h-7 text-[#701a2b] translate-x-0.5 transition-transform duration-300 group-hover:scale-110"
        >
          <polygon points="6,4 20,12 6,20" />
        </svg>
      </button>

      {/* Under-Button Text: បើកសំបុត្រ */}
      <button
        type="button"
        onClick={onOpen}
        disabled={isOpening}
        className="text-[#701a2b] text-base sm:text-lg font-bold tracking-wider hover:opacity-80 transition-opacity cursor-pointer drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] mt-1"
        style={{
          fontFamily: "'Khmer OS Muol Light', 'Moul', 'Noto Sans Khmer', sans-serif",
        }}
      >
        {isOpening ? (language === 'kh' ? 'កំពុងបើក...' : 'Opening...') : (language === 'kh' ? 'បើកសំបុត្រ' : 'Open Invitation')}
      </button>
    </div>
  );
}

// Full Faithful Recreation of the Modern Wedding Colonnade Arch Cover Template from image.png
export function KhmerRoyalModernWeddingCover({
  groom = 'ជា ដារ៉ា',
  bride = 'សុខ បុប្ផា',
  groomEn = 'Chea Dara',
  brideEn = 'Sok Bopha',
  subtitleKh = 'សិរីមង្គលអាពាហ៍ពិពាហ៍',
  guestName = 'លោក ពិសិដ្ឋ',
  language = 'kh',
  onOpenInvitation,
  isOpening = false,
  isAdmin = false,
  savedGuestsList = [],
  onSelectFromDropbox,
  onOpenAddGuestModal,
  onUpdateGuestName,
}: {
  groom?: string;
  bride?: string;
  groomEn?: string;
  brideEn?: string;
  subtitleKh?: string;
  guestName?: string;
  titleShape?: 'straight' | 'arch-up' | 'arch-down' | 'wave';
  language?: string;
  onOpenInvitation?: () => void;
  isOpening?: boolean;
  isAdmin?: boolean;
  savedGuestsList?: Array<{ id?: string; name: string; categoryLabelKh?: string; categoryLabelEn?: string }>;
  onSelectFromDropbox?: (name: string) => void;
  onOpenAddGuestModal?: () => void;
  onUpdateGuestName?: (name: string) => void;
}) {
  const [isEditingInlineGuest, setIsEditingInlineGuest] = useState(false);
  const [tempGuestInput, setTempGuestInput] = useState(guestName || '');

  // Helper to extract clean initials in Khmer, defaulting to 'ធ' and 'ន' as shown in reference image
  const getKhmerInitialChar = (str?: string): string => {
    if (!str) return '';
    const match = str.trim().match(/[\u1780-\u17B3]/);
    return match ? match[0] : str.trim().charAt(0);
  };

  const groomInitial = (groom && (groom.includes('ធ') || groom.includes('ដារ៉ា')))
    ? (groom.includes('ធ') ? 'ធ' : 'ដ')
    : (getKhmerInitialChar(groom) || 'ធ');
  const brideInitial = (bride && (bride.includes('ន') || bride.includes('បុប្ផា')))
    ? (bride.includes('ន') ? 'ន' : 'ប')
    : (getKhmerInitialChar(bride) || 'ន');

  const rawGuest = guestName && guestName !== 'Your Name' ? guestName.trim() : (language === 'kh' ? 'លោក រ៉ូហ្សា' : 'Honored Guest');

  const handleSaveInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempGuestInput.trim() && onUpdateGuestName) {
      onUpdateGuestName(tempGuestInput.trim());
    }
    setIsEditingInlineGuest(false);
  };

  return (
    <div
      className="relative w-full h-full min-h-[660px] sm:min-h-[720px] flex flex-col justify-between items-center text-center p-3 sm:p-5 rounded-[28px] overflow-hidden select-none shadow-[0_20px_50px_rgba(112,26,43,0.25)]"
      style={{
        backgroundImage: `url('/assets/images/white_arch_columns_wedding_cover_1790394461049.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#fbf4f2',
      }}
    >
      {/* Soft Ambient Rose Light Glow inside Arch */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/15 via-rose-100/10 to-rose-950/20 pointer-events-none" />

      {/* Hanging Pink Lotus / Rose Buds Garlands from Archway Top */}
      <div className="absolute top-0 inset-x-0 h-44 sm:h-52 pointer-events-none z-10 opacity-95">
        <HangingFloralGarlands />
      </div>

      {/* ========================================================= */}
      {/* TOP SECTION: KHMER TITLE WITH RIGHTWARD FEATHER FLOURISH   */}
      {/* ========================================================= */}
      <div className="relative z-20 pt-8 sm:pt-11 flex flex-col items-center w-full px-2">
        <div className="flex items-center justify-center gap-1 relative">
          <div className="flex flex-col items-center leading-none">
            {/* Line 1: សិរីមង្គល */}
            <span
              className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-wider"
              style={{
                fontFamily: "'Khmer OS Muol Light', 'Moul', serif",
                color: '#701a2b',
                textShadow: '0 1px 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.8)',
                lineHeight: '1.25',
              }}
            >
              សិរីមង្គល
            </span>

            {/* Line 2: អាពាហ៍ពិពាហ៍ */}
            <span
              className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-wider mt-0.5 sm:mt-1"
              style={{
                fontFamily: "'Khmer OS Muol Light', 'Moul', serif",
                color: '#701a2b',
                textShadow: '0 1px 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.8)',
                lineHeight: '1.25',
              }}
            >
              អាពាហ៍ពិពាហ៍
            </span>
          </div>

          {/* Rightward Sweeping Feather / Leaf Flourish */}
          <div className="absolute -right-9 sm:-right-11 -top-3 sm:-top-4 pointer-events-none">
            <TitleFeatherFlourish />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MIDDLE SECTION: ROCOCO YIN-YANG MEDALLION & GUEST PLAQUE  */}
      {/* ========================================================= */}
      <div className="relative z-20 flex flex-col items-center w-full px-2 my-auto">
        {/* Center Rococo Oval Frame with Yin-Yang Wave Monogram Medallion */}
        <div className="my-2 sm:my-3 flex justify-center">
          <RococoYinYangMonogramSeal
            groomInitial={groomInitial}
            brideInitial={brideInitial}
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40"
          />
        </div>

        {/* Subtitle: សូមគោរពអញ្ជើញ */}
        <div className="mt-3 sm:mt-4 mb-2">
          <span
            className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-center"
            style={{
              fontFamily: "'Noto Sans Khmer', sans-serif",
              color: '#701a2b',
              textShadow: '0 1px 2px rgba(255,255,255,0.95)',
            }}
          >
            {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
          </span>
        </div>

        {/* ========================================================= */}
        {/* HONORED GUEST SCALLOPED PARCHMENT PLAQUE BANNER            */}
        {/* ========================================================= */}
        <div className="w-full max-w-[320px] sm:max-w-[360px] px-2 flex flex-col items-center">
          {isAdmin && savedGuestsList.length > 0 && onSelectFromDropbox && (
            <div className="w-full mb-1.5 flex items-center justify-center">
              <select
                id="guest-dropbox-select-cover"
                value={savedGuestsList.some(g => g.name === guestName) ? guestName : ''}
                onChange={e => onSelectFromDropbox(e.target.value)}
                style={{ color: '#701a2b', borderColor: '#701a2b80' }}
                className="w-full max-w-[270px] px-2.5 py-1 rounded-md bg-white/95 border text-[11px] font-khmer focus:outline-none cursor-pointer shadow-xs"
              >
                <option value="" disabled>
                  {language === 'kh' ? '▼ ជ្រើសរើសឈ្មោះភ្ញៀវពី Drop box...' : '▼ Select Guest from Drop box...'}
                </option>
                {savedGuestsList.map((g, idx) => (
                  <option key={g.id ? `${g.id}-${idx}` : `env-guest-${idx}`} value={g.name} className="bg-white text-neutral-800 py-1">
                    {g.name} - {language === 'kh' ? g.categoryLabelKh : g.categoryLabelEn}
                  </option>
                ))}
                <option value="__ADD_NEW__" className="bg-rose-100 text-rose-950 font-bold">
                  + {language === 'kh' ? 'Add ភ្ញៀវថ្មី / បន្ថែមឈ្មោះ...' : 'Add New Custom Guest...'}
                </option>
              </select>
            </div>
          )}

          {isEditingInlineGuest ? (
            <form onSubmit={handleSaveInline} className="w-full p-2 rounded-xl bg-white/95 border border-[#701a2b] shadow-md flex items-center gap-1.5">
              <input
                type="text"
                value={tempGuestInput}
                onChange={e => setTempGuestInput(e.target.value)}
                autoFocus
                placeholder={language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវ...' : 'Enter guest name...'}
                className="flex-1 px-2 py-1 text-xs border rounded border-rose-300 font-moul text-center text-[#701a2b] focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-[#701a2b] text-white rounded text-xs font-bold font-khmer cursor-pointer hover:bg-[#881337]"
              >
                {language === 'kh' ? 'យល់ព្រម' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingInlineGuest(false)}
                className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs cursor-pointer hover:bg-gray-300"
              >
                ✕
              </button>
            </form>
          ) : (
            <ScallopedParchmentGuestPlaque
              guestName={rawGuest}
              isAdmin={isAdmin}
              onClick={() => {
                if (isAdmin) {
                  if (onOpenAddGuestModal) {
                    onOpenAddGuestModal();
                  } else {
                    setTempGuestInput(rawGuest);
                    setIsEditingInlineGuest(true);
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM SECTION: CIRCULAR PLAY BUTTON & "បើកសំបុត្រ"       */}
      {/* ========================================================= */}
      {onOpenInvitation && (
        <div className="relative z-20 pt-2 pb-5 sm:pb-7 flex flex-col items-center">
          <ColonnadePlayOpenButton
            onOpen={onOpenInvitation}
            isOpening={isOpening}
            language={language}
          />
        </div>
      )}
    </div>
  );
}

export function ModernWeddingScallopedOpenButton({
  onOpen,
  isOpening = false,
  labelKh = 'បើកលិខិតអញ្ជើញ',
  className = '',
}: {
  onOpen: () => void;
  isOpening?: boolean;
  labelKh?: string;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-col items-center select-none w-full max-w-xs sm:max-w-sm ${className}`}>
      <button
        id="open-modern-wedding-btn"
        type="button"
        onClick={onOpen}
        disabled={isOpening}
        className="group relative w-full py-2.5 sm:py-3 px-10 sm:px-12 cursor-pointer overflow-hidden transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] shadow-[0_12px_36px_rgba(217,119,6,0.35)]"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 50%, #fef3c7 100%)',
          border: '3px solid #d4af37',
          borderRadius: '30px 4px 30px 4px',
        }}
      >
        {/* Shimmer Light Bar */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

        {/* Traditional Gold Scroll Ends (Screenshot 3) */}
        <div className="absolute left-0 inset-y-0 w-3 bg-[#d4af37] rounded-l" />
        <div className="absolute right-0 inset-y-0 w-3 bg-[#d4af37] rounded-r" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
          <span
            className="font-noto-sans-khmer text-base sm:text-lg md:text-xl tracking-wider font-extrabold"
            style={{
              fontFamily: "'Noto Sans Khmer', sans-serif",
              color: '#92400e',
              background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.95))',
            }}
          >
            {isOpening ? 'កំពុងបើក...' : labelKh}
          </span>
          {/* Subtle central decorative flourish */}
          <div className="w-16 h-[1.5px] bg-[#d4af37]/60" />
        </div>
      </button>
    </div>
  );
}




