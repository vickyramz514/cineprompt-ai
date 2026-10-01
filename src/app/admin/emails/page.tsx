"use client";

import { useCallback, useEffect, useState } from "react";
import * as marketingService from "@/services/marketing.service";
import type {
  AudienceCounts,
  EmailCampaign,
  EmailPreview,
  MarketingAudience,
  MarketingContent,
} from "@/services/marketing.service";

const DEFAULT_CONTENT: MarketingContent = {
  subject: "{{name}}, unlock historical data & backtests on DataCaptain",
  preheader: "Upgrade to get more daily API requests, ETF history and backtesting.",
  headline: "Get more out of DataCaptain",
  body: [
    "Hi {{name}},",
    "Thanks for building with DataCaptain. You're currently on the Free plan, which includes 50 API requests a day.",
    "Upgrade to a paid plan to unlock historical ETF data, backtesting and much higher daily limits, so your apps and research don't stop at the free quota.",
    "You can cancel any time from your billing page.",
  ].join("\n\n"),
  ctaLabel: "View plans",
  ctaUrl: "https://www.datacaptain.in/pricing",
  showPlans: true,
};

const AUDIENCE_OPTIONS: { value: MarketingAudience; label: string; hint: string }[] = [
  { value: "free", label: "Free users", hint: "On the Free plan with no active subscription" },
  { value: "lapsed", label: "Lapsed subscribers", hint: "Had a subscription that was cancelled or expired" },
  { value: "all", label: "All users", hint: "Every active user who hasn't unsubscribed" },
];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none";

const statusClass: Record<EmailCampaign["status"], string> = {
  SENDING: "bg-amber-500/20 text-amber-300",
  COMPLETED: "bg-green-500/20 text-green-400",
  FAILED: "bg-red-500/20 text-red-400",
};

export default function AdminEmailsPage() {
  const [content, setContent] = useState<MarketingContent>(DEFAULT_CONTENT);
  const [audience, setAudience] = useState<MarketingAudience>("free");
  const [counts, setCounts] = useState<AudienceCounts | null>(null);
  const [preview, setPreview] = useState<EmailPreview | null>(null);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [testTo, setTestTo] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState<"test" | "send" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadCounts = useCallback(() => {
    marketingService
      .getAudienceCounts()
      .then(setCounts)
      .catch((err) => setError(marketingService.getErrorMessage(err)));
  }, []);

  const loadCampaigns = useCallback(() => {
    marketingService
      .getCampaigns()
      .then(setCampaigns)
      .catch((err) => setError(marketingService.getErrorMessage(err)));
  }, []);

  useEffect(() => {
    loadCounts();
    loadCampaigns();
  }, [loadCounts, loadCampaigns]);

  // Debounced so typing doesn't burn through the admin rate limit
  useEffect(() => {
    const timer = setTimeout(() => {
      marketingService
        .previewEmail(content)
        .then((data) => {
          setPreview(data);
          setError(null);
        })
        .catch((err) => setError(marketingService.getErrorMessage(err)));
    }, 800);
    return () => clearTimeout(timer);
  }, [content]);

  const hasSending = campaigns.some((c) => c.status === "SENDING");
  useEffect(() => {
    if (!hasSending) return;
    const interval = setInterval(loadCampaigns, 5000);
    return () => clearInterval(interval);
  }, [hasSending, loadCampaigns]);

  const update = <K extends keyof MarketingContent>(key: K, value: MarketingContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setConfirming(false);
  };

  const handleTest = () => {
    setBusy("test");
    setNotice(null);
    marketingService
      .sendTestEmail(content, testTo.trim() || undefined)
      .then(({ to }) => setNotice(`Test email sent to ${to}.`))
      .catch((err) => setError(marketingService.getErrorMessage(err)))
      .finally(() => setBusy(null));
  };

  const recipientCount = counts?.[audience] ?? 0;

  const handleSend = () => {
    setBusy("send");
    setNotice(null);
    marketingService
      .startCampaign(content, audience, recipientCount)
      .then((campaign) => {
        setNotice(`Campaign started — sending to ${campaign.totalRecipients} users.`);
        setConfirming(false);
        loadCampaigns();
        loadCounts();
      })
      .catch((err) => setError(marketingService.getErrorMessage(err)))
      .finally(() => setBusy(null));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Marketing emails</h1>
      <p className="mt-1 text-white/60">
        Email your users about paid plans. Every email includes an unsubscribe link, and users who opt out are skipped
        automatically.
      </p>

      {counts && !counts.emailConfigured && (
        <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Email sending isn&apos;t configured on the API yet. Set SMTP_HOST, SMTP_USER, SMTP_PASS and EMAIL_FROM. You
          can still preview emails.
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {notice && (
        <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {notice}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="space-y-5 rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-white/80">Audience</legend>
            <div className="space-y-2">
              {AUDIENCE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 ${
                    audience === opt.value ? "border-amber-500/40 bg-amber-500/10" : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="audience"
                    value={opt.value}
                    checked={audience === opt.value}
                    onChange={() => {
                      setAudience(opt.value);
                      setConfirming(false);
                    }}
                    className="mt-1 accent-amber-500"
                  />
                  <span className="flex-1">
                    <span className="flex items-center justify-between text-sm font-medium text-white">
                      {opt.label}
                      <span className="text-white/60">{counts ? counts[opt.value] : "…"} recipients</span>
                    </span>
                    <span className="text-xs text-white/50">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            {counts && <p className="mt-2 text-xs text-white/40">{counts.optedOut} users have unsubscribed.</p>}
          </fieldset>

          <Field label="Subject" hint="Use {{name}} for the user's first name">
            <input className={inputClass} value={content.subject} onChange={(e) => update("subject", e.target.value)} />
          </Field>
          <Field label="Preview text" hint="Shown after the subject in most inboxes">
            <input
              className={inputClass}
              value={content.preheader}
              onChange={(e) => update("preheader", e.target.value)}
            />
          </Field>
          <Field label="Headline">
            <input className={inputClass} value={content.headline} onChange={(e) => update("headline", e.target.value)} />
          </Field>
          <Field label="Message" hint="Separate paragraphs with a blank line">
            <textarea
              rows={9}
              className={inputClass}
              value={content.body}
              onChange={(e) => update("body", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button label">
              <input
                className={inputClass}
                value={content.ctaLabel}
                onChange={(e) => update("ctaLabel", e.target.value)}
              />
            </Field>
            <Field label="Button link">
              <input className={inputClass} value={content.ctaUrl} onChange={(e) => update("ctaUrl", e.target.value)} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={content.showPlans}
              onChange={(e) => update("showPlans", e.target.checked)}
              className="accent-amber-500"
            />
            Show current paid plans and prices
          </label>

          <div className="border-t border-white/5 pt-5">
            <Field label="Send a test first" hint="Leave empty to send to your own admin email">
              <div className="flex gap-2">
                <input
                  type="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  value={testTo}
                  onChange={(e) => setTestTo(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={busy !== null || !counts?.emailConfigured}
                  className="shrink-0 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-50"
                >
                  {busy === "test" ? "Sending…" : "Send test"}
                </button>
              </div>
            </Field>
          </div>

          <div className="border-t border-white/5 pt-5">
            {!confirming ? (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                disabled={busy !== null || hasSending || !counts?.emailConfigured || recipientCount === 0}
                className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
              >
                {hasSending ? "A campaign is sending…" : `Send to ${recipientCount} users`}
              </button>
            ) : (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-sm text-amber-200">
                  Send &ldquo;{preview?.subject ?? content.subject}&rdquo; to <strong>{recipientCount}</strong>{" "}
                  {AUDIENCE_OPTIONS.find((o) => o.value === audience)?.label.toLowerCase()}? This can&apos;t be undone.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={busy !== null}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
                  >
                    {busy === "send" ? "Starting…" : "Yes, send now"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium text-white/80">Preview</h2>
            {preview && <span className="truncate text-xs text-white/50">Subject: {preview.subject}</span>}
          </div>
          {preview ? (
            <iframe
              title="Email preview"
              srcDoc={preview.html}
              sandbox=""
              className="h-[760px] w-full rounded-lg bg-white"
            />
          ) : (
            <div className="flex h-[760px] items-center justify-center rounded-lg bg-white/5 text-sm text-white/40">
              Rendering preview…
            </div>
          )}
        </section>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Recent campaigns</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-left text-white/60">
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Audience</th>
                <th className="px-4 py-3 font-medium">Progress</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Started</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                    No campaigns sent yet.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 align-top">
                    <td className="max-w-xs px-4 py-3">
                      <div className="truncate">{c.subject}</div>
                      {c.lastError && <div className="mt-1 truncate text-xs text-red-400">{c.lastError}</div>}
                    </td>
                    <td className="px-4 py-3 capitalize">{c.audience}</td>
                    <td className="px-4 py-3">
                      {c.sentCount}/{c.totalRecipients} sent
                      {c.failedCount > 0 && <span className="text-red-400"> · {c.failedCount} failed</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-xs ${statusClass[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-white/60">{new Date(c.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/80">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-white/40">{hint}</span>}
    </label>
  );
}
