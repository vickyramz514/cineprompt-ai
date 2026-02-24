/**
 * Niche categories for template-first experience
 */

import type { Niche } from "./template-schema";

export const NICHES: Niche[] = [
  { id: "wedding", name: "Wedding & Events", slug: "wedding-events", icon: "🎉", gradient: "from-rose-500/20 to-pink-600/20", description: "Wedding invitations, receptions, anniversaries" },
  { id: "business", name: "Business Promo", slug: "business-promo", icon: "🏢", gradient: "from-blue-500/20 to-cyan-600/20", description: "Product launches, company intros" },
  { id: "temple", name: "Temple & God", slug: "temple-god", icon: "🛕", gradient: "from-amber-500/20 to-orange-600/20", description: "Religious greetings, temple events" },
  { id: "festival", name: "Festival Greetings", slug: "festival-greetings", icon: "🪔", gradient: "from-emerald-500/20 to-teal-600/20", description: "Diwali, Pongal, Holi, New Year" },
  { id: "astrology", name: "Astrology & Horoscope", slug: "astrology-horoscope", icon: "🔮", gradient: "from-purple-500/20 to-violet-600/20", description: "Zodiac, predictions, cosmic" },
  { id: "political", name: "Political Campaign", slug: "political-campaign", icon: "🗳️", gradient: "from-slate-500/20 to-zinc-600/20", description: "Election campaigns, rallies" },
  { id: "travel", name: "Travel Cinematic", slug: "travel-cinematic", icon: "✈️", gradient: "from-sky-500/20 to-indigo-600/20", description: "Travel vlogs, destination videos" },
  { id: "social", name: "Social Media Reels", slug: "social-media-reels", icon: "📱", gradient: "from-fuchsia-500/20 to-pink-600/20", description: "Instagram, TikTok, YouTube Shorts" },
];
