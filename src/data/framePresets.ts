// Preset frames specifically designed for Guest Name Label on Envelope
// 10 Distinct, Highly Diverse Luxury Styles (Cambodian Royal Heritage & Modern Luxury)

export interface FramePreset {
  id: string;
  nameKh: string;
  nameEn: string;
  imageUrl: string;
  previewUrl: string;
}

// -------------------------------------------------------------
// 1. Royal 3D Golden Riveted Pointed Plaque (Exact Match to Screenshot)
// -------------------------------------------------------------
const generateRivetDots = () => {
  const dots: string[] = [];
  for (let x = 80; x <= 520; x += 18) {
    dots.push(`<circle cx="${x}" cy="15" r="2.2" fill="url(#rivet1)" stroke="#784504" stroke-width="0.4" />
      <circle cx="${x - 0.6}" cy="14.4" r="0.7" fill="#ffffff" opacity="0.85" />`);
  }
  for (let x = 80; x <= 520; x += 18) {
    dots.push(`<circle cx="${x}" cy="115" r="2.2" fill="url(#rivet1)" stroke="#784504" stroke-width="0.4" />
      <circle cx="${x - 0.6}" cy="114.4" r="0.7" fill="#ffffff" opacity="0.85" />`);
  }
  const leftPts = [[64, 23], [50, 34], [37, 47], [25, 65], [37, 83], [50, 96], [64, 107]];
  leftPts.forEach(([cx, cy]) => {
    dots.push(`<circle cx="${cx}" cy="${cy}" r="2.2" fill="url(#rivet1)" stroke="#784504" stroke-width="0.4" />
      <circle cx="${cx - 0.6}" cy="${cy - 0.6}" r="0.7" fill="#ffffff" opacity="0.85" />`);
  });
  const rightPts = [[536, 23], [550, 34], [563, 47], [575, 65], [563, 83], [550, 96], [536, 107]];
  rightPts.forEach(([cx, cy]) => {
    dots.push(`<circle cx="${cx}" cy="${cy}" r="2.2" fill="url(#rivet1)" stroke="#784504" stroke-width="0.4" />
      <circle cx="${cx - 0.6}" cy="${cy - 0.6}" r="0.7" fill="#ffffff" opacity="0.85" />`);
  });
  return dots.join('\n');
};

const FRAME_01_RIVETED_PLAQUE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="frame1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff8c4" /><stop offset="15%" stop-color="#f5ce53" /><stop offset="35%" stop-color="#dfa424" />
      <stop offset="55%" stop-color="#fde488" /><stop offset="80%" stop-color="#b4780e" /><stop offset="100%" stop-color="#734903" />
    </linearGradient>
    <linearGradient id="plate1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff6cc" /><stop offset="18%" stop-color="#fae188" /><stop offset="45%" stop-color="#f5cd5a" />
      <stop offset="70%" stop-color="#e8ad28" /><stop offset="90%" stop-color="#d49516" /><stop offset="100%" stop-color="#ba7d0b" />
    </linearGradient>
    <radialGradient id="plateRadial1" cx="50%" cy="48%" r="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" /><stop offset="45%" stop-color="#fff4b8" stop-opacity="0.2" />
      <stop offset="85%" stop-color="#c28308" stop-opacity="0.15" /><stop offset="100%" stop-color="#804d02" stop-opacity="0.35" />
    </radialGradient>
    <radialGradient id="rivet1" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff" /><stop offset="30%" stop-color="#ffec99" /><stop offset="65%" stop-color="#d99818" /><stop offset="100%" stop-color="#6e4202" />
    </radialGradient>
    <filter id="shadow1" x="-8%" y="-15%" width="116%" height="135%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#2d1702" flood-opacity="0.45"/>
    </filter>
  </defs>
  <path d="M 65,8 L 535,8 C 555,8 574,24 592,65 C 574,106 555,122 535,122 L 65,122 C 45,122 26,106 8,65 C 26,24 45,8 65,8 Z"
        fill="url(#frame1)" stroke="#804f03" stroke-width="1" filter="url(#shadow1)" />
  <path d="M 66,10 L 534,10 C 553,10 571,25 588,65 C 571,105 553,120 534,120 L 66,120 C 47,120 29,105 12,65 C 29,25 47,10 66,10 Z"
        fill="none" stroke="#fff9d6" stroke-width="1" opacity="0.8" />
  ${generateRivetDots()}
  <path d="M 68,20 L 532,20 C 548,20 562,32 576,65 C 562,98 548,110 532,110 L 68,110 C 52,110 38,98 24,65 C 38,32 52,20 68,20 Z"
        fill="none" stroke="#804f03" stroke-width="1.8" />
  <path d="M 70,22 L 530,22 C 546,22 559,34 573,65 C 559,96 546,108 530,108 L 70,108 C 54,108 41,96 27,65 C 41,34 54,22 70,22 Z"
        fill="url(#plate1)" />
  <path d="M 70,22 L 530,22 C 546,22 559,34 573,65 C 559,96 546,108 530,108 L 70,108 C 54,108 41,96 27,65 C 41,34 54,22 70,22 Z"
        fill="url(#plateRadial1)" stroke="#946107" stroke-width="1" opacity="0.9" />
</svg>
`)}`;

// -------------------------------------------------------------
// 2. Angkor Royal Lotus Winged Cartouche (Champagne Silk + Ornate Lotus Petals)
// -------------------------------------------------------------
const FRAME_02_ANGKOR_LOTUS = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="silk2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" /><stop offset="35%" stop-color="#fff8eb" /><stop offset="70%" stop-color="#faedd1" /><stop offset="100%" stop-color="#fff5e0" />
    </linearGradient>
    <linearGradient id="gold2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff4b0" /><stop offset="25%" stop-color="#eab308" /><stop offset="50%" stop-color="#fef08a" /><stop offset="75%" stop-color="#b45309" /><stop offset="100%" stop-color="#78350f" />
    </linearGradient>
    <filter id="shadow2" x="-10%" y="-15%" width="120%" height="135%">
      <feDropShadow dx="0" dy="3.5" stdDeviation="3.5" flood-color="#3b1d03" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Main Cartouche Body -->
  <rect x="90" y="16" width="420" height="98" rx="20" fill="url(#silk2)" stroke="url(#gold2)" stroke-width="3" filter="url(#shadow2)"/>
  <rect x="96" y="22" width="408" height="86" rx="14" fill="none" stroke="url(#gold2)" stroke-width="1.2" stroke-dasharray="6,3" opacity="0.8"/>
  
  <!-- Left Grand Lotus Wings -->
  <g transform="translate(0, 0)" filter="url(#shadow2)">
    <path d="M 92,65 C 60,65 30,50 6,65 C 30,80 60,65 92,65 Z" fill="url(#gold2)" stroke="#78350f" stroke-width="0.8"/>
    <path d="M 90,30 C 55,20 35,42 16,65 C 40,55 70,48 90,30 Z" fill="url(#gold2)" stroke="#78350f" stroke-width="0.8"/>
    <path d="M 90,100 C 55,110 35,88 16,65 C 40,75 70,82 90,100 Z" fill="url(#gold2)" stroke="#78350f" stroke-width="0.8"/>
    <circle cx="50" cy="65" r="5" fill="#ffffff" stroke="url(#gold2)" stroke-width="1.5"/>
    <circle cx="25" cy="65" r="3" fill="#ffffff"/>
  </g>

  <!-- Right Grand Lotus Wings -->
  <g transform="translate(600, 0) scale(-1, 1)" filter="url(#shadow2)">
    <path d="M 92,65 C 60,65 30,50 6,65 C 30,80 60,65 92,65 Z" fill="url(#gold2)" stroke="#78350f" stroke-width="0.8"/>
    <path d="M 90,30 C 55,20 35,42 16,65 C 40,55 70,48 90,30 Z" fill="url(#gold2)" stroke="#78350f" stroke-width="0.8"/>
    <path d="M 90,100 C 55,110 35,88 16,65 C 40,75 70,82 90,100 Z" fill="url(#gold2)" stroke="#78350f" stroke-width="0.8"/>
    <circle cx="50" cy="65" r="5" fill="#ffffff" stroke="url(#gold2)" stroke-width="1.5"/>
    <circle cx="25" cy="65" r="3" fill="#ffffff"/>
  </g>

  <!-- Top Center Lotus Crown -->
  <path d="M 270,16 Q 300,2 330,16 Q 300,22 270,16 Z" fill="url(#gold2)" stroke="#78350f" stroke-width="0.6"/>
  <circle cx="300" cy="8" r="3.5" fill="#ffffff" stroke="url(#gold2)" stroke-width="1"/>
  <!-- Bottom Center Lotus Crown -->
  <path d="M 270,114 Q 300,128 330,114 Q 300,108 270,114 Z" fill="url(#gold2)" stroke="#78350f" stroke-width="0.6"/>
  <circle cx="300" cy="122" r="3.5" fill="#ffffff" stroke="url(#gold2)" stroke-width="1"/>
</svg>
`)}`;

// -------------------------------------------------------------
// 3. Royal Golden Ribbon Banner (3D Draped Silk Ribbon with Swallowtail Ends)
// -------------------------------------------------------------
const FRAME_03_ROYAL_RIBBON = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="ribbonMain3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff8db" /><stop offset="25%" stop-color="#fae291" /><stop offset="55%" stop-color="#f5cd5a" /><stop offset="85%" stop-color="#d9991e" /><stop offset="100%" stop-color="#996303" />
    </linearGradient>
    <linearGradient id="ribbonTail3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#b4780e" /><stop offset="50%" stop-color="#784b04" /><stop offset="100%" stop-color="#452701" />
    </linearGradient>
    <linearGradient id="ribbonParchment3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" /><stop offset="50%" stop-color="#fffdf5" /><stop offset="100%" stop-color="#fdf5e2" />
    </linearGradient>
    <filter id="ribbonShadow3" x="-8%" y="-15%" width="116%" height="135%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#2a1502" flood-opacity="0.4"/>
    </filter>
  </defs>
  
  <!-- Left Ribbon Back Fold & Tail -->
  <polygon points="65,30 15,30 40,65 15,100 65,100" fill="url(#ribbonTail3)" stroke="#523102" stroke-width="1"/>
  <polygon points="65,30 90,15 90,115 65,100" fill="#784704"/>

  <!-- Right Ribbon Back Fold & Tail -->
  <polygon points="535,30 585,30 560,65 585,100 535,100" fill="url(#ribbonTail3)" stroke="#523102" stroke-width="1"/>
  <polygon points="535,30 510,15 510,115 535,100" fill="#784704"/>

  <!-- Main Front Ribbon Body -->
  <path d="M 80,15 L 520,15 C 530,15 538,23 538,33 L 538,97 C 538,107 530,115 520,115 L 80,115 C 70,115 62,107 62,97 L 62,33 C 62,23 70,15 80,15 Z"
        fill="url(#ribbonMain3)" stroke="#804d02" stroke-width="2" filter="url(#ribbonShadow3)"/>

  <!-- Inner Inset Parchment Banner Panel -->
  <path d="M 86,23 L 514,23 C 520,23 526,29 526,35 L 526,95 C 526,101 520,107 514,107 L 86,107 C 80,107 74,101 74,95 L 74,35 C 74,29 80,23 86,23 Z"
        fill="url(#ribbonParchment3)" stroke="#b4780e" stroke-width="1"/>

  <!-- Gold Braided Accent Lines -->
  <line x1="88" y1="27" x2="512" y2="27" stroke="url(#ribbonMain3)" stroke-width="1.5"/>
  <line x1="88" y1="103" x2="512" y2="103" stroke="url(#ribbonMain3)" stroke-width="1.5"/>

  <!-- Center Crest Medallion -->
  <circle cx="300" cy="15" r="7" fill="url(#ribbonMain3)" stroke="#804d02" stroke-width="1"/>
  <circle cx="300" cy="15" r="3" fill="#ffffff"/>
</svg>
`)}`;

// -------------------------------------------------------------
// 4. Banteay Srei Temple Pediment & Arch (ហោជាងប្រាសាទបន្ទាយស្រី)
// -------------------------------------------------------------
const FRAME_04_BANTEAY_SREI_ARCH = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="templeGold4" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fae388" /><stop offset="25%" stop-color="#e2a829" /><stop offset="50%" stop-color="#fff0aa" /><stop offset="75%" stop-color="#b47509" /><stop offset="100%" stop-color="#693c01" />
    </linearGradient>
    <linearGradient id="templeBg4" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffdf8" /><stop offset="50%" stop-color="#faedd2" /><stop offset="100%" stop-color="#f4dfb5" />
    </linearGradient>
    <filter id="templeShadow4" x="-8%" y="-15%" width="116%" height="135%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#301902" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Architectural Stepped Temple Gable Silhouette -->
  <path d="M 45,65 L 75,22 L 260,22 L 300,5 L 340,22 L 525,22 L 555,65 L 525,108 L 340,108 L 300,125 L 260,108 L 75,108 Z"
        fill="url(#templeBg4)" stroke="url(#templeGold4)" stroke-width="3.5" filter="url(#templeShadow4)"/>

  <!-- Inner Accent Inset Arch -->
  <path d="M 55,65 L 82,28 L 262,28 L 300,14 L 338,28 L 518,28 L 545,65 L 518,102 L 338,102 L 300,116 L 262,102 L 82,102 Z"
        fill="none" stroke="url(#templeGold4)" stroke-width="1.2" stroke-dasharray="5,2.5" opacity="0.85"/>

  <!-- Left Corner Temple Eaves Carvings -->
  <g transform="translate(18, 65)">
    <path d="M 0,0 Q 20,-30 42,-18 Q 30,0 42,18 Q 20,30 0,0 Z" fill="url(#templeGold4)" stroke="#693c01" stroke-width="0.8"/>
    <circle cx="22" cy="0" r="4" fill="#ffffff" stroke="url(#templeGold4)" stroke-width="1"/>
  </g>
  <!-- Right Corner Temple Eaves Carvings -->
  <g transform="translate(582, 65) scale(-1, 1)">
    <path d="M 0,0 Q 20,-30 42,-18 Q 30,0 42,18 Q 20,30 0,0 Z" fill="url(#templeGold4)" stroke="#693c01" stroke-width="0.8"/>
    <circle cx="22" cy="0" r="4" fill="#ffffff" stroke="url(#templeGold4)" stroke-width="1"/>
  </g>

  <!-- Top Peak Prasat Finial -->
  <polygon points="300,2 308,12 300,10 292,12" fill="url(#templeGold4)" stroke="#693c01" stroke-width="0.6"/>
  <!-- Bottom Peak Prasat Finial -->
  <polygon points="300,128 308,118 300,120 292,118" fill="url(#templeGold4)" stroke="#693c01" stroke-width="0.6"/>
</svg>
`)}`;

// -------------------------------------------------------------
// 5. Octagonal Sacred Chan Medallion Plaque (ស៊ុមផ្កាចន្ទន៍មាស ៨ទិស)
// -------------------------------------------------------------
const FRAME_05_CHAN_OCTAGON = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="octGold5" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff8cc" /><stop offset="20%" stop-color="#f5cd5a" /><stop offset="50%" stop-color="#d9991e" /><stop offset="80%" stop-color="#fae188" /><stop offset="100%" stop-color="#693a02" />
    </linearGradient>
    <linearGradient id="octPlate5" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fae7a5" /><stop offset="35%" stop-color="#f5d166" /><stop offset="70%" stop-color="#e5a720" /><stop offset="100%" stop-color="#c4830c" />
    </linearGradient>
    <pattern id="diamondLattice5" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 10,0 L 20,10 L 10,20 L 0,10 Z" fill="none" stroke="#d49a20" stroke-width="0.6" stroke-opacity="0.3"/>
      <circle cx="10" cy="10" r="1.2" fill="#c4830c" opacity="0.35"/>
    </pattern>
    <filter id="octShadow5" x="-8%" y="-15%" width="116%" height="135%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#2d1601" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Octagonal Beveled Silhouette -->
  <polygon points="45,65 75,12 525,12 555,65 525,118 75,118"
           fill="url(#octGold5)" stroke="#693a02" stroke-width="2" filter="url(#octShadow5)"/>

  <!-- Inner Plate with Diamond Trellis Texture -->
  <polygon points="54,65 80,18 520,18 546,65 520,112 80,112"
           fill="url(#octPlate5)"/>
  <polygon points="54,65 80,18 520,18 546,65 520,112 80,112"
           fill="url(#diamondLattice5)"/>
  <polygon points="54,65 80,18 520,18 546,65 520,112 80,112"
           fill="none" stroke="#804d02" stroke-width="1.2"/>

  <!-- Left 8-Petal Chan Medallion -->
  <g transform="translate(48, 65)">
    <polygon points="-12,0 0,-12 12,0 0,12" fill="url(#octGold5)" stroke="#693a02" stroke-width="0.8"/>
    <polygon points="-8,0 0,-8 8,0 0,8" fill="#ffffff"/>
    <circle cx="0" cy="0" r="3.5" fill="#f59e0b"/>
  </g>
  <!-- Right 8-Petal Chan Medallion -->
  <g transform="translate(552, 65)">
    <polygon points="-12,0 0,-12 12,0 0,12" fill="url(#octGold5)" stroke="#693a02" stroke-width="0.8"/>
    <polygon points="-8,0 0,-8 8,0 0,8" fill="#ffffff"/>
    <circle cx="0" cy="0" r="3.5" fill="#f59e0b"/>
  </g>

  <!-- Top Center Chan Diamond -->
  <polygon points="300,6 308,12 300,18 292,12" fill="url(#octGold5)" stroke="#ffffff" stroke-width="0.8"/>
  <!-- Bottom Center Chan Diamond -->
  <polygon points="300,112 308,118 300,124 292,118" fill="url(#octGold5)" stroke="#ffffff" stroke-width="0.8"/>
</svg>
`)}`;

// -------------------------------------------------------------
// 6. Royal 7-Headed Naga Golden Crest (ស៊ុមក្បាច់នាគរាជមាសរាជវង្ស)
// -------------------------------------------------------------
const FRAME_06_ROYAL_NAGA = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="nagaGold6" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff3a6" /><stop offset="20%" stop-color="#f5cd5a" /><stop offset="50%" stop-color="#b4780e" /><stop offset="75%" stop-color="#fde488" /><stop offset="100%" stop-color="#542e01" />
    </linearGradient>
    <linearGradient id="nagaBg6" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffef7" /><stop offset="50%" stop-color="#faedd2" /><stop offset="100%" stop-color="#f3ddad" />
    </linearGradient>
    <filter id="nagaShadow6" x="-10%" y="-15%" width="120%" height="135%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#2a1501" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Scalloped Dragon-Scales Outer Capsule -->
  <path d="M 85,14 L 515,14 C 545,14 570,36 585,65 C 570,94 545,116 515,116 L 85,116 C 55,116 30,94 15,65 C 30,36 55,14 85,14 Z"
        fill="url(#nagaBg6)" stroke="url(#nagaGold6)" stroke-width="3.5" filter="url(#nagaShadow6)"/>

  <!-- Inner Border with Scale Punctures -->
  <path d="M 90,20 L 510,20 C 538,20 560,40 574,65 C 560,90 538,110 510,110 L 90,110 C 62,110 40,90 26,65 C 40,40 62,20 90,20 Z"
        fill="none" stroke="url(#nagaGold6)" stroke-width="1.2" stroke-dasharray="4,3"/>

  <!-- Left 7-Tier Naga Multi-Crest & Ruby Gem -->
  <g transform="translate(10, 65)" filter="url(#nagaShadow6)">
    <path d="M 0,0 Q 25,-26 50,-15 Q 38,0 50,15 Q 25,26 0,0 Z" fill="url(#nagaGold6)" stroke="#542e01" stroke-width="0.8"/>
    <path d="M 22,-14 Q 40,-48 70,-38 Q 54,-18 38,-8 Z" fill="url(#nagaGold6)" stroke="#542e01" stroke-width="0.8"/>
    <path d="M 22,14 Q 40,48 70,38 Q 54,18 38,8 Z" fill="url(#nagaGold6)" stroke="#542e01" stroke-width="0.8"/>
    <!-- Ruby Gem Center -->
    <circle cx="30" cy="0" r="5" fill="#dc2626" stroke="#ffffff" stroke-width="1.2"/>
    <circle cx="28.5" cy="-1.5" r="1.5" fill="#ffffff" opacity="0.8"/>
  </g>

  <!-- Right 7-Tier Naga Multi-Crest & Ruby Gem -->
  <g transform="translate(590, 65) scale(-1, 1)" filter="url(#nagaShadow6)">
    <path d="M 0,0 Q 25,-26 50,-15 Q 38,0 50,15 Q 25,26 0,0 Z" fill="url(#nagaGold6)" stroke="#542e01" stroke-width="0.8"/>
    <path d="M 22,-14 Q 40,-48 70,-38 Q 54,-18 38,-8 Z" fill="url(#nagaGold6)" stroke="#542e01" stroke-width="0.8"/>
    <path d="M 22,14 Q 40,48 70,38 Q 54,18 38,8 Z" fill="url(#nagaGold6)" stroke="#542e01" stroke-width="0.8"/>
    <circle cx="30" cy="0" r="5" fill="#dc2626" stroke="#ffffff" stroke-width="1.2"/>
    <circle cx="28.5" cy="-1.5" r="1.5" fill="#ffffff" opacity="0.8"/>
  </g>

  <!-- Top Center Naga Flame Crown -->
  <path d="M 280,14 Q 300,0 320,14 Q 300,18 280,14 Z" fill="url(#nagaGold6)" stroke="#542e01" stroke-width="0.6"/>
  <circle cx="300" cy="5" r="2.5" fill="#dc2626"/>
</svg>
`)}`;

// -------------------------------------------------------------
// 7. Celestial Teppanom Winged Crest (ស៊ុមទេពប្រណម្យស្លាបហោះមាស)
// -------------------------------------------------------------
const FRAME_07_TEPPANOM_WINGS = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="angelGold7" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffbe0" /><stop offset="25%" stop-color="#fae188" /><stop offset="55%" stop-color="#e8ad28" /><stop offset="85%" stop-color="#b47509" /><stop offset="100%" stop-color="#693b01" />
    </linearGradient>
    <linearGradient id="angelBg7" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" /><stop offset="50%" stop-color="#fff9ee" /><stop offset="100%" stop-color="#fef2dc" />
    </linearGradient>
    <filter id="angelShadow7" x="-10%" y="-15%" width="120%" height="135%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#2a1401" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Cartouche with Sweeping Concave Curves -->
  <path d="M 90,14 Q 300,24 510,14 C 540,14 565,36 580,65 C 565,94 540,116 510,116 Q 300,106 90,116 C 60,116 35,94 20,65 C 35,36 60,14 90,14 Z"
        fill="url(#angelBg7)" stroke="url(#angelGold7)" stroke-width="3" filter="url(#angelShadow7)"/>

  <!-- Left Upward Soaring Angelic Wings -->
  <g transform="translate(14, 65)" filter="url(#angelShadow7)">
    <path d="M 0,0 Q 20,-35 48,-24 Q 34,0 48,24 Q 20,35 0,0 Z" fill="url(#angelGold7)" stroke="#693b01" stroke-width="0.8"/>
    <path d="M 18,-16 Q 36,-50 68,-42 Q 52,-20 36,-10 Z" fill="url(#angelGold7)" stroke="#693b01" stroke-width="0.8"/>
    <path d="M 18,16 Q 36,50 68,42 Q 52,20 36,10 Z" fill="url(#angelGold7)" stroke="#693b01" stroke-width="0.8"/>
    <circle cx="22" cy="0" r="4.5" fill="#ffffff" stroke="url(#angelGold7)" stroke-width="1.2"/>
  </g>

  <!-- Right Upward Soaring Angelic Wings -->
  <g transform="translate(586, 65) scale(-1, 1)" filter="url(#angelShadow7)">
    <path d="M 0,0 Q 20,-35 48,-24 Q 34,0 48,24 Q 20,35 0,0 Z" fill="url(#angelGold7)" stroke="#693b01" stroke-width="0.8"/>
    <path d="M 18,-16 Q 36,-50 68,-42 Q 52,-20 36,-10 Z" fill="url(#angelGold7)" stroke="#693b01" stroke-width="0.8"/>
    <path d="M 18,16 Q 36,50 68,42 Q 52,20 36,10 Z" fill="url(#angelGold7)" stroke="#693b01" stroke-width="0.8"/>
    <circle cx="22" cy="0" r="4.5" fill="#ffffff" stroke="url(#angelGold7)" stroke-width="1.2"/>
  </g>

  <!-- Top Center Spire Crown -->
  <path d="M 285,18 L 300,2 L 315,18 Z" fill="url(#angelGold7)" stroke="#693b01" stroke-width="0.8"/>
  <circle cx="300" cy="12" r="2.5" fill="#ffffff"/>
  <!-- Bottom Center Spire Crown -->
  <path d="M 285,112 L 300,128 L 315,112 Z" fill="url(#angelGold7)" stroke="#693b01" stroke-width="0.8"/>
  <circle cx="300" cy="118" r="2.5" fill="#ffffff"/>
</svg>
`)}`;

// -------------------------------------------------------------
// 8. Royal Jasmine Floral Vine Garland (ស៊ុមភ្ញីវល្លិផ្កាម្លិះមាស)
// -------------------------------------------------------------
const FRAME_08_JASMINE_VINE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="vineGold8" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff8d4" /><stop offset="25%" stop-color="#fae388" /><stop offset="60%" stop-color="#d9991e" /><stop offset="100%" stop-color="#734702" />
    </linearGradient>
    <linearGradient id="vineBg8" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" /><stop offset="50%" stop-color="#fdfbf7" /><stop offset="100%" stop-color="#faf5e8" />
    </linearGradient>
    <filter id="vineShadow8" x="-8%" y="-15%" width="116%" height="135%">
      <feDropShadow dx="0" dy="3.5" stdDeviation="3.5" flood-color="#2d1702" flood-opacity="0.38"/>
    </filter>
  </defs>

  <!-- Double-Rim Oval Silhouette -->
  <rect x="70" y="14" width="460" height="102" rx="51" fill="url(#vineBg8)" stroke="url(#vineGold8)" stroke-width="2.5" filter="url(#vineShadow8)"/>
  <rect x="78" y="22" width="444" height="86" rx="43" fill="none" stroke="url(#vineGold8)" stroke-width="1" stroke-dasharray="3,3" opacity="0.8"/>

  <!-- Left Blooming Jasmine Vine -->
  <g transform="translate(68, 65)">
    <!-- Vine Stem -->
    <path d="M 0,-40 Q -30,-20 -30,0 Q -30,20 0,40" fill="none" stroke="url(#vineGold8)" stroke-width="2"/>
    <!-- Jasmine Blossoms -->
    <circle cx="-30" cy="0" r="6" fill="#ffffff" stroke="url(#vineGold8)" stroke-width="1.5"/>
    <circle cx="-30" cy="0" r="2.5" fill="#f59e0b"/>
    <circle cx="-20" cy="-24" r="4.5" fill="#ffffff" stroke="url(#vineGold8)" stroke-width="1.2"/>
    <circle cx="-20" cy="24" r="4.5" fill="#ffffff" stroke="url(#vineGold8)" stroke-width="1.2"/>
    <!-- Gold Leaves -->
    <path d="M -26,-12 Q -40,-16 -36,-6 Z" fill="url(#vineGold8)"/>
    <path d="M -26,12 Q -40,16 -36,6 Z" fill="url(#vineGold8)"/>
  </g>

  <!-- Right Blooming Jasmine Vine -->
  <g transform="translate(532, 65) scale(-1, 1)">
    <path d="M 0,-40 Q -30,-20 -30,0 Q -30,20 0,40" fill="none" stroke="url(#vineGold8)" stroke-width="2"/>
    <circle cx="-30" cy="0" r="6" fill="#ffffff" stroke="url(#vineGold8)" stroke-width="1.5"/>
    <circle cx="-30" cy="0" r="2.5" fill="#f59e0b"/>
    <circle cx="-20" cy="-24" r="4.5" fill="#ffffff" stroke="url(#vineGold8)" stroke-width="1.2"/>
    <circle cx="-20" cy="24" r="4.5" fill="#ffffff" stroke="url(#vineGold8)" stroke-width="1.2"/>
    <path d="M -26,-12 Q -40,-16 -36,-6 Z" fill="url(#vineGold8)"/>
    <path d="M -26,12 Q -40,16 -36,6 Z" fill="url(#vineGold8)"/>
  </g>

  <!-- Top Center Blossom -->
  <circle cx="300" cy="14" r="4" fill="#ffffff" stroke="url(#vineGold8)" stroke-width="1"/>
  <circle cx="300" cy="14" r="1.5" fill="#f59e0b"/>
  <!-- Bottom Center Blossom -->
  <circle cx="300" cy="116" r="4" fill="#ffffff" stroke="url(#vineGold8)" stroke-width="1"/>
  <circle cx="300" cy="116" r="1.5" fill="#f59e0b"/>
</svg>
`)}`;

// -------------------------------------------------------------
// 9. Royal Teakwood & 24K Gold Inlay Plaque (ស៊ុមបន្ទះឈើប្រណិតក្បាច់មាស)
// -------------------------------------------------------------
const FRAME_09_TEAK_GOLD = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" width="100%" height="100%" fill="none">
  <defs>
    <!-- Deep Mahogany Teakwood Gradient -->
    <linearGradient id="teakWood9" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3d1d08" /><stop offset="35%" stop-color="#2a1203" /><stop offset="70%" stop-color="#1f0c01" /><stop offset="100%" stop-color="#3b1905" />
    </linearGradient>
    <!-- 24K Solid Gold Gradient -->
    <linearGradient id="goldInlay9" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff8cc" /><stop offset="25%" stop-color="#fae188" /><stop offset="50%" stop-color="#e2a829" /><stop offset="80%" stop-color="#fce38a" /><stop offset="100%" stop-color="#734903" />
    </linearGradient>
    <filter id="teakShadow9" x="-8%" y="-15%" width="116%" height="135%">
      <feDropShadow dx="0" dy="5" stdDeviation="4.5" flood-color="#150801" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Heavy Beveled Outer Frame -->
  <rect x="50" y="10" width="500" height="110" rx="14" fill="url(#teakWood9)" stroke="url(#goldInlay9)" stroke-width="3" filter="url(#teakShadow9)"/>

  <!-- Inner Inset Gold Frame -->
  <rect x="62" y="20" width="476" height="90" rx="8" fill="#2d1404" stroke="url(#goldInlay9)" stroke-width="1.2"/>

  <!-- Glowing Center Plaque -->
  <rect x="68" y="24" width="464" height="82" rx="6" fill="#fff8e8"/>
  <rect x="68" y="24" width="464" height="82" rx="6" fill="url(#goldInlay9)" opacity="0.3"/>

  <!-- Heavy 24K Gold Corner Brackets -->
  <!-- Top Left -->
  <path d="M 50,10 L 80,10 L 80,22 L 62,22 L 62,40 L 50,40 Z" fill="url(#goldInlay9)" stroke="#523102" stroke-width="0.8"/>
  <!-- Top Right -->
  <path d="M 550,10 L 520,10 L 520,22 L 538,22 L 538,40 L 550,40 Z" fill="url(#goldInlay9)" stroke="#523102" stroke-width="0.8"/>
  <!-- Bottom Left -->
  <path d="M 50,120 L 80,120 L 80,108 L 62,108 L 62,90 L 50,90 Z" fill="url(#goldInlay9)" stroke="#523102" stroke-width="0.8"/>
  <!-- Bottom Right -->
  <path d="M 550,120 L 520,120 L 520,108 L 538,108 L 538,90 L 550,90 Z" fill="url(#goldInlay9)" stroke="#523102" stroke-width="0.8"/>

  <!-- Left & Right Gold Filigree Side Medallions -->
  <g transform="translate(56, 65)">
    <polygon points="0,-12 12,0 0,12 -6,0" fill="url(#goldInlay9)"/>
    <circle cx="3" cy="0" r="2" fill="#ffffff"/>
  </g>
  <g transform="translate(544, 65) scale(-1, 1)">
    <polygon points="0,-12 12,0 0,12 -6,0" fill="url(#goldInlay9)"/>
    <circle cx="3" cy="0" r="2" fill="#ffffff"/>
  </g>
</svg>
`)}`;

// -------------------------------------------------------------
// 10. Preah Khan Royal Sunburst & Sacred Spear (ស៊ុមព្រះខ័នរាជរស្មីមាស)
// -------------------------------------------------------------
const FRAME_10_PREAH_KHAN_SUNBURST = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="sunGold10" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff8cc" /><stop offset="20%" stop-color="#f5cd5a" /><stop offset="50%" stop-color="#d9991e" /><stop offset="80%" stop-color="#fae188" /><stop offset="100%" stop-color="#693a02" />
    </linearGradient>
    <linearGradient id="sunPlate10" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" /><stop offset="35%" stop-color="#fff9ec" /><stop offset="70%" stop-color="#faedd2" /><stop offset="100%" stop-color="#fae5b6" />
    </linearGradient>
    <filter id="sunShadow10" x="-10%" y="-15%" width="120%" height="135%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#2d1601" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Diamond Pointed Body -->
  <polygon points="40,65 90,14 510,14 560,65 510,116 90,116"
           fill="url(#sunPlate10)" stroke="url(#sunGold10)" stroke-width="3" filter="url(#sunShadow10)"/>

  <!-- Inner Diamond Inset -->
  <polygon points="50,65 95,20 505,20 550,65 505,110 95,110"
           fill="none" stroke="url(#sunGold10)" stroke-width="1.2" stroke-dasharray="6,3"/>

  <!-- Left Sacred Spear Finial & Radiant Sunburst Rays -->
  <g transform="translate(25, 65)">
    <!-- Sunburst Rays -->
    <line x1="20" y1="0" x2="-15" y2="0" stroke="url(#sunGold10)" stroke-width="2.5"/>
    <line x1="18" y1="-8" x2="-10" y2="-20" stroke="url(#sunGold10)" stroke-width="1.8"/>
    <line x1="18" y1="8" x2="-10" y2="20" stroke="url(#sunGold10)" stroke-width="1.8"/>
    <!-- Sacred Spear Head -->
    <polygon points="0,0 24,-14 48,0 24,14" fill="url(#sunGold10)" stroke="#693a02" stroke-width="0.8"/>
    <polygon points="8,0 24,-8 40,0 24,8" fill="#ffffff" opacity="0.9"/>
    <circle cx="24" cy="0" r="3.5" fill="#f59e0b"/>
  </g>

  <!-- Right Sacred Spear Finial & Radiant Sunburst Rays -->
  <g transform="translate(575, 65) scale(-1, 1)">
    <line x1="20" y1="0" x2="-15" y2="0" stroke="url(#sunGold10)" stroke-width="2.5"/>
    <line x1="18" y1="-8" x2="-10" y2="-20" stroke="url(#sunGold10)" stroke-width="1.8"/>
    <line x1="18" y1="8" x2="-10" y2="20" stroke="url(#sunGold10)" stroke-width="1.8"/>
    <polygon points="0,0 24,-14 48,0 24,14" fill="url(#sunGold10)" stroke="#693a02" stroke-width="0.8"/>
    <polygon points="8,0 24,-8 40,0 24,8" fill="#ffffff" opacity="0.9"/>
    <circle cx="24" cy="0" r="3.5" fill="#f59e0b"/>
  </g>

  <!-- Top Center Spear Pinnacle -->
  <polygon points="300,4 308,14 300,12 292,14" fill="url(#sunGold10)" stroke="#693a02" stroke-width="0.6"/>
  <!-- Bottom Center Spear Pinnacle -->
  <polygon points="300,126 308,116 300,118 292,116" fill="url(#sunGold10)" stroke="#693a02" stroke-width="0.6"/>
</svg>
`)}`;

// -------------------------------------------------------------
// 10 Distinct Master Preset Array
// -------------------------------------------------------------
export const FRAME_PRESETS: FramePreset[] = [
  {
    id: 'golden-rivet-plaque',
    nameKh: '១. បន្ទះមាសកូនគន្លឹះបុរាណ (Golden Riveted Plaque)',
    nameEn: '1. Royal 3D Golden Riveted Pointed Plaque',
    imageUrl: FRAME_01_RIVETED_PLAQUE,
    previewUrl: FRAME_01_RIVETED_PLAQUE,
  },
  {
    id: 'angkor-lotus-winged',
    nameKh: '២. ស៊ុមផ្កាឈូកមាសអង្គរ (Angkor Lotus Cartouche)',
    nameEn: '2. Angkor Wat Lotus Winged Silk Cartouche',
    imageUrl: FRAME_02_ANGKOR_LOTUS,
    previewUrl: FRAME_02_ANGKOR_LOTUS,
  },
  {
    id: 'royal-gold-ribbon',
    nameKh: '៣. បូខ្សែបូរាជវង្សមាស (3D Royal Gold Ribbon)',
    nameEn: '3. 3D Royal Gold Draped Ribbon Banner',
    imageUrl: FRAME_03_ROYAL_RIBBON,
    previewUrl: FRAME_03_ROYAL_RIBBON,
  },
  {
    id: 'banteay-srei-arch',
    nameKh: '៤. ហោជាងប្រាសាទបន្ទាយស្រី (Banteay Srei Arch)',
    nameEn: '4. Banteay Srei Stepped Temple Pediment & Arch',
    imageUrl: FRAME_04_BANTEAY_SREI_ARCH,
    previewUrl: FRAME_04_BANTEAY_SREI_ARCH,
  },
  {
    id: 'chan-blossom-octagon',
    nameKh: '៥. ស៊ុមផ្កាចន្ទន៍មាស ៨ទិស (Sacred Chan Octagon)',
    nameEn: '5. Octagonal Sacred Chan Medallion Plaque',
    imageUrl: FRAME_05_CHAN_OCTAGON,
    previewUrl: FRAME_05_CHAN_OCTAGON,
  },
  {
    id: 'royal-naga-crest',
    nameKh: '៦. ស៊ុមក្បាច់នាគរាជមាស (Royal Naga Crest)',
    nameEn: '6. Royal 7-Headed Naga Golden Crest with Ruby',
    imageUrl: FRAME_06_ROYAL_NAGA,
    previewUrl: FRAME_06_ROYAL_NAGA,
  },
  {
    id: 'teppanom-wings-crest',
    nameKh: '៧. ស៊ុមទេពប្រណម្យស្លាបមាស (Celestial Teppanom)',
    nameEn: '7. Celestial Teppanom Winged Crest Cartouche',
    imageUrl: FRAME_07_TEPPANOM_WINGS,
    previewUrl: FRAME_07_TEPPANOM_WINGS,
  },
  {
    id: 'jasmine-vine-garland',
    nameKh: '៨. ស៊ុមភ្ញីវល្លិផ្កាម្លិះមាស (Royal Jasmine Garland)',
    nameEn: '8. Royal Jasmine Floral Vine Garland Oval',
    imageUrl: FRAME_08_JASMINE_VINE,
    previewUrl: FRAME_08_JASMINE_VINE,
  },
  {
    id: 'royal-teakwood-gold',
    nameKh: '៩. បន្ទះឈើប្រណិតក្បាច់មាស (Teakwood & 24K Gold)',
    nameEn: '9. Royal Teakwood & 24K Gold Inlay Plaque',
    imageUrl: FRAME_09_TEAK_GOLD,
    previewUrl: FRAME_09_TEAK_GOLD,
  },
  {
    id: 'preah-khan-sunburst',
    nameKh: '១០. ស៊ុមព្រះខ័នរាជរស្មីមាស (Preah Khan Sunburst)',
    nameEn: '10. Preah Khan Sunburst & Sacred Spear Finials',
    imageUrl: FRAME_10_PREAH_KHAN_SUNBURST,
    previewUrl: FRAME_10_PREAH_KHAN_SUNBURST,
  },
];
