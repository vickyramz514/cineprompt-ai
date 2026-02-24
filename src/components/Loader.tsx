"use client";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Loader({ size = "md", className = "" }: LoaderProps) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

  return (
    <div className={`animate-spin rounded-full border-2 border-white/10 border-t-indigo-500 ${sizes[size]} ${className}`} />
  );
}
