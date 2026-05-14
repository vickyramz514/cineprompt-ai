"use client";

import { motion } from "framer-motion";

/**
 * Decorative market-style chart behind the hero (SVG, no external assets).
 */
export default function HeroMarketChartBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden"
      aria-hidden
    >
      <svg
        className="h-[min(55vh,520px)] w-[min(140%,1400px)] min-w-full shrink-0 opacity-90"
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(129, 140, 248)" stopOpacity="0.35" />
            <stop offset="45%" stopColor="rgb(99, 102, 241)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="rgb(15, 15, 20)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(165, 180, 252)" />
            <stop offset="50%" stopColor="rgb(129, 140, 248)" />
            <stop offset="100%" stopColor="rgb(167, 139, 250)" />
          </linearGradient>
          <linearGradient id="hero-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(129, 140, 248)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[80, 160, 240, 320].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="1200"
            y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {[
          [40, 280, 12],
          [68, 300, 10],
          [96, 260, 14],
          [124, 290, 11],
          [152, 240, 15],
          [180, 270, 12],
          [208, 220, 16],
          [236, 250, 13],
          [264, 200, 18],
          [292, 230, 14],
          [320, 210, 16],
          [348, 185, 20],
          [376, 205, 15],
          [404, 165, 18],
          [432, 190, 14],
          [460, 145, 22],
          [488, 175, 16],
          [516, 120, 20],
          [544, 150, 17],
          [572, 100, 24],
          [600, 130, 18],
          [628, 85, 22],
          [656, 115, 17],
          [684, 70, 20],
          [712, 95, 18],
          [740, 55, 24],
          [768, 80, 19],
          [796, 45, 22],
          [824, 65, 18],
          [852, 35, 20],
          [880, 55, 17],
          [908, 28, 22],
          [936, 48, 16],
          [964, 22, 20],
          [992, 38, 18],
          [1020, 18, 22],
          [1048, 32, 16],
          [1076, 15, 18],
          [1104, 25, 15],
          [1132, 12, 16],
          [1160, 20, 14],
        ].map(([x, h, w], i) => (
          <rect
            key={i}
            x={x as number}
            y={380 - (h as number)}
            width={w as number}
            height={h as number}
            rx="2"
            fill="rgba(99, 102, 241, 0.12)"
          />
        ))}

        <motion.path
          fill="url(#hero-area)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          d="M0,380 L0,320 C80,300 120,340 200,280 C280,220 340,260 420,200 C500,140 560,180 640,120 C720,60 780,100 860,70 C940,40 1000,80 1080,45 C1140,20 1180,50 1200,30 L1200,380 Z"
        />

        <motion.path
          fill="none"
          stroke="url(#hero-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          d="M0,320 C80,300 120,340 200,280 C280,220 340,260 420,200 C500,140 560,180 640,120 C720,60 780,100 860,70 C940,40 1000,80 1080,45 C1140,20 1180,50 1200,30"
        />

        <motion.path
          fill="none"
          stroke="url(#hero-glow)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.35}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          d="M0,320 C80,300 120,340 200,280 C280,220 340,260 420,200 C500,140 560,180 640,120 C720,60 780,100 860,70 C940,40 1000,80 1080,45 C1140,20 1180,50 1200,30"
        />

        {[
          [210, 255, 45, 8],
          [290, 230, 38, 10],
          [370, 195, 42, 9],
          [450, 155, 48, 11],
          [530, 125, 36, 9],
          [610, 95, 44, 10],
          [690, 72, 40, 9],
          [770, 88, 35, 8],
          [850, 58, 42, 10],
          [930, 48, 38, 9],
          [1010, 38, 40, 10],
        ].map(([x, y, h, w], i) => (
          <motion.g
            key={`c-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.35, y: 0 }}
            transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
          >
            <rect
              x={(x as number) - (w as number) / 2}
              y={y as number}
              width={w as number}
              height={h as number}
              rx="1.5"
              fill="rgba(196, 181, 253, 0.55)"
            />
            <line
              x1={x as number}
              y1={(y as number) - 12}
              x2={x as number}
              y2={(y as number) + (h as number) + 12}
              stroke="rgba(165, 180, 252, 0.35)"
              strokeWidth="1.5"
            />
          </motion.g>
        ))}
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
    </div>
  );
}
