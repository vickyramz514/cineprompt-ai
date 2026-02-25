"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getAccessToken } from "@/lib/api";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading, error, setError, user } = useAuth();

  useEffect(() => {
    if (getAccessToken() && user) {
      router.replace("/dashboard");
    }
  }, [user, router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"email" | "otp">("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "otp") return; // OTP not implemented
    try {
      await login(email, password);
    } catch {
      // Error handled in useAuth
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-2 text-white/60">Sign in to CinePrompt AI</p>
          </div>

          <div className="mt-6 flex gap-2 rounded-lg bg-white/5 p-1">
            <button
              onClick={() => setMode("email")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "email" ? "bg-indigo-500 text-white" : "text-white/70 hover:text-white"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setMode("otp")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "otp" ? "bg-indigo-500 text-white" : "text-white/70 hover:text-white"
              }`}
            >
              OTP
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "email" ? (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:outline-none"
                  required
                />
              </>
            ) : (
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:outline-none"
              />
            )}

            <button
              type="submit"
              disabled={mode !== "email" || isLoading}
              className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white transition-colors hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-zinc-900 px-4 text-white/50">or continue with</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <GoogleLoginButton
                onSuccess={(u) => loginWithGoogle(u)}
                onError={(msg) => setError(msg)}
                disabled={isLoading}
              />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-indigo-400 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
