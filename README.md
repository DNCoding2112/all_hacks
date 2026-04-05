# 🚀 AllHacks India

**AllHacks India** is a premium, high-performance dashboard designed to curate and track the most prestigious hackathons, builders' mixers, and tech events across the Indian subcontinent. It features automated scraping from major platforms like Devfolio, Unstop, and Devpost, coupled with a state-of-the-art glassmorphism UI.

![AllHacks India Preview](/public/setup-bg.avif)

## ✨ Features

- **📊 Intelligent Scrapers**: Automated data extraction from:
  - **Devfolio**: Popular Indian hackathon platform.
  - **Unstop**: Major student opportunity portal.
  - **Devpost**: The global standard for developer challenges (with India-specific search).
- **💎 Premium UI/UX**:
  - **Deep Glassmorphism**: Cards with 60px backdrop blur for a sleek, modern feel.
  - **Adaptive Background**: High-quality arctic-themed environment with layered depth.
  - **Responsive Design**: Optimized for both mobile builders and desktop power users.
- **🔥 Smarter Discovery**:
  - **Scoring Engine**: Automatic ranking of hackathons based on prizes, tech stack (AI/Web3/LLM), and location.
  - **Dynamic "Popular" Tags**: Statistically calculated highlights for top-tier opportunities.
  - **Instant Search**: Fuse.js powered fuzzy search across titles, tags, and platforms.
- **🔔 Real-time Alerts**: Optional Telegram integration to notify you of high-value events the moment they are scraped.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database**: [Prisma](https://www.prisma.io/) with SQLite (local development)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Search**: [Fuse.js](https://www.fusejs.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom Glassmorphism utilities

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/allhacks-india.git
cd allhacks-india
npm install
```

### 2. Environment Setup
Create a `.env` file in the root:
```env
DATABASE_URL="file:./dev.db"

# Optional: Telegram Alerts
TELEGRAM_TOKEN="your_bot_token"
TELEGRAM_CHAT_ID="your_chat_id"
```

### 3. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Start Scraping
To populate your dashboard with the latest events:
1. Open the app at `http://localhost:3000`.
2. Click the **"Scrape Now"** button or hit the API directly at `GET http://localhost:3000/api/scrape`.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built for the next generation of builders in India. 🇮🇳
