export type Ohlcv = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export function sma(values: number[], period: number): Array<number | null> {
  const out: Array<number | null> = new Array(values.length).fill(null);
  if (period <= 0) return out;
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

export function ema(values: number[], period: number): Array<number | null> {
  const out: Array<number | null> = new Array(values.length).fill(null);
  if (period <= 0 || !values.length) return out;
  const k = 2 / (period + 1);
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) continue;
    if (prev == null) {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) sum += values[j];
      prev = sum / period;
      out[i] = prev;
    } else {
      prev = values[i] * k + prev * (1 - k);
      out[i] = prev;
    }
  }
  return out;
}

export function bollinger(values: number[], period = 20, mult = 2) {
  const mid = sma(values, period);
  const upper: Array<number | null> = new Array(values.length).fill(null);
  const lower: Array<number | null> = new Array(values.length).fill(null);
  for (let i = period - 1; i < values.length; i++) {
    let sumSq = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const d = values[j] - (mid[i] as number);
      sumSq += d * d;
    }
    const std = Math.sqrt(sumSq / period);
    upper[i] = (mid[i] as number) + mult * std;
    lower[i] = (mid[i] as number) - mult * std;
  }
  return { mid, upper, lower };
}

export function rsi(closes: number[], period = 14): Array<number | null> {
  const out: Array<number | null> = new Array(closes.length).fill(null);
  if (closes.length < period + 1) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gain += d;
    else loss -= d;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  for (let i = period + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    const g = d > 0 ? d : 0;
    const l = d < 0 ? -d : 0;
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

export function macd(closes: number[], fast = 12, slow = 26, signal = 9) {
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const line: Array<number | null> = closes.map((_, i) =>
    emaFast[i] != null && emaSlow[i] != null ? (emaFast[i] as number) - (emaSlow[i] as number) : null
  );
  const lineVals = line.map((v) => v ?? 0);
  const signalLine = ema(
    line.map((v, i) => (v == null ? (i > 0 ? lineVals[i - 1] : 0) : v)),
    signal
  );
  // Recompute signal only where MACD exists
  const signalOut: Array<number | null> = new Array(closes.length).fill(null);
  const hist: Array<number | null> = new Array(closes.length).fill(null);
  const macdForEma: number[] = [];
  const macdIdx: number[] = [];
  for (let i = 0; i < line.length; i++) {
    if (line[i] != null) {
      macdForEma.push(line[i] as number);
      macdIdx.push(i);
    }
  }
  const sig = ema(macdForEma, signal);
  for (let j = 0; j < macdIdx.length; j++) {
    const i = macdIdx[j];
    if (sig[j] != null) {
      signalOut[i] = sig[j];
      hist[i] = (line[i] as number) - (sig[j] as number);
    }
  }
  return { line, signal: signalOut, hist };
}

export function atr(bars: Ohlcv[], period = 14): Array<number | null> {
  const out: Array<number | null> = new Array(bars.length).fill(null);
  if (bars.length < 2) return out;
  const tr: number[] = [bars[0].high - bars[0].low];
  for (let i = 1; i < bars.length; i++) {
    const h = bars[i].high;
    const l = bars[i].low;
    const pc = bars[i - 1].close;
    tr.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
  }
  return sma(tr, period);
}

export function stochastic(bars: Ohlcv[], kPeriod = 14, dPeriod = 3) {
  const k: Array<number | null> = new Array(bars.length).fill(null);
  for (let i = kPeriod - 1; i < bars.length; i++) {
    let highest = -Infinity;
    let lowest = Infinity;
    for (let j = i - kPeriod + 1; j <= i; j++) {
      highest = Math.max(highest, bars[j].high);
      lowest = Math.min(lowest, bars[j].low);
    }
    const range = highest - lowest;
    k[i] = range === 0 ? 50 : ((bars[i].close - lowest) / range) * 100;
  }
  const d = sma(
    k.map((v) => v ?? 0),
    dPeriod
  );
  const dOut: Array<number | null> = k.map((v, i) => (v == null || d[i] == null ? null : d[i]));
  // Fix d only where k exists for enough periods
  for (let i = 0; i < bars.length; i++) {
    if (k[i] == null) dOut[i] = null;
  }
  return { k, d: dOut };
}

export function dailyReturns(closes: number[]): Array<number | null> {
  return closes.map((c, i) => (i === 0 || closes[i - 1] === 0 ? null : ((c - closes[i - 1]) / closes[i - 1]) * 100));
}

export function findLargeGaps(bars: Ohlcv[], thresholdPct = 3): number[] {
  const idxs: number[] = [];
  for (let i = 1; i < bars.length; i++) {
    const prev = bars[i - 1].close;
    if (prev <= 0) continue;
    const gap = (Math.abs(bars[i].open - prev) / prev) * 100;
    if (gap >= thresholdPct) idxs.push(i);
  }
  return idxs;
}

export function find52WeekExtremes(bars: Ohlcv[]): { highIdx: number | null; lowIdx: number | null } {
  if (!bars.length) return { highIdx: null, lowIdx: null };
  const last = bars[bars.length - 1].date;
  const cut = new Date(last);
  cut.setUTCDate(cut.getUTCDate() - 365);
  const cutStr = cut.toISOString().slice(0, 10);
  let highIdx: number | null = null;
  let lowIdx: number | null = null;
  let high = -Infinity;
  let low = Infinity;
  for (let i = 0; i < bars.length; i++) {
    if (bars[i].date < cutStr) continue;
    if (bars[i].high >= high) {
      high = bars[i].high;
      highIdx = i;
    }
    if (bars[i].low <= low) {
      low = bars[i].low;
      lowIdx = i;
    }
  }
  return { highIdx, lowIdx };
}
