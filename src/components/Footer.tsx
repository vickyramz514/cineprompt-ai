"use client";

import Link from "next/link";
import DataCaptainLogo from "@/components/DataCaptainLogo";

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <DataCaptainLogo size="sm" />
              <span>Data Captain</span>
            </Link>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white/80">Product</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/docs" className="hover:text-white">API Documentation</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">Pricing</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white/80">Resources</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/docs" className="hover:text-white">Developer Guide</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white">API Reference</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white/80">Legal</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-8 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Data Captain. US Stock & ETF Historical Data API.
        </div>
      </div>
    </footer>
  );
}
