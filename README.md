# Code Nebula 🌌

> **Turn your GitHub into a living code galaxy.**

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?logo=threedotjs)](https://docs.pmnd.rs/react-three-fiber)

Code Nebula is an interactive GitHub galaxy generator. Enter any GitHub username and watch their public repositories become orbiting planets in a 3D cosmic scene. Each planet reflects the language, activity, and popularity of its repository.

---

## ✨ Features

- 🌟 **3D Galaxy Scene** — powered by React Three Fiber
- 🪐 **Repo Planets** — each planet's color, size and speed reflects its repo data
- 🤖 **Nebbi** — a procedural companion mascot that guides your exploration
- 📊 **Repo Panel** — click any planet to see detailed repository information
- 🏷️ **README Widget** — generate a dynamic SVG badge for your GitHub profile
- ⚡ **No login required** — just enter a username

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/SaidPereyra/code-nebula.git
cd code-nebula
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
# Edit .env.local and add your GitHub token (optional, increases rate limit)
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| 3D Engine | React Three Fiber + Drei |
| State | Zustand |
| Animations | Framer Motion |
| Deploy | Vercel |

---

## 📁 Project Structure

```
src/
  app/              # Next.js App Router pages & API routes
  components/
    layout/         # AppShell, Header, Footer
    landing/        # HeroSection, UsernameSearch, FeatureCards
    nebula/         # 3D scene components (R3F)
    ui/             # Reusable UI components
  lib/
    github/         # GitHub API client, mapper, types
    nebula/         # Galaxy math, language themes, companion messages
    widget/         # SVG widget generator
    utils/          # cn, format, dates
  store/            # Zustand store
  styles/           # Design tokens
```

---

## 🎮 How It Works

1. Enter a GitHub username on the landing page
2. Code Nebula fetches your public profile and repositories from the GitHub API
3. Up to 6 repositories are scored and mapped to planets
4. The 3D galaxy is rendered with React Three Fiber
5. Click any planet to scan it with Nebbi and view repo details
6. Generate a README widget to share your galaxy

---

## 🏷️ README Widget

Add your Code Nebula galaxy to your GitHub profile:

```md
[![Code Nebula](https://code-nebula.vercel.app/api/widget/YOUR_USERNAME)](https://code-nebula.vercel.app/u/YOUR_USERNAME)
```

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

## 🗺️ Roadmap v2

- GitHub OAuth login
- Save and share galaxy links
- More visual themes
- Organization support
- PNG/wallpaper export

---

*Built with ❤️ as a portfolio project.*
