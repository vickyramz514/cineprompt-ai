"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { NICHES } from "@/lib/niches";
import NicheCard from "./NicheCard";

interface NicheSelectorProps {
  onSelect: (nicheId: string) => void;
}

export default function NicheSelector({ onSelect }: NicheSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:gap-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {NICHES.map((niche, i) => (
          <div key={niche.id} className="w-[160px] shrink-0 md:w-[180px]">
            <NicheCard niche={niche} onClick={() => onSelect(niche.id)} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
