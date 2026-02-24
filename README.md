# CinePrompt AI

A modern, premium AI video generation platform UI built with Next.js.

## Features

- **Landing Page** - Hero, feature cards, pricing preview
- **Auth** - Login, Signup, Google & OTP mock UI
- **Dashboard** - Sidebar nav, credit display
- **Create Video** - Prompt editor, style/duration/aspect ratio selectors, progress simulation
- **Templates** - Grid of pre-built templates
- **History** - Video generation history table
- **Wallet** - Credit balance, pricing plans, payment modal
- **Profile** - User info, plan, settings

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Zustand (state management)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── auth/          # Login, Signup
│   ├── dashboard/     # Dashboard, Create, Templates, History, Wallet, Profile
│   ├── layout.tsx
│   └── page.tsx       # Landing
├── components/
│   ├── Loader
│   ├── Modal
│   ├── Navbar
│   ├── PricingCard
│   ├── PromptEditor
│   ├── ProgressBar
│   ├── Sidebar
│   ├── Skeleton
│   ├── TemplateCard
│   └── VideoCard
├── lib/
│   └── mock-data.ts
└── store/
    └── useStore.ts    # Zustand stores
```

All data is mocked—no backend required.
# cineprompt-ai
