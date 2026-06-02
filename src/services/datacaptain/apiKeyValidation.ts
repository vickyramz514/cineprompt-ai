/** Full DataCaptain key: sdata_ + 48 hex chars (24 random bytes) */
const API_KEY_PATTERN = /^sdata_[a-f0-9]{48}$/;

export function isValidApiKey(key: string | null | undefined): boolean {
  return typeof key === "string" && API_KEY_PATTERN.test(key);
}
