import type { EtfHeatmapCell } from "@/services/datacaptain/endpoints";
import { formatPct } from "@/lib/heatmap/colors";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportHeatmapCsv(cells: EtfHeatmapCell[], period: string) {
  const header = [
    "symbol",
    "name",
    "returnPct",
    "latestPrice",
    "avgVolume30d",
    "dividendYieldTtm",
    "aumBillions",
    "expenseRatio",
  ];
  const lines = [header.join(",")];
  for (const c of cells) {
    lines.push(
      [
        c.symbol,
        `"${(c.name || "").replace(/"/g, '""')}"`,
        c.returnPct ?? "",
        c.latestPrice ?? "",
        c.avgVolume30d ?? "",
        c.dividendYieldTtm ?? "",
        c.aumBillions ?? "",
        c.expenseRatio ?? "",
      ].join(",")
    );
  }
  download(`etf-heatmap-${period}.csv`, lines.join("\n"), "text/csv;charset=utf-8");
}

export function exportHeatmapJson(cells: EtfHeatmapCell[], period: string, basket?: string) {
  download(
    `etf-heatmap-${period}.json`,
    JSON.stringify({ period, basket, exportedAt: new Date().toISOString(), cells }, null, 2),
    "application/json"
  );
}

export async function shareHeatmap(cells: EtfHeatmapCell[], period: string) {
  const best = [...cells].sort((a, b) => (b.returnPct ?? -999) - (a.returnPct ?? -999))[0];
  const text = `Data Captain ETF Heatmap (${period}): ${cells.length} ETFs. Top: ${best?.symbol ?? "—"} ${formatPct(best?.returnPct ?? null)}`;
  const url = typeof window !== "undefined" ? window.location.href : "";
  if (navigator.share) {
    try {
      await navigator.share({ title: "ETF Heatmap", text, url });
      return;
    } catch {
      /* fallthrough */
    }
  }
  await navigator.clipboard?.writeText(`${text}\n${url}`);
}

export async function exportHeatmapPng(elementId: string) {
  const el = document.getElementById(elementId);
  if (!el) return;
  // Lightweight fallback: open print dialog for the heatmap region
  const html = `<!DOCTYPE html><html><head><title>ETF Heatmap</title>
  <style>body{margin:0;background:#0a0a0f;color:#fff;font-family:system-ui,sans-serif} img{max-width:100%}</style>
  </head><body><h1 style="padding:16px">ETF Heatmap</h1><p style="padding:0 16px;opacity:.6">Use browser print → Save as PDF/PNG</p>${el.outerHTML}<script>setTimeout(()=>window.print(),400)</script></body></html>`;
  const w = window.open("", "_blank", "noopener,noreferrer,width=1100,height=800");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}
