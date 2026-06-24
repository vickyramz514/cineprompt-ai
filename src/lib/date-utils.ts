/** YYYY-MM-DD in local calendar (not UTC-shifted). */
export function formatDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDefaultBacktestDates(years = 5) {
  const end = new Date();
  const start = new Date(end);
  start.setFullYear(end.getFullYear() - years);
  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(end),
  };
}

export const BACKTEST_MIN_DATE = "1990-01-01";

export function todayDateInput(): string {
  return formatDateInput(new Date());
}
