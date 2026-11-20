# Theme "everyone" (Next.js): developer guide

The main homepage design and every inner page rebuilt to match it. This project is also the **template for
the other themes**: copy it, then change the look (see `/new-theme`). Read `../../CLAUDE.md` and
`../../docs/HANDOFF.md` first.

## Run

```bash
npm install
npm run dev            # http://localhost:3010   (PORT=3020 npm run dev to change)
npm run typecheck      # tsc --noEmit
npm run build && npm start
```

Stack: Next.js 16 (App Router, Turbopack), React 19, Tailwind 3, framer-motion 12, lucide-react. No UI library.
`next.config.ts`: `reactStrictMode`, `images.unoptimized`, `devIndicators: false` (the badge covered the quick-links button).

## Layout of the code

```
src/app/                 routes only: each page.tsx exports metadata and renders a view
  page.tsx               home  → views/HomeModern
  [...slug]/page.tsx     "being redesigned" placeholder for pages not built yet (sections map; now only mobile, admin)
  news/[slug], regulations/doc/[id]   generateStaticParams + generateMetadata (Next 16: params is a Promise)
  resources/chronicles   redirect("/chronicles")
src/views/<page>/        everything for one page: <Name>Page.tsx (client), sections, data
src/views/theme/         the theme's look, shared by every inner page  ← re-skin this for a new theme
src/views/homemodern/    the home page sections; Headline.tsx is the numbered section title used everywhere
src/views/docs/kit.tsx   document pages (Act, regulation docs, Q1 report, forms): DocHero, Toc, ReadingBar, PdfCard…
src/views/about/primitives.tsx   scrollToId + sectionAliases (old anchors), CountUp, Spotlight, Tilt, reveal
src/components/          site chrome: layout/Layout, Header, Footer, NoticesBell, PromoPopup, CookieConsent,
                         chat/Chatbot, QuickLinks, AccessibilityWidget, LanguageSwitcher, LanguageNotice
src/lib/router.tsx       react-router-style API on top of next/navigation (see below)
src/lib/data.ts          navigation (mega menus), news list, operators summary
src/i18n/                language engine + Hausa/Yoruba/Igbo dictionaries
public/                  images, documents/text/*.json (web versions of PDFs), magazine PDF, videos
```

`src/pages` is reserved by Next.js, which is why page code lives in `src/views`.

### Routes built

`/`, `/about`, `/about/service-charter`, `/services`, `/operators`, `/resources`, `/resources/faq`,
`/resources/forms-and-checklists`, `/resources/reports/q1-2026`, `/regulations`, `/regulations/pension-reform-act`,
`/regulations/doc/[id]` (197 pages), `/connect`, `/news`, `/news/[slug]`, `/performance`, `/media`, `/chronicles`.
Still placeholders: `/mobile`, `/admin` (see HANDOFF).

## The router adapter (`src/lib/router.tsx`)

Ported pages keep react-router code. Import from `@/lib/router`, never `react-router` or raw `next/link` in views:

- `<Link to="/x#y">` (string or `{pathname, search, hash}`), `preventScrollReset` maps to `scroll={false}`.
- `useLocation()` → `{ pathname, search, hash }` (hash is tracked; `history.pushState` is patched to emit `pencom:locationchange` via `queueMicrotask`).
- `useNavigate()(to, { replace, preventScrollReset })`.
- `useSearchParams()` → `[params, set]`; `set(next, { replace: true, preventScrollReset: true })` for filters kept in the URL.

## The theme kit (what makes a page look like this theme)

`src/views/theme/ui.tsx`
- `PageHero({ id, crumbs, pill: {icon,label}, title, mark, intro, actions?, aside? })`: light hero with soft colour
  fields, dot grid, breadcrumb, pill, title with the `mark` phrase in green with a drawn gold underline. It translates
  the whole title and then finds the translated mark in it (case-insensitive).
- `FramedPanel`: white card in the offset dark-green frame (hero side panels).
- `SectionNav({ sections, pillId })`: sticky "on this page" bar under the header; active item by scroll position.
- `Modal`, `Drawer`: accessible dialogs (focus in and back, Escape, scroll lock).
- `Rise`, `ease`, `focus` (yellow focus ring), `sectionCls`.

`src/views/theme/heading.tsx`
- `SectionHeading({ id, eyebrow, title, highlight?, intro?, action?, dark?, stacked?, n? })` → `homemodern/Headline`.
  The number comes from the `numbers` map keyed by the heading id (unique site-wide), or `n` to override.
  Put a section's controls (filters, selects, period toggles) in `action`, not in a flex row beside the heading.
  Use `stacked` when the heading sits in a narrow column.

Colours: dark green `#0A4A13`, green `#117F21`, gold `#CB9615`, light gold `#F4D27A`, text `#0E2414`,
page `#FBFCF9`, soft band `#F6F8F3`, mint `#E8F5E9`, focus `#FFD84D`. The original app's `#04240A` was replaced by
`#0A4A13` everywhere except photo overlays.

Page pattern: `<MotionConfig reducedMotion="user"><div className="bg-[#FBFCF9] text-[#0E2414]"> Hero → SectionNav →
numbered sections (alternating white and #F6F8F3, one dark-green band per page at most) </div></MotionConfig>`.
Exceptions on purpose: news stories keep a dark photo header; Chronicles has a hand-built serif masthead.

## Conventions and pitfalls (each one bit us once)

- **Server rendering:** no `window`/`localStorage`/`navigator`/`innerHeight` during render or in `useState(() => …)`.
  Initialise with a constant, read in `useEffect`, and gate saving with a `ready` flag so you don't overwrite storage.
- **Mobile overflow:** never animate cards in from the side (`initial={{ x: 20 }}` on `whileInView`): offscreen cards
  keep the offset and widen the page on phones. Use `y`.
- **Highlight phrases:** must be a substring of the title in every language (check after a translation pass).
- **Old links:** hash anchors and `sectionAliases` keep working; pages handle `#id` with two `scrollToId` calls
  (80 ms smooth, 900 ms instant) because sections render late.
- **Data honesty:** placeholders are labelled on the page (PFA returns are sample figures; news items are drafts until
  the CMS). Don't invent office hours, figures or names.
- **External libraries at run time** (pdf.js was): load with `new Function("u","return import(u)")(url)` so the bundler
  ignores them. The flip-book reader was removed at the user's request.
- **Content headings that are split into animated words/letters** (story titles, Chronicles masthead) carry
  `data-no-translate`, or the translator will translate single words.
- **Dev server goes stale:** when several files change at once (or a file is written by another tool), Turbopack can
  keep an old module: hydration errors that name an old line, `X is not a function`, or headings numbered "—".
  Fix: restart `npm run dev`, or make a real edit to the stale file. Check server HTML with
  `curl -s localhost:3010/<page>` before blaming the code.
- After changing a shared kit file, re-check two other pages that use it.

## Languages (`src/i18n`)

- English is the official version. Hausa, Yoruba and Igbo are **drafts** for review by PenCom staff
  (questionnaire DES-39). The site starts in English on the server and applies the saved language after mount.
  `?lang=ha|yo|ig|en` in the address switches and saves the choice (`localStorage pencom:lang`).
- `dom.ts` (DomTranslator) swaps whole text nodes and `aria-label/placeholder/title/alt` by exact English key
  (whitespace collapsed, curly quotes straightened), watches the DOM, and marks leftovers `lang="en"`.
  Keys may contain placeholders: `"Showing {shown} of {total} items"`, `"Call {name}"` (`{n}`,`{shown}`,`{total}`,`{count}`
  match digits; `{name}` must start with a capital; others match any text; a captured value is itself translated if
  the dictionary has it).
- Components can call `t("English", vars)` from `useI18n()`; Headline/PageHero/About hero do this for whole titles.
- `/regulations/*` is always English (`isLegalPath`). Content stays English by policy: names, addresses, dates,
  figures, document titles, news story text, the Q1 report text, the signed charter text, media captions.
- Dictionaries: `dict/ha.ts`, `yo.ts`, `ig.ts` have identical keys (1,651 each). New entries go in a marked section at
  the end. Tools and the full procedure: `tools/i18n/README.md` and `/i18n-pass`.

## Verify before you report

`npm run typecheck` → `npm run build` → open the page in a browser at desktop width and at 390 px:
every section renders, highlights and numbers are right, no horizontal scroll
(`document.documentElement.scrollWidth === clientWidth`), interactive bits work (filters update the URL, dialogs
open/close with Escape and return focus), console has no errors on a clean reload, and in one other language
(`?lang=yo`) the headings and highlights look right. Then set the browser back to English (`?lang=en`).
