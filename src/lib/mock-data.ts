export const TEMPLATES = [
  { id: "1", name: "Titanic POV", thumbnail: "/templates/titanic.jpg", prompt: "Epic ocean voyage cinematic POV" },
  { id: "2", name: "Wedding Invitation", thumbnail: "/templates/wedding.jpg", prompt: "Elegant wedding invitation video" },
  { id: "3", name: "Travel Cinematic", thumbnail: "/templates/travel.jpg", prompt: "Stunning travel montage cinematic" },
  { id: "4", name: "Festival Greetings", thumbnail: "/templates/festival.jpg", prompt: "Vibrant festival celebration video" },
  { id: "5", name: "Birthday Video", thumbnail: "/templates/birthday.jpg", prompt: "Joyful birthday celebration montage" },
  { id: "6", name: "Business Promo", thumbnail: "/templates/business.jpg", prompt: "Professional business promotional video" },
];

export const VIDEO_STYLES = [
  { id: "cinematic", name: "Cinematic", description: "Hollywood-style dramatic visuals" },
  { id: "anime", name: "Anime", description: "Animated Japanese art style" },
  { id: "realistic", name: "Realistic", description: "Photorealistic footage" },
  { id: "fantasy", name: "Fantasy", description: "Magical and surreal" },
];

export const DURATIONS = [5, 10, 15];
export const ASPECT_RATIOS = [
  { id: "16:9", name: "16:9", width: 16, height: 9 },
  { id: "9:16", name: "9:16", width: 9, height: 16 },
  { id: "1:1", name: "1:1", width: 1, height: 1 },
];
export const RESOLUTIONS = ["720p", "1080p"];

export const PRICING_PLANS = [
  { id: "free", name: "Free", price: 0, credits: 30, features: ["30 credits (one-time)", "720p output", "Basic templates"] },
  { id: "starter", name: "Starter", price: 499, credits: 500, features: ["500 credits/month", "1080p output", "All templates"] },
  { id: "ultra", name: "Ultra", price: 1999, credits: 4000, features: ["4000 credits/month", "4K output", "API access"] },
];

export const SIDEBAR_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/dashboard/create", label: "Create Video", icon: "create" },
  { href: "/dashboard/templates", label: "Templates", icon: "templates" },
  { href: "/dashboard/templates?tab=my", label: "My Templates", icon: "my" },
  { href: "/dashboard/templates?tab=favorites", label: "Favorites", icon: "favorites" },
  { href: "/dashboard/history", label: "History", icon: "history" },
  { href: "/dashboard/wallet", label: "Wallet", icon: "wallet" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "notifications" },
  { href: "/dashboard/profile", label: "Profile", icon: "profile" },
];
