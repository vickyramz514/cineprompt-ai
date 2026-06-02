"use client";

/** Lightweight JSON syntax coloring for doc examples */
export default function JsonHighlight({ json }: { json: string }) {
  const parts = json.split(/("(?:\\.|[^"\\])*")|(:)|(\b\d+\.?\d*\b)|(true|false|null)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('"') && part.endsWith('"')) {
          const isKey = parts[i + 1] === ":";
          return (
            <span key={i} className={isKey ? "text-sky-300/90" : "text-emerald-300/90"}>
              {part}
            </span>
          );
        }
        if (part === ":") return <span key={i} className="text-white/40">{part}</span>;
        if (/^\d/.test(part)) return <span key={i} className="text-amber-300/90">{part}</span>;
        if (["true", "false", "null"].includes(part))
          return (
            <span key={i} className="text-violet-300/90">
              {part}
            </span>
          );
        return (
          <span key={i} className="text-white/70">
            {part}
          </span>
        );
      })}
    </>
  );
}
