"use client";

import { motion } from "framer-motion";

/**
 * Full-viewport animated market chart for auth pages (unique gradient ids vs hero).
 */
export default function AuthMarketChartBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0 flex min-h-full items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="flex h-[120vh] w-[130vw] min-w-full max-w-[1600px] items-end justify-center opacity-[0.92] sm:opacity-100"
          animate={{ opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            className="h-full w-full max-h-[900px] shrink-0"
            viewBox="0 0 1200 420"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="auth-chart-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(129, 140, 248)" stopOpacity="0.28" />
                <stop offset="50%" stopColor="rgb(99, 102, 241)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="rgb(15, 15, 20)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="auth-chart-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(165, 180, 252)" />
                <stop offset="50%" stopColor="rgb(129, 140, 248)" />
                <stop offset="100%" stopColor="rgb(167, 139, 250)" />
              </linearGradient>
              <linearGradient id="auth-chart-glow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
                <stop offset="50%" stopColor="rgb(129, 140, 248)" stopOpacity="0.4" />
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
                stroke="rgba(255,255,255,0.035)"
                strokeWidth="1"
              />
            ))}

            {[
              [40, 280, 12],
              [96, 260, 14],
              [152, 240, 15],
              [208, 220, 16],
              [264, 200, 18],
              [320, 210, 16],
              [376, 205, 15],
              [432, 190, 14],
              [488, 175, 16],
              [544, 150, 17],
              [600, 130, 18],
              [656, 115, 17],
              [712, 95, 18],
              [768, 80, 19],
              [824, 65, 18],
              [880, 55, 17],
              [936, 48, 16],
              [992, 38, 18],
              [1048, 32, 16],
              [1104, 25, 15],
              [1160, 20, 14],
            ].map(([x, h, w], i) => (
              <rect
                key={i}
                x={x as number}
                y={380 - (h as number)}
                width={w as number}
                height={h as number}
                rx="2"
                fill="rgba(99, 102, 241, 0.1)"
              />
            ))}

            <motion.path
              fill="url(#auth-chart-area)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              d="M0,380 L0,300 C100,280 160,330 260,250 C360,170 400,220 500,160 C600,100 640,140 740,90 C840,40 880,85 980,55 C1060,32 1120,60 1200,40 L1200,380 Z"
            />

            <motion.path
              fill="none"
              stroke="url(#auth-chart-line)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
              d="M0,300 C100,280 160,330 260,250 C360,170 400,220 500,160 C600,100 640,140 740,90 C840,40 880,85 980,55 C1060,32 1120,60 1200,40"
            />

            <motion.path
              fill="none"
              stroke="url(#auth-chart-glow)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.32}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              d="M0,300 C100,280 160,330 260,250 C360,170 400,220 500,160 C600,100 640,140 740,90 C840,40 880,85 980,55 C1060,32 1120,60 1200,40"
            />

            <motion.path
              fill="none"
              stroke="rgba(129, 140, 248, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="6 10"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 2.6, ease: "easeInOut", delay: 0.35 }}
              d="M0,332 C120,298 210,352 330,262 C450,172 515,228 635,138 C755,48 805,95 925,58 C1015,28 1095,72 1200,52"
            />

            {[
              [230, 265, 40, 8],
              [340, 210, 44, 10],
              [480, 155, 42, 9],
              [620, 105, 38, 10],
              [760, 72, 36, 9],
              [900, 58, 40, 10],
            ].map(([x, y, h, w], i) => (
              <motion.g
                key={`ac-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.38, y: 0 }}
                transition={{ delay: 0.85 + i * 0.08, duration: 0.45 }}
              >
                <rect
                  x={(x as number) - (w as number) / 2}
                  y={y as number}
                  width={w as number}
                  height={h as number}
                  rx="1.5"
                  fill="rgba(196, 181, 253, 0.5)"
                />
                <line
                  x1={x as number}
                  y1={(y as number) - 14}
                  x2={x as number}
                  y2={(y as number) + (h as number) + 14}
                  stroke="rgba(165, 180, 252, 0.32)"
                  strokeWidth="1.5"
                />
              </motion.g>
            ))}
          </svg>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/70" />
    </div>
  );
}
