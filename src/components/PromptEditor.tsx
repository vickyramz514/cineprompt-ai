"use client";

import { useState } from "react";

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

export default function PromptEditor({
  value,
  onChange,
  placeholder = "Describe your video... A drone flying over misty mountains at sunrise, cinematic lighting...",
  minRows = 4,
}: PromptEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
    />
  );
}
