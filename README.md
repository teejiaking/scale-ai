# Scale (concept build)

An unofficial, original marketing site modeled on the structure of [scale.com](https://scale.com): hero, products, industries, customer stories, research, and a demo request flow. All copy, illustrations, animations, and the logo were written or drawn for this project. Nothing was copied from the real site, and it is not affiliated with or endorsed by Scale AI, Inc.

## Stack

- Next.js 16.4 (App Router, Cache Components, Turbopack)
- React 19.3, TypeScript (strict)
- Tailwind CSS 4.3
- lucide-react icons, Geist Sans and Geist Mono via `next/font`

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build with type checking
npm start       # serve the production build
npm run lint
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Homepage: lidar-style hero animation, stack illustration, product tabs with mock UIs, industries showcase, customer carousel, research, CTA |
| `/demo` | Book-a-demo form with client-side validation |
| `/blog/[slug]` | Four statically generated articles |
| anything else | Custom 404 page (unknown blog slugs return a real 404 status) |

## Project layout

```
src/
  app/            routes, layout, global styles, icon
  components/     header, footer, buttons, shared UI
    home/         homepage sections, canvas scenes, product mocks
  content/        site data (products, solutions, nav, stories) and blog posts
  lib/            small hooks and helpers
```

Navigation, footer links, product tabs, and solution cards all read from `src/content/site.ts`, so editing a product or link there updates it everywhere.

## Behavior notes

- **Product tabs deep-link.** `/#data-engine`, `/#genai-platform`, `/#donovan`, and `/#evaluation` open the matching tab. Selecting a tab updates the hash.
- **Header theme.** The header switches between light and dark based on the `data-header-theme` attribute of the section beneath it.
- **Motion.** Canvas animations pause off screen. With `prefers-reduced-motion`, canvases render one still frame, the rotating headline stops, and scroll reveals are disabled. The industries section also has a pause button.
- **Accessibility.** Keyboard support for menus (Escape, click-outside, focus return), ARIA tabs with arrow keys, an inert background behind the mobile menu, a skip link, and form errors linked to their fields.

## Before going live

- **The demo form does not send data.** It validates in the browser and shows a confirmation. Connect `onSubmit` in `src/app/demo/demo-form.tsx` to your CRM or email service.
- **Search indexing is off.** `robots: { index: false }` in `src/app/layout.tsx` keeps the concept out of search results so it can't be mistaken for the real site. Remove it if you rebrand and launch.
- **Content is illustrative.** Customer stories are anonymized examples, and the leaderboard uses placeholder models and scores.
- **There is no login page by design.** A cloned sign-in form for a real brand is a phishing pattern.
