# Tharuka Bandara — Portfolio

A multi-page portfolio for a Full-Stack Software Engineer. Built with Next.js 16 App Router, React, TypeScript, Tailwind CSS 4 and Motion.

## Requirements

- Node.js 20.9+ (Node.js 22 LTS recommended)
- npm

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Available scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Project structure

- `src/app` — routes, layouts and page metadata
- `src/components` — reusable UI, navigation, cards and animation components
- `src/data` — typed portfolio content
- `public` — static assets such as the CV and project screenshots

## Before publishing

1. Add your professional portrait to `public/images/profile/` and replace the portrait placeholder on the homepage and About page.
2. Add your final CV at `public/resume/tharuka-bandara-cv.pdf`.
3. Verify all experience titles, dates, responsibilities and project claims.
4. Replace project placeholders with approved screenshots, repositories and live demo URLs.
5. Update `metadataBase` in `src/app/layout.tsx` when your domain is selected.
6. Configure the contact form and Resend environment variables when that feature is implemented.
7. Run `npm run lint` and `npm run build`.
8. Push to GitHub and deploy through Vercel.

## Important content note

Internship descriptions are deliberately high-level placeholders. Only publish work that you are authorized to disclose. Never publish private source code, credentials, customer data or confidential company details.

## GitHub

https://github.com/Tharukabandara

## LinkedIn

https://www.linkedin.com/in/tharuka-bandara-57b52b297
