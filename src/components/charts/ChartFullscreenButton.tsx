"use client";

type Props = {
  onClick: () => void;
  active?: boolean;
  className?: string;
};

/** Expand / maximize control — sits above the chart canvas. */
export default function ChartFullscreenButton({ onClick, active = false, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title="Fullscreen"
      aria-label={active ? "Exit fullscreen" : "Fullscreen"}
      className={`group absolute bottom-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/80 shadow-lg shadow-black/40 backdrop-blur-md transition duration-200 hover:scale-110 hover:border-cyan-400/40 hover:bg-black/75 hover:text-white hover:shadow-cyan-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 ${className}`}
    >
      {active ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
          />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
          />
        </svg>
      )}
      <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2 py-1 text-[10px] font-medium text-white/80 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
        Fullscreen
      </span>
    </button>
  );
}
