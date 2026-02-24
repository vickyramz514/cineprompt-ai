"use client";

import { motion } from "framer-motion";
import type { Niche } from "@/lib/template-schema";

interface NicheCardProps {
  niche: Niche;
  onClick?: () => void;
  index?: number;
}

export default function NicheCard({ niche, onClick, index = 0 }: NicheCardProps) {
  const Component = onClick ? motion.button : motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group relative flex h-full w-full shrink-0 flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
    >
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${niche.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <span className="relative text-4xl transition-transform duration-300 group-hover:scale-110">
        {niche.icon}
      </span>
      <div className="relative">
        <h3 className="font-semibold text-white">{niche.name}</h3>
        {niche.description && (
          <p className="mt-0.5 text-xs text-white/50 line-clamp-2">{niche.description}</p>
        )}
      </div>
    </Component>
  );
}
