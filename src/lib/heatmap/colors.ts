/** Heatmap color scale + helpers */

/** Smooth green / gray / red scale clamped at ±35% */
export function returnToColor(pct: number | null): string {
  if (pct == null || Number.isNaN(pct)) return "rgb(55, 65, 81)";
  const clamped = Math.max(-35, Math.min(35, pct));
  const t = clamped / 35; // -1 .. 1

  if (Math.abs(t) < 0.015) return "rgb(75, 85, 99)";

  const lerp = (a: number, b: number, u: number) => Math.round(a + (b - a) * u);

  if (t > 0) {
    const u = t;
    const mid = 0.45;
    if (u < mid) {
      const k = u / mid;
      return `rgb(${lerp(110, 16, k)}, ${lerp(231, 185, k)}, ${lerp(183, 129, k)})`;
    }
    const k = (u - mid) / (1 - mid);
    return `rgb(${lerp(16, 6, k)}, ${lerp(185, 95, k)}, ${lerp(129, 70, k)})`;
  }

  const u = -t;
  const mid = 0.45;
  if (u < mid) {
    const k = u / mid;
    return `rgb(${lerp(253, 244, k)}, ${lerp(164, 63, k)}, ${lerp(175, 94, k)})`;
  }
  const k = (u - mid) / (1 - mid);
  return `rgb(${lerp(244, 136, k)}, ${lerp(63, 19, k)}, ${lerp(94, 55, k)})`;
}

export function formatPct(pct: number | null | undefined, digits = 1): string {
  if (pct == null || Number.isNaN(pct)) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(digits)}%`;
}

export function formatCompact(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(Math.round(n));
}

/** Column span for a 6-column heatmap grid (1 = small, 3 = largest). */
export function tileSpan(sizeScore: number, maxScore: number): 1 | 2 | 3 {
  if (!maxScore || !sizeScore) return 1;
  const ratio = sizeScore / maxScore;
  if (ratio >= 0.55) return 3;
  if (ratio >= 0.22) return 2;
  return 1;
}

export function tileGridClass(span: 1 | 2 | 3): string {
  switch (span) {
    case 3:
      return "col-span-2 lg:col-span-3";
    case 2:
      return "col-span-2 lg:col-span-2";
    default:
      return "col-span-1 lg:col-span-1";
  }
}
