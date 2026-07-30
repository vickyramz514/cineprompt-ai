/**
 * Donation / UPI settings — update these values when payment details change.
 * Place your QR image at `public/donation/upi-qr.png` (or update `qrImagePath`).
 */
export const DONATION_CONFIG = {
  /** Public path to the UPI QR image (under /public) */
  qrImagePath: "/donation/paytm-qr.jpeg",
  /** Alt text for the QR image */
  qrImageAlt: "DataCaptain UPI QR code",
} as const;

export const DONATION_INFO_COPY = {
  title: "Support DataCaptain ❤️",
  paragraphs: [
    "Running the platform requires continuous investment in:",
    "If DataCaptain has helped you build applications, access reliable market data, or save development time, you can support its continued development with a voluntary contribution.",
    "Every donation helps improve the platform and keep many features available for the community.",
    "Thank you for your support! ❤️",
  ],
  bulletItems: [
    "Server hosting",
    "Database infrastructure",
    "API maintenance",
    "Domain & SSL",
    "Monitoring & security",
    "Continuous feature development",
    "Performance improvements",
  ],
  donationTitle: "Support DataCaptain",
  donationSubtitle: "Scan the QR code using any UPI application.",
  thankYou: "Thank you for supporting DataCaptain!",
} as const;
