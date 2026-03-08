/**
 * CinePrompt AI - Brand & UI Copy System
 * Premium cinematic storytelling & memory creation platform
 * Target: Indian users, content creators, emotional storytelling
 */

export const brand = {
  name: "CinePrompt AI",
  taglines: [
    "Turn moments into movies.",
    "Your memories, cinematic.",
    "Stories that move you.",
    "Where memories become magic.",
    "Create. Feel. Remember.",
  ],
  primaryTagline: "Turn moments into movies.",
  description:
    "Premium AI-powered cinematic video creation. Not just a generator—a storytelling platform that brings your memories and ideas to life.",
} as const;

export const homepage = {
  hero: {
    headline: "Your memories deserve the big screen",
    subheadline:
      "Transform moments into cinematic stories. AI-powered video creation that feels magical—for reels, memories, and stories that move hearts.",
    cta: {
      primary: "Start creating free",
      secondary: "See how it works",
    },
  },
  howItWorks: {
    title: "Create in 3 simple steps",
    steps: [
      {
        step: 1,
        title: "Describe your story",
        description: "Write a few words about your moment, memory, or idea. Our AI understands emotion, not just keywords.",
      },
      {
        step: 2,
        title: "Choose your style",
        description: "Pick cinematic, anime, realistic, or fantasy. Each style brings a different mood to your story.",
      },
      {
        step: 3,
        title: "Watch the magic unfold",
        description: "Sit back as AI crafts your video. Download, share on reels, or keep it forever.",
      },
    ],
  },
  useCases: {
    title: "Stories worth telling",
    subtitle: "From everyday moments to once-in-a-lifetime memories",
    cases: [
      {
        title: "Memory recreation",
        description: "Bring back a wedding, birthday, or trip in cinematic style. Relive the emotion.",
      },
      {
        title: "Reels & shorts",
        description: "Stand out on Instagram and YouTube. AI-powered visuals that stop the scroll.",
      },
      {
        title: "Emotional storytelling",
        description: "Gift a video to someone you love. A story that says more than words ever could.",
      },
      {
        title: "Content creation",
        description: "YouTubers, creators, brands—create premium visuals without a film crew.",
      },
    ],
  },
  benefits: {
    title: "Why creators choose CinePrompt",
    items: [
      {
        title: "Cinematic quality",
        description: "Hollywood-grade visuals. Not generic AI—stories that feel real.",
      },
      {
        title: "Emotion-first",
        description: "Our AI understands feeling. Your prompt becomes a mood, not just pixels.",
      },
      {
        title: "Made for India",
        description: "Fast, simple, affordable. Built for how you create and share.",
      },
      {
        title: "No skills needed",
        description: "No editing, no software. Just describe, and we create.",
      },
    ],
  },
  trust: {
    title: "Trusted by creators",
    indicators: [
      "HD & 4K output",
      "Secure & private",
      "No watermarks on paid plans",
      "Instant download",
    ],
  },
} as const;

export const dashboard = {
  create: {
    title: "Create your video",
    subtitle: "Describe your story. We'll make it cinematic.",
    promptPlaceholder: "e.g. A couple walking on a beach at sunset, waves gently touching their feet...",
    promptHelper: "The more feeling you add, the better. Describe the mood, the moment, the emotion.",
    negativePromptPlaceholder: "What to avoid? (optional)",
    durationLabel: "Video length",
    durationHelper: "Longer videos use more credits. Choose based on your plan.",
    styleLabel: "Visual style",
    aspectRatioLabel: "Format",
    cta: "Create video",
    ctaLoading: "Creating...",
  },
  credits: {
    label: "Credits",
    helper: "1 credit = 1 second of video",
    low: "Running low on credits",
    empty: "No credits left",
    upgrade: "Upgrade to create more",
  },
  queue: {
    label: "Queue",
    empty: "No jobs in queue",
    processing: "Processing",
    waiting: "Waiting in queue",
    position: "Position",
  },
  form: {
    promptMinLength: "Add at least 5 characters",
    promptMaxLength: "Keep it under 2000 characters for best results",
  },
  emptyStates: {
    noVideos: {
      title: "Your first cinematic story awaits",
      description: "Describe a moment, memory, or idea. We'll turn it into a video you'll love.",
      cta: "Create your first video",
    },
    noHistory: {
      title: "No videos yet",
      description: "Your created videos will appear here. Ready to create something magical?",
      cta: "Create video",
    },
  },
  processing: {
    queued: "Your video is in the queue",
    processing: "Creating your cinematic video...",
    almostDone: "Almost there! Adding the final touches.",
    progress: "Progress",
  },
  success: {
    completed: "Your video is ready!",
    download: "Download",
    share: "Share to reels",
    createAnother: "Create another",
  },
} as const;

export const pricing = {
  title: "Plans that grow with you",
  subtitle: "Start free. Upgrade when you're ready for more.",
  cta: "Get started",
  ctaUpgrade: "Upgrade now",
  perMonth: "/month",
  credits: "credits",
  popular: "Most popular",
  free: {
    name: "Free",
    tagline: "Try the magic",
    description: "Perfect for your first cinematic videos",
    cta: "Start free",
  },
  starter: {
    name: "Starter",
    tagline: "For casual creators",
    description: "More credits, longer videos, all styles",
    cta: "Get Starter",
  },
  creator: {
    name: "Creator",
    tagline: "For serious creators",
    description: "Priority rendering, 1080p, perfect for reels",
    cta: "Get Creator",
  },
  ultra: {
    name: "Ultra",
    tagline: "For power users",
    description: "4K, API access, maximum creativity",
    cta: "Get Ultra",
  },
  comparison: {
    credits: "Credits",
    maxDuration: "Max video length",
    resolution: "Resolution",
    styles: "Visual styles",
    priority: "Priority rendering",
    api: "API access",
  },
  upgradeCta: "Need more? Upgrade anytime.",
} as const;

export const microInteractions = {
  buttons: {
    create: "Create video",
    creating: "Creating...",
    download: "Download",
    share: "Share",
    retry: "Try again",
    cancel: "Cancel",
    upgrade: "Upgrade plan",
    signIn: "Sign in",
    signUp: "Get started free",
  },
  toasts: {
    videoQueued: "Video added to queue. We'll notify you when it's ready.",
    videoCompleted: "Your video is ready!",
    creditsLow: "Running low on credits. Consider upgrading.",
    errorGeneric: "Something went wrong. Please try again.",
    errorNetwork: "Connection issue. Check your internet and retry.",
    copied: "Copied to clipboard!",
  },
  errors: {
    insufficientCredits: "Not enough credits. Upgrade or wait for your next refill.",
    dailyLimit: "Daily limit reached. Free plan allows 1 video per day.",
    invalidPrompt: "Please add a longer description (min 5 characters).",
    processingFailed: "Video creation failed. Your credits have been refunded.",
    networkError: "Couldn't connect. Please try again.",
  },
  success: {
    videoCreated: "Video created successfully!",
    downloadStarted: "Download started",
    shared: "Link copied! Share it anywhere.",
  },
} as const;

export const emotionalUX = {
  queue: [
    "Your story is next in line...",
    "Preparing the magic...",
    "Almost your turn...",
    "Getting the cameras ready...",
  ],
  rendering: [
    "Painting your story frame by frame...",
    "Adding the cinematic touch...",
    "Bringing your vision to life...",
    "Crafting something beautiful...",
    "The magic is happening...",
  ],
  completion: [
    "Your cinematic story is ready!",
    "Magic delivered. Enjoy your video.",
    "Done! This one's special.",
    "Ready to watch, share, and remember.",
    "Your video is waiting. Hit download!",
  ],
  encouragement: [
    "Great prompt! This will look amazing.",
    "Love the emotion in that description.",
    "That's a story worth telling.",
  ],
} as const;

export const auth = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to continue creating",
    cta: "Sign in",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start creating cinematic videos in minutes",
    cta: "Create account",
  },
} as const;

// Export as single object for easy import
export const copy = {
  brand,
  homepage,
  dashboard,
  pricing,
  microInteractions,
  emotionalUX,
  auth,
} as const;

export default copy;
