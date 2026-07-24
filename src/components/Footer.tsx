"use client";

import Link from "next/link";
import DataCaptainLogo from "@/components/DataCaptainLogo";
import { SUPPORT_EMAIL, SALES_EMAIL, STATUS_PAGE_PATH, mailtoSupport, mailtoSales } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <DataCaptainLogo variant="footer" href="/" />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white/80">Product</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/blog" className="hover:text-white">Blog & guides</Link>
              </li>
              <li>
                <Link href="/backtesting" className="hover:text-white">Backtesting</Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white">Portfolio</Link>
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
                <Link href="/etf-api" className="hover:text-white">ETF API</Link>
              </li>
              <li>
                <Link href="/stock-api" className="hover:text-white">Stock API</Link>
              </li>
              <li>
                <Link href="/historical-stock-api" className="hover:text-white">Historical API</Link>
              </li>
              <li>
                <Link href={STATUS_PAGE_PATH} className="hover:text-white">System status</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white/80">Support</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href={mailtoSupport()} className="hover:text-white">
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <a href={mailtoSales("Enterprise plan")} className="hover:text-white">
                  {SALES_EMAIL} (sales)
                </a>
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
          © {new Date().getFullYear()} Data Captain. US ETF Historical Data API.
        </div>
      </div>
    </footer>
  );
}
