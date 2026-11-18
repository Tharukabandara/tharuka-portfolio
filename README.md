# Tharuka Bandara — Full-Stack Software Engineer Portfolio

A modern, full-stack developer portfolio and CMS built with **Next.js 16 App Router**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Motion v12**, **Supabase PostgreSQL (RLS + Auth + Storage)**, and **Resend**.

---

## Features & Architecture

- **Dark Premium Engineering UI**: Charcoal surfaces (`#090c10`), electric cyan (`#20cfff`), and electric lime (`#c8ff00`) accents with `Plus Jakarta Sans` and `JetBrains Mono` typography.
- **6 Modern Interactive Motion Systems**:
  - Ambient desktop cursor spotlight & floating background orbs (`AmbientBackground`)
  - Global neon scroll progress bar (`ScrollProgress`) & route slide-fade transitions (`template.tsx`)
  - 3D perspective spring tilt cards (`TiltCard`) & floating Hero HUD badges (`HeroPortrait`)
  - Mouse-tracking radial neon border & surface spotlight cards (`SpotlightCard`)
  - Magnetic CTA buttons (`Magnetic`) & staggered word blur-reveal headings (`BlurText`)
  - Infinite pause-on-hover tech marquee (`TechMarquee`), shared `layoutId` filter pills (`ProjectsFilterGrid`), and scroll-linked glowing experience timeline beam (`ExperienceTimeline`)
- **Hybrid Data Repository (`src/lib/portfolio-repository.ts`)**: Reads live content from Supabase PostgreSQL when configured, and automatically falls back to version-controlled `src/data/*.ts` files so the site never breaks.
- **Protected Full-Portfolio Admin CMS (`/admin` & `/admin/login`)**:
  - Manage Contact Submissions Inbox, Projects & Case Studies, Experience entries, and upload a new Profile Picture or CV PDF directly to Supabase Cloud Storage (`portfolio-assets`).
  - Includes a **1-Click "Sync / Seed Database from Code"** button.

---

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (and [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Control Center).

---

## Step-by-Step Production Deployment (Vercel Free Hobby Tier)

### 1. Prepare Supabase PostgreSQL & Admin User
1. In your [Supabase Dashboard](https://supabase.com/dashboard), open **SQL Editor → + New query**.
2. Paste the contents of [`supabase/migrations/001_init_portfolio_schema.sql`](./supabase/migrations/001_init_portfolio_schema.sql) and click **Run**.
3. Open **Authentication → Users → Add user → Create new user**:
   - **Email:** `tharukabandara821@gmail.com`
   - **Password:** *(Your admin password)*
   - Check **Auto Confirm User** ✅

### 2. Deploy to Vercel (Free Forever)
1. Push your latest commits to GitHub (`git push`).
2. Log in to [vercel.com](https://vercel.com) with GitHub and click **Add New... → Project**.
3. Import your `tharuka-portfolio` repository.
4. Expand **Environment Variables** and paste the contents of your local `.env.local` file (`Ctrl + V` into the first key box automatically populates all variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL` (`tharukabandara821@gmail.com`)
   - `RESEND_API_KEY` (`re_...`)
   - `CONTACT_TO_EMAIL` (`tharukabandara821@gmail.com`)
   - `CONTACT_FROM_EMAIL` (`Portfolio Contact <onboarding@resend.dev>`)
5. Click **Deploy**.

### 3. Set Your Free `.vercel.app` Domain & Supabase Auth Redirect
1. In Vercel **Settings → Domains**, rename your `.vercel.app` domain to **`tharukabandara.vercel.app`**.
2. In Supabase **Authentication → URL Configuration**:
   - **Site URL:** `https://tharukabandara.vercel.app`
   - **Redirect URLs:** `https://tharukabandara.vercel.app/**`
3. Open `https://tharukabandara.vercel.app/admin/login`, sign in, and click **Sync / Seed Database from Code**!

---

## GitHub & LinkedIn

- **GitHub:** [https://github.com/Tharukabandara](https://github.com/Tharukabandara)
- **LinkedIn:** [https://www.linkedin.com/in/tharuka-bandara-57b52b297](https://www.linkedin.com/in/tharuka-bandara-57b52b297)
