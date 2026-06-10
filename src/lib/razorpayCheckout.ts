/**
 * Razorpay Standard Checkout for subscriptions — redirects via callback_url after success
 * (hosted short_url alone often leaves users on Razorpay’s success screen).
 */

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function loadRazorpayCheckoutScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Razorpay requires a browser"));

  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      if (window.Razorpay) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Razorpay Checkout failed to load")));
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay Checkout"));
    document.body.appendChild(script);
  });
}

export type OpenSubscriptionCheckoutParams = {
  key: string;
  subscriptionId: string;
  name: string;
  description: string;
  /** POST endpoint that redirects to /dashboard/wallet (Razorpay callback_url must accept POST). */
  callbackUrl: string;
};

export async function openRazorpaySubscriptionCheckout(params: OpenSubscriptionCheckoutParams): Promise<void> {
  await loadRazorpayCheckoutScript();
  const Ctor = window.Razorpay;
  if (!Ctor) throw new Error("Razorpay Checkout is not available");

  const instance = new Ctor({
    key: params.key,
    subscription_id: params.subscriptionId,
    name: params.name,
    description: params.description,
    callback_url: params.callbackUrl,
    theme: { color: "#6366f1" },
  });

  instance.open();
}
