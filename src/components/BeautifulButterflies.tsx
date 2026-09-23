import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export type RealButterflyType =
  | 'cyan-swallowtail' // Image 1 (Hero Cyan Blue Swallowtail with tail & rich blue cells)
  | 'great-orange-tip' // Image 2 Top-Left (Cream & Orange Flame Tips)
  | 'morpho-blue' // Image 2 Top-Right (Sapphire Electric Blue with black borders)
  | 'tiger-longwing' // Image 2 Bottom-Left (Black & Orange striped with white spots)
  | 'golden-sulphur'; // Image 2 Bottom-Right (Radiant Yellow-Gold with black margins)

interface ButterflyFlightConfig {
  id: number;
  type: RealButterflyType;
  startX: number;
  startY: number;
  pathX: number[];
  pathY: number[];
  size: number;
  duration: number;
  delay: number;
  flapSpeed: number;
  depth: 'foreground' | 'midground' | 'background';
}

/* =========================================================================
   1. CYAN SWALLOWTAIL WING (Image 1 - Exact SVG Anatomical Replication)
   ========================================================================= */
const CyanSwallowtailWing: React.FC<{ side: 'left' | 'right'; id: string }> = ({ side, id }) => {
  const isLeft = side === 'left';
  const gradForewing = `cyan-fore-${side}-${id}`;
  const gradHindwing = `cyan-hind-${side}-${id}`;
  const gradGlow = `cyan-glow-${side}-${id}`;

  return (
    <svg
      viewBox="0 0 100 120"
      className="w-full h-full filter drop-shadow-[0_2px_7px_rgba(0,0,0,0.35)]"
      style={{ transformOrigin: isLeft ? '100% 45%' : '0% 45%' }}
    >
      <defs>
        {/* Forewing Blue Gradient */}
        <linearGradient id={gradForewing} x1={isLeft ? '100%' : '0%'} y1="30%" x2={isLeft ? '0%' : '100%'} y2="85%">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="35%" stopColor="#00b0ff" />
          <stop offset="70%" stopColor="#0288d1" />
          <stop offset="100%" stopColor="#01579b" />
        </linearGradient>

        {/* Hindwing Blue Gradient */}
        <linearGradient id={gradHindwing} x1={isLeft ? '100%' : '0%'} y1="20%" x2={isLeft ? '0%' : '100%'} y2="80%">
          <stop offset="0%" stopColor="#18ffff" />
          <stop offset="45%" stopColor="#00b0ff" />
          <stop offset="85%" stopColor="#0277bd" />
          <stop offset="100%" stopColor="#01579b" />
        </linearGradient>

        {/* Inner Cell Radiance */}
        <radialGradient id={gradGlow} cx={isLeft ? '70%' : '30%'} cy="35%" r="60%">
          <stop offset="0%" stopColor="#e0f7fa" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#80d8ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0091ea" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={isLeft ? undefined : 'scale(-1, 1) translate(-100, 0)'}>
        {/* 1. FOREWING */}
        {/* Outer Dark Charcoal Margin */}
        <path
          d="M 96,52 C 92,25 72,5 34,2 C 16,1 4,6 2,16 C 1,22 6,32 14,40 C 26,50 54,58 96,52 Z"
          fill="#0c1824"
        />
        {/* Blue Colored Disc */}
        <path
          d="M 94,50 C 90,26 70,8 36,5 C 20,4 8,9 6,17 C 5,23 10,31 18,38 C 28,47 56,54 94,50 Z"
          fill={`url(#${gradForewing})`}
        />
        {/* Forewing Inner Cell Glow */}
        <path
          d="M 90,48 C 82,30 64,14 40,10 C 28,9 18,13 16,18 C 15,22 20,28 26,33 C 38,40 65,47 90,48 Z"
          fill={`url(#${gradGlow})`}
        />

        {/* Forewing Black Apex Tip & Margin Border (Like Image 1) */}
        <path
          d="M 34,2 C 16,1 4,6 2,16 C 1,22 6,28 12,32 C 10,24 16,14 26,9 C 34,5 48,5 58,6 C 48,3 40,2 34,2 Z"
          fill="#0a141e"
        />

        {/* Forewing Venation Veins */}
        <g stroke="#09141d" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.9">
          <path d="M 94,50 Q 64,26 36,5" />
          <path d="M 75,34 Q 50,14 22,10" />
          <path d="M 68,37 Q 40,22 13,18" />
          <path d="M 94,50 Q 56,38 12,30" />
          <path d="M 85,45 Q 52,43 18,38" />
          {/* Central Discoidal cell */}
          <path d="M 94,50 Q 72,30 58,34 Q 68,44 94,50" strokeWidth="1.4" />
        </g>

        {/* 2. HINDWING WITH SIGNATURE SWALLOWTAIL TAIL (Image 1) */}
        {/* Dark Scalloped Border with Tail */}
        <path
          d="M 94,50 C 82,59 62,65 52,76 C 44,85 41,96 35,108 C 33,113 27,118 29,112 C 30,105 34,97 32,92 C 26,88 20,85 16,74 C 12,63 15,55 24,46 C 36,36 68,34 94,50 Z"
          fill="#0c1824"
        />
        {/* Blue Colored Hindwing Disc */}
        <path
          d="M 92,51 C 80,60 62,66 53,76 C 45,84 41,94 36,104 C 35,106 33,104 33,101 C 34,94 37,88 34,84 C 28,81 22,78 19,70 C 16,61 18,54 26,47 C 38,38 68,36 92,51 Z"
          fill={`url(#${gradHindwing})`}
        />
        {/* Hindwing Glow */}
        <path
          d="M 88,52 C 76,60 58,66 48,74 C 40,80 34,76 30,70 C 26,62 30,52 38,46 C 48,40 70,39 88,52 Z"
          fill={`url(#${gradGlow})`}
        />

        {/* Hindwing Venation */}
        <g stroke="#09141d" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.88">
          <path d="M 92,51 Q 62,66 32,92" />
          <path d="M 75,56 Q 50,72 24,80" />
          <path d="M 78,54 Q 54,60 21,62" />
          <path d="M 64,64 Q 44,78 35,100" />
        </g>

        {/* Elegant Swallowtail Tail Extension (Black Spoon Shape like Image 1) */}
        <path
          d="M 33,96 Q 34,104 31,112 Q 28,119 29,115 Q 31,108 34,99 Z"
          fill="#09141d"
        />
      </g>
    </svg>
  );
};

/* =========================================================================
   2. GREAT ORANGE TIP WING (Image 2 Top-Left: Cream with Orange Flame Tips)
   ========================================================================= */
const GreatOrangeTipWing: React.FC<{ side: 'left' | 'right'; id: string }> = ({ side, id }) => {
  const isLeft = side === 'left';
  const gradCream = `cream-base-${side}-${id}`;
  const gradFlame = `orange-flame-${side}-${id}`;

  return (
    <svg
      viewBox="0 0 100 110"
      className="w-full h-full filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
      style={{ transformOrigin: isLeft ? '100% 45%' : '0% 45%' }}
    >
      <defs>
        <linearGradient id={gradCream} x1={isLeft ? '100%' : '0%'} y1="20%" x2={isLeft ? '0%' : '100%'} y2="80%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <linearGradient id={gradFlame} x1={isLeft ? '100%' : '0%'} y1="0%" x2={isLeft ? '0%' : '100%'} y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>

      <g transform={isLeft ? undefined : 'scale(-1, 1) translate(-100, 0)'}>
        {/* Forewing Margin */}
        <path
          d="M 95,50 C 90,24 72,6 36,4 C 18,3 6,8 4,18 C 3,25 8,34 16,42 C 28,52 56,58 95,50 Z"
          fill="#1c1917"
        />
        {/* Cream Inner Base */}
        <path
          d="M 93,48 C 88,26 70,9 38,7 C 22,6 10,11 8,20 C 7,25 12,33 20,40 C 30,49 58,55 93,48 Z"
          fill={`url(#${gradCream})`}
        />
        {/* Vibrant Orange Flame Patch at Apex (Like Image 2 Top-Left) */}
        <path
          d="M 52,6 C 36,5 18,8 8,20 C 7,25 10,32 16,36 C 24,28 36,18 52,14 Z"
          fill={`url(#${gradFlame})`}
        />
        {/* Black Outer Scallops on Flame */}
        <path
          d="M 36,4 C 18,3 6,8 4,18 C 3,22 6,26 9,28 C 12,18 22,10 36,8 Z"
          fill="#1c1917"
        />

        {/* Forewing Fine Radiating Veins */}
        <g stroke="#292524" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.75">
          <path d="M 93,48 Q 65,26 38,7" />
          <path d="M 78,35 Q 52,16 26,12" />
          <path d="M 70,38 Q 44,24 16,22" />
          <path d="M 93,48 Q 58,40 18,34" />
          <path d="M 85,45 Q 55,46 22,40" />
        </g>

        {/* Hindwing */}
        <path
          d="M 93,48 C 80,58 60,65 48,74 C 36,83 24,82 18,72 C 14,60 16,50 26,42 C 40,32 70,32 93,48 Z"
          fill="#1c1917"
        />
        <path
          d="M 91,49 C 78,58 60,64 48,72 C 38,80 26,79 21,70 C 17,60 18,52 28,44 C 42,34 70,34 91,49 Z"
          fill={`url(#${gradCream})`}
        />
        <g stroke="#292524" strokeWidth="0.75" strokeLinecap="round" fill="none" opacity="0.7">
          <path d="M 91,49 Q 65,64 36,75" />
          <path d="M 76,54 Q 52,68 26,68" />
          <path d="M 78,52 Q 54,58 24,54" />
        </g>
      </g>
    </svg>
  );
};

/* =========================================================================
   3. MORPHO BLUE WING (Image 2 Top-Right: Sapphire Blue with bold veins)
   ========================================================================= */
const MorphoBlueWing: React.FC<{ side: 'left' | 'right'; id: string }> = ({ side, id }) => {
  const isLeft = side === 'left';
  const gradBlue = `morpho-grad-${side}-${id}`;

  return (
    <svg
      viewBox="0 0 100 110"
      className="w-full h-full filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
      style={{ transformOrigin: isLeft ? '100% 45%' : '0% 45%' }}
    >
      <defs>
        <linearGradient id={gradBlue} x1={isLeft ? '100%' : '0%'} y1="15%" x2={isLeft ? '0%' : '100%'} y2="85%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#0284c7" />
          <stop offset="85%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>

      <g transform={isLeft ? undefined : 'scale(-1, 1) translate(-100, 0)'}>
        {/* Forewing Margin & Disc */}
        <path
          d="M 95,52 C 90,26 70,6 32,3 C 14,2 2,7 1,17 C 0,24 6,33 14,41 C 26,51 55,57 95,52 Z"
          fill="#09182b"
        />
        <path
          d="M 93,50 C 88,27 68,9 34,6 C 18,5 6,10 5,18 C 4,24 9,32 17,39 C 28,48 56,54 93,50 Z"
          fill={`url(#${gradBlue})`}
        />
        {/* Forewing Bold Black Radiating Veins */}
        <g stroke="#031120" strokeWidth="1.05" strokeLinecap="round" fill="none" opacity="0.9">
          <path d="M 93,50 Q 64,28 34,6" />
          <path d="M 75,36 Q 48,15 22,11" />
          <path d="M 68,39 Q 42,24 13,20" />
          <path d="M 93,50 Q 56,38 12,32" />
          <path d="M 85,46 Q 54,44 19,39" />
        </g>

        {/* Hindwing */}
        <path
          d="M 93,50 C 80,60 60,66 48,76 C 36,85 24,84 18,74 C 14,62 16,52 26,44 C 40,34 70,34 93,50 Z"
          fill="#09182b"
        />
        <path
          d="M 91,51 C 78,59 60,65 48,74 C 38,82 26,81 21,72 C 17,62 18,54 28,46 C 42,36 70,36 91,51 Z"
          fill={`url(#${gradBlue})`}
        />
        <g stroke="#031120" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.88">
          <path d="M 91,51 Q 65,65 36,76" />
          <path d="M 76,56 Q 52,70 26,70" />
          <path d="M 78,53 Q 54,60 24,56" />
        </g>
      </g>
    </svg>
  );
};

/* =========================================================================
   4. TIGER LONGWING WING (Image 2 Bottom-Left: Black/Orange striped + White dots)
   ========================================================================= */
const TigerLongwingWing: React.FC<{ side: 'left' | 'right'; id: string }> = ({ side, id }) => {
  const isLeft = side === 'left';
  const gradOrange = `tiger-orange-${side}-${id}`;

  return (
    <svg
      viewBox="0 0 110 90"
      className="w-full h-full filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
      style={{ transformOrigin: isLeft ? '100% 45%' : '0% 45%' }}
    >
      <defs>
        <linearGradient id={gradOrange} x1={isLeft ? '100%' : '0%'} y1="0%" x2={isLeft ? '0%' : '100%'} y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="45%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>

      <g transform={isLeft ? undefined : 'scale(-1, 1) translate(-110, 0)'}>
        {/* Elongated Forewing (Longwing Silhouette from Image 2) */}
        <path
          d="M 104,42 C 98,20 74,4 34,2 C 14,1 2,6 1,16 C 0,22 6,30 16,36 C 32,44 68,48 104,42 Z"
          fill="#1c1917"
        />

        {/* Orange Horizontal Tiger Bands */}
        <path
          d="M 98,40 C 72,43 40,38 20,32 C 18,29 20,26 26,26 C 44,28 72,32 98,40 Z"
          fill={`url(#${gradOrange})`}
        />
        <path
          d="M 90,34 C 68,31 46,24 28,18 C 32,15 42,14 58,16 C 72,18 84,24 90,34 Z"
          fill={`url(#${gradOrange})`}
        />

        {/* White Cream Spots on Black Apical Forewing (Like Image 2 Bottom-Left) */}
        <ellipse cx="14" cy="11" rx="5" ry="3" fill="#ffffff" transform="rotate(-15 14 11)" />
        <ellipse cx="26" cy="9" rx="4" ry="2.5" fill="#ffffff" transform="rotate(-10 26 9)" />
        <circle cx="8" cy="19" r="2.2" fill="#ffffff" />
        <circle cx="16" cy="24" r="2" fill="#ffffff" />

        {/* Hindwing with Orange Core & Black Margin with White Dots */}
        <path
          d="M 102,40 C 88,52 64,62 48,64 C 32,66 20,58 18,48 C 16,38 22,30 34,24 C 54,16 84,24 102,40 Z"
          fill="#1c1917"
        />
        <path
          d="M 98,40 C 85,50 64,58 48,60 C 36,61 26,55 24,47 C 22,39 28,33 38,28 C 54,21 82,27 98,40 Z"
          fill={`url(#${gradOrange})`}
        />
        {/* Hindwing Central Black Bar */}
        <path
          d="M 96,40 C 80,45 56,48 36,46 C 42,42 64,38 96,40 Z"
          fill="#1c1917"
        />
        {/* White Margin Dots on Hindwing Edge */}
        <circle cx="21" cy="54" r="1.4" fill="#ffffff" />
        <circle cx="28" cy="59" r="1.4" fill="#ffffff" />
        <circle cx="38" cy="62" r="1.4" fill="#ffffff" />
        <circle cx="50" cy="63" r="1.4" fill="#ffffff" />
      </g>
    </svg>
  );
};

/* =========================================================================
   5. GOLDEN SULPHUR WING (Image 2 Bottom-Right: Radiant Yellow-Gold)
   ========================================================================= */
const GoldenSulphurWing: React.FC<{ side: 'left' | 'right'; id: string }> = ({ side, id }) => {
  const isLeft = side === 'left';
  const gradGold = `gold-grad-${side}-${id}`;

  return (
    <svg
      viewBox="0 0 100 110"
      className="w-full h-full filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
      style={{ transformOrigin: isLeft ? '100% 45%' : '0% 45%' }}
    >
      <defs>
        <linearGradient id={gradGold} x1={isLeft ? '100%' : '0%'} y1="15%" x2={isLeft ? '0%' : '100%'} y2="85%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#facc15" />
          <stop offset="90%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>

      <g transform={isLeft ? undefined : 'scale(-1, 1) translate(-100, 0)'}>
        {/* Forewing Thin Dark Margin Border */}
        <path
          d="M 95,50 C 90,25 72,6 34,3 C 16,2 4,7 2,17 C 1,24 6,33 14,41 C 26,51 55,57 95,50 Z"
          fill="#1c1917"
        />
        <path
          d="M 93,49 C 88,27 70,8 36,6 C 18,5 7,10 5,18 C 4,24 9,32 17,39 C 28,48 56,54 93,49 Z"
          fill={`url(#${gradGold})`}
        />
        {/* Detailed Radiating Pencil-style Veins */}
        <g stroke="#292524" strokeWidth="0.85" strokeLinecap="round" fill="none" opacity="0.8">
          <path d="M 93,49 Q 65,27 36,6" />
          <path d="M 76,35 Q 50,15 24,10" />
          <path d="M 70,38 Q 44,23 15,19" />
          <path d="M 93,49 Q 58,40 14,32" />
          <path d="M 85,45 Q 54,45 20,39" />
        </g>

        {/* Hindwing */}
        <path
          d="M 93,49 C 80,59 60,65 48,75 C 36,84 24,83 18,73 C 14,61 16,51 26,43 C 40,33 70,33 93,49 Z"
          fill="#1c1917"
        />
        <path
          d="M 91,50 C 78,58 60,64 48,73 C 38,81 26,80 21,71 C 17,61 18,53 28,45 C 42,35 70,35 91,50 Z"
          fill={`url(#${gradGold})`}
        />
        <g stroke="#292524" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.75">
          <path d="M 91,50 Q 65,65 36,75" />
          <path d="M 76,55 Q 52,69 26,69" />
          <path d="M 78,52 Q 54,59 24,55" />
        </g>
      </g>
    </svg>
  );
};

/* =========================================================================
   REALISTIC BUTTERFLY INSTANCE (Wing Flapping + Torso + Antennae + Trajectory)
   ========================================================================= */
const RealisticButterflyFlight: React.FC<ButterflyFlightConfig> = ({
  id,
  type,
  startX,
  startY,
  pathX,
  pathY,
  size,
  duration,
  delay,
  flapSpeed,
  depth,
}) => {
  const uniqueId = useMemo(() => `${type}-${id}`, [type, id]);

  const bodyColor =
    type === 'cyan-swallowtail'
      ? '#1e293b'
      : type === 'morpho-blue'
      ? '#0f172a'
      : type === 'great-orange-tip'
      ? '#27272a'
      : type === 'tiger-longwing'
      ? '#18181b'
      : '#292524';

  const zIndex = depth === 'foreground' ? 35 : depth === 'midground' ? 25 : 15;
  const opacityBase = depth === 'foreground' ? 0.98 : depth === 'midground' ? 0.9 : 0.78;

  const renderWing = (side: 'left' | 'right') => {
    switch (type) {
      case 'cyan-swallowtail':
        return <CyanSwallowtailWing side={side} id={uniqueId} />;
      case 'great-orange-tip':
        return <GreatOrangeTipWing side={side} id={uniqueId} />;
      case 'morpho-blue':
        return <MorphoBlueWing side={side} id={uniqueId} />;
      case 'tiger-longwing':
        return <TigerLongwingWing side={side} id={uniqueId} />;
      case 'golden-sulphur':
      default:
        return <GoldenSulphurWing side={side} id={uniqueId} />;
    }
  };

  return (
    <motion.div
      initial={{
        x: `${startX}vw`,
        y: `${startY}vh`,
        opacity: 0,
        scale: depth === 'background' ? 0.72 : 0.9,
      }}
      animate={{
        x: pathX.map((x) => `${x}vw`),
        y: pathY.map((y) => `${y}vh`),
        opacity: [0, opacityBase, opacityBase, opacityBase * 0.92, 0],
        scale: [
          depth === 'background' ? 0.7 : 0.88,
          depth === 'background' ? 0.82 : 1.05,
          depth === 'background' ? 0.76 : 0.96,
          depth === 'background' ? 0.7 : 0.88,
        ],
        rotateZ: [-14, 16, -8, 18, -10, 12],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 1.2 + (id % 3),
        ease: 'easeInOut',
      }}
      className="absolute pointer-events-none select-none"
      style={{
        width: `${size}px`,
        height: `${size * 1.12}px`,
        zIndex,
        perspective: 900,
      }}
    >
      {/* 3D Flight Container with Wing Flapping Physics */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Soft Organic Drop Shadow */}
        <div
          className="absolute w-3/4 h-3/4 rounded-full blur-[5px] opacity-20 pointer-events-none"
          style={{ backgroundColor: bodyColor, transform: 'translateY(10px) scaleY(0.4)' }}
        />

        {/* LEFT WING with Natural 3D Flap Angle */}
        <motion.div
          animate={{
            rotateY: [0, 74, -14, 70, 0, 0, 72, -8, 0],
            rotateZ: [0, -5, 2, -4, 0, 0, -5, 1, 0],
            scaleX: [1, 0.3, 1.02, 0.33, 1, 1, 0.32, 1, 1],
          }}
          transition={{
            duration: flapSpeed * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-1/2 h-full origin-right inline-block"
        >
          {renderWing('left')}
        </motion.div>

        {/* REALISTIC BUTTERFLY BODY (Head, Antennae, Thorax, Abdomen) */}
        <div className="w-[4px] h-[70%] flex flex-col items-center justify-between z-20 mx-[-2px] relative pointer-events-none">
          {/* Thin curved antennae with delicate knob tips */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-3 flex justify-between pointer-events-none">
            <svg viewBox="0 0 10 12" className="w-2 h-3 overflow-visible">
              <path
                d="M 8,11 C 7,6 3,3 1,1"
                stroke={bodyColor}
                strokeWidth="0.85"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="1" cy="1" r="0.9" fill={bodyColor} />
            </svg>
            <svg viewBox="0 0 10 12" className="w-2 h-3 overflow-visible">
              <path
                d="M 2,11 C 3,6 7,3 9,1"
                stroke={bodyColor}
                strokeWidth="0.85"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="9" cy="1" r="0.9" fill={bodyColor} />
            </svg>
          </div>

          {/* Head */}
          <div
            className="w-2.5 h-2.5 rounded-full shadow-sm relative flex items-center justify-between px-0.5"
            style={{ backgroundColor: bodyColor }}
          >
            <div className="w-0.5 h-0.5 rounded-full bg-slate-400" />
            <div className="w-0.5 h-0.5 rounded-full bg-slate-400" />
          </div>

          {/* Thorax */}
          <div
            className="w-2 h-3.5 rounded-full shadow-inner my-[-1px]"
            style={{ backgroundColor: bodyColor }}
          />

          {/* Segmented Abdomen */}
          <div
            className="w-1.5 h-6 rounded-b-full shadow-sm flex flex-col justify-evenly py-0.5"
            style={{ backgroundColor: bodyColor }}
          >
            <div className="w-full h-[1px] bg-slate-500/30" />
            <div className="w-full h-[1px] bg-slate-500/30" />
            <div className="w-full h-[1px] bg-slate-500/30" />
          </div>
        </div>

        {/* RIGHT WING with Synchronized 3D Flap Angle */}
        <motion.div
          animate={{
            rotateY: [0, -74, 14, -70, 0, 0, -72, 8, 0],
            rotateZ: [0, 4, -2, 3, 0, 0, 4, -1, 0],
            scaleX: [1, 0.3, 1.02, 0.33, 1, 1, 0.32, 1, 1],
          }}
          transition={{
            duration: flapSpeed * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-1/2 h-full origin-left inline-block"
        >
          {renderWing('right')}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function BeautifulButterflies({ className = '' }: { className?: string }) {
  // Flock featuring the exact butterflies from the uploaded user photos
  const flock: ButterflyFlightConfig[] = useMemo(
    () => [
      // 1. Primary Hero Cyan Swallowtail (Image 1)
      {
        id: 1,
        type: 'cyan-swallowtail',
        startX: -6,
        startY: 65,
        pathX: [12, 34, 60, 84, 105],
        pathY: [52, 35, 45, 22, 6],
        size: 64,
        duration: 16,
        delay: 0,
        flapSpeed: 0.22,
        depth: 'foreground',
      },
      // 2. Morpho Electric Blue Swallowtail (Image 2 Top-Right)
      {
        id: 2,
        type: 'morpho-blue',
        startX: 106,
        startY: 46,
        pathX: [86, 60, 34, 10, -8],
        pathY: [38, 54, 40, 26, 12],
        size: 56,
        duration: 17,
        delay: 2.5,
        flapSpeed: 0.21,
        depth: 'midground',
      },
      // 3. Great Orange Tip (Image 2 Top-Left)
      {
        id: 3,
        type: 'great-orange-tip',
        startX: 2,
        startY: 85,
        pathX: [24, 48, 70, 92, 106],
        pathY: [70, 50, 56, 34, 16],
        size: 58,
        duration: 18,
        delay: 5.0,
        flapSpeed: 0.23,
        depth: 'foreground',
      },
      // 4. Tiger Longwing (Image 2 Bottom-Left)
      {
        id: 4,
        type: 'tiger-longwing',
        startX: 98,
        startY: 80,
        pathX: [78, 52, 28, 6, -6],
        pathY: [66, 46, 32, 18, 4],
        size: 54,
        duration: 19,
        delay: 7.5,
        flapSpeed: 0.2,
        depth: 'midground',
      },
      // 5. Golden Sulphur (Image 2 Bottom-Right)
      {
        id: 5,
        type: 'golden-sulphur',
        startX: -4,
        startY: 26,
        pathX: [18, 42, 66, 88, 105],
        pathY: [20, 32, 16, 24, 10],
        size: 52,
        duration: 15,
        delay: 9.8,
        flapSpeed: 0.19,
        depth: 'background',
      },
      // 6. Cyan Swallowtail Secondary Glider (Image 1)
      {
        id: 6,
        type: 'cyan-swallowtail',
        startX: 45,
        startY: 102,
        pathX: [40, 58, 36, 52, 62],
        pathY: [80, 58, 40, 22, -4],
        size: 55,
        duration: 21,
        delay: 12.5,
        flapSpeed: 0.24,
        depth: 'midground',
      },
    ],
    []
  );

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-20 ${className}`}
      aria-hidden="true"
    >
      {flock.map((butterfly) => (
        <RealisticButterflyFlight key={butterfly.id} {...butterfly} />
      ))}
    </div>
  );
}
