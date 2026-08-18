# Repossessed Rides — Next Generation

A rebuilt, modernised powersports dealership site: Next.js App Router, React 19,
TypeScript, Tailwind CSS v4, Framer Motion and Lucide icons.

It follows the information architecture and user journeys of a full-service
powersports dealer (inventory → category → unit → enquiry, plus service, parts,
financing and trade-in), with a rebuilt design system, motion layer and
accessibility pass.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Structure

```
src/
  app/                      routes (App Router)
    page.tsx                home
    inventory/              browse + filters
    inventory/[slug]/       unit detail page
    specials/ financing/ trade-in/ service/ parts/ locations/ about/ contact/
    api/leads/              form intake endpoint
    sitemap.ts robots.ts    SEO plumbing
  components/
    Header MobileMenu SearchOverlay Hero CategoryGrid ProductCard
    ProductCarousel Specials BrandSection Services About FinancingCta
    PaymentCalculator ImageGallery LocationCard ContactSection Footer
    forms/                  form kit + one component per lead type
    inventory/              filter model and browser UI
    motion/                 Reveal / Stagger / Counter primitives
    ui/                     Button, Modal
  data/                     site, categories, brands, products
  lib/                      finance maths, validation, helpers
scripts/
  generate-images.mjs       builds the SVG artwork library
  generate-og.mjs           rasterises the social card
```

## Data and the admin path

Nothing is hardcoded inside a UI component. `src/data/*.ts` holds the dealership
identity, navigation, locations, categories, brands and inventory, and every
component reads from those modules. Each product carries `id, year, make, model,
trim, category, condition, price, msrp, usage, locationId, stockNumber, color,
images, description, specifications, features` — plus derived `monthlyPayment`
and `savings`.

To move to a backend (Supabase, Firebase, a DMS feed), replace the exports in
`src/data/products.ts` with async fetchers and await them in the server
components. The filter model in `src/components/inventory/filters.ts` is a pure
function over an array, so it works unchanged against remote data or can be
pushed into a SQL `where` clause.

Form submissions all POST to `src/app/api/leads/route.ts` with
`{ kind, fields }`. It validates and returns a reference number today; point it
at a CRM, a database table or a transactional email provider and every form on
the site is live with no component changes.

## Images

The photography is **reused from Wikimedia Commons under licences that permit
commercial use** — CC0, Public Domain, CC BY and CC BY-SA. No NonCommercial or
NoDerivatives material is included, and no manufacturer logo artwork is
reproduced: brand names appear only as plain typographic wordmarks, used
nominatively to describe the lines carried.

Cropping and re-encoding makes these derivative works, so the ShareAlike terms
require attribution to travel with the site. Credits are generated into
`src/data/credits.ts`, published at `/credits` and linked from the footer.
**Keep that page in place.**

The pipeline is three stages:

```bash
node scripts/harvest-photos.mjs    # search Commons -> .photo-cache/ (+ licence manifest)
node scripts/contact-sheet.mjs DIR # render contact sheets for curation by eye
node scripts/build-photos.mjs      # promote curated picks -> public/images + credits
```

`.photo-cache/` is gitignored; re-run the harvest to rebuild it. The curated
picks live in the `SELECTION` map in `scripts/build-photos.mjs` — every index
there was reviewed on a contact sheet.

Because the free pool is limited, some brand tiles show *the category a brand is
known for* rather than that manufacturer's own machine. No tile carries a
competitor's visible mark. Swap in licensed or first-party photography by
replacing files in `public/images/**` under the same names — no code changes
needed, as everything uses `next/image` with `fill` and explicit `sizes`.

## Motion

Framer Motion throughout, with `prefers-reduced-motion` honoured at three
levels: the CSS reset neutralises transitions, `Reveal`/`Stagger`/`Counter`
drop their transforms and settle to opacity-only, and the hero autoplay and
intro loader are disabled entirely.

The first-visit intro (`PageLoader`) plays once per session via `sessionStorage`.

## Accessibility

Skip link, single `h1` per page, labelled controls throughout, `aria-pressed` on
toggles, `aria-current` on active nav and carousel slides, focus trapping in the
modal and mobile drawer, Escape-to-close on every overlay, keyboard arrow
navigation in the lightbox, and a visible focus ring driven by `:focus-visible`.

## SEO

Per-route `title`/`description`/canonical, Open Graph and Twitter cards backed by
a pre-rendered PNG, `sitemap.xml`, `robots.txt`, and JSON-LD for `Organization`,
`AutomotiveBusiness` (one per store, with geo and opening hours), `Product` (per
unit, with offers), `BreadcrumbList` and `FAQPage`.

## Deploying to Vercel

Import the repository at [vercel.com/new](https://vercel.com/new). The defaults
are correct — framework **Next.js**, build `next build`, install `npm install`.
No environment variables are required for the site as it stands.

Set the canonical origin so metadata, `sitemap.xml` and JSON-LD emit absolute
URLs on your domain: update `url` in `src/data/site.ts` to the deployed origin.

`/api/leads` runs as a serverless function. It currently validates and returns a
reference number without persisting anything — wire it to your CRM, database or
email provider before treating submissions as captured.

## Notes

This is a design and engineering demonstration. Pricing, inventory, reviews and
the dealership narrative are realistic sample data, not live commercial
information.
