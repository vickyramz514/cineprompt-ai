/**
 * Maintenance / deployment fallback messaging.
 * Toggle site-wide via MAINTENANCE_MODE=true (middleware).
 */
export const MAINTENANCE_PAGE_PATH = "/maintenance";

export const MAINTENANCE_COPY = {
  eyebrow: "Temporary interruption",
  title: "We're deploying an update",
  description:
    "DataCaptain is briefly unavailable while we finish a deployment or resolve a platform issue. Your data is safe — please try again in a few minutes.",
  statusCta: "Check system status",
  retryCta: "Try again",
  supportHint: "Need help right away?",
} as const;

export function isMaintenanceModeEnabled() {
  const flag =
    process.env.MAINTENANCE_MODE ?? process.env.NEXT_PUBLIC_MAINTENANCE_MODE ?? "";
  return ["1", "true", "yes", "on"].includes(flag.trim().toLowerCase());
}

export function getMaintenanceMessage() {
  return (
    process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE?.trim() ||
    MAINTENANCE_COPY.description
  );
}
