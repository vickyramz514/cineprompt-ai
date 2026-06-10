import { NextRequest, NextResponse } from "next/server";

/**
 * Razorpay Standard Checkout posts form data to callback_url (POST only).
 * Dashboard pages are GET-only → direct callback to /dashboard/wallet returns HTTP 405.
 * @see https://razorpay.com/docs/payments/payment-gateway/callback-url/
 */
export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const walletUrl = new URL("/dashboard/wallet", origin);

  try {
    const form = await request.formData();
    const paymentId = form.get("razorpay_payment_id");
    const subscriptionId = form.get("razorpay_subscription_id");
    const orderId = form.get("razorpay_order_id");
    const signature = form.get("razorpay_signature");
    const errorCode = form.get("error[code]");
    const errorDescription = form.get("error[description]");

    if (typeof paymentId === "string" && paymentId) {
      walletUrl.searchParams.set("razorpay_payment_id", paymentId);
    }
    if (typeof subscriptionId === "string" && subscriptionId) {
      walletUrl.searchParams.set("razorpay_subscription_id", subscriptionId);
    }
    if (typeof orderId === "string" && orderId) {
      walletUrl.searchParams.set("razorpay_order_id", orderId);
    }
    if (typeof signature === "string" && signature) {
      walletUrl.searchParams.set("razorpay_signature", signature);
    }
    if (typeof errorCode === "string" && errorCode) {
      walletUrl.searchParams.set("payment_error", errorCode);
    }
    if (typeof errorDescription === "string" && errorDescription) {
      walletUrl.searchParams.set("payment_error_description", errorDescription);
    }
  } catch {
    walletUrl.searchParams.set("payment_error", "callback_parse_failed");
  }

  return NextResponse.redirect(walletUrl, 303);
}
