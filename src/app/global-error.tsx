"use client";

import { useEffect } from "react";
import { captureClientException } from "@/lib/sentry-client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureClientException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0a0f", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fca5a5" }}>
            Critical error
          </p>
          <h1 style={{ fontSize: 28, marginTop: 8 }}>Data Captain hit a problem</h1>
          <p style={{ marginTop: 12, maxWidth: 420, color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
            {error.message || "Please refresh and try again."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              borderRadius: 12,
              background: "#6366f1",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
