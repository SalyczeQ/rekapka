## Web Interface Guidelines

Follow the [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) throughout the entire build. Key rules to apply:

### Accessibility
- Icon-only buttons must have `aria-label` (e.g., theme toggle, emoji picker, delete card, send button)
- All form controls need associated labels (card input, new retro form, settings forms)
- Interactive elements must support keyboard navigation (Tab, Enter, Escape)
- Use semantic HTML (`<nav>`, `<main>`, `<header>`, `<section>`) over generic `<div>` with ARIA roles
- Heading hierarchy must be logical (`h1` → `h2` → `h3`, no skipping)

### Focus States
- All interactive elements need visible focus rings: `focus-visible:ring-*` (Tailwind)
- Never use `outline-none` without a replacement focus style
- Use `:focus-visible` (not `:focus`) so mouse clicks don't show focus rings

### Forms
- Inputs need `autocomplete` attributes (e.g., `autocomplete="name"` on settings name field)
- Use correct input types (`type="email"`, `type="date"`, `type="url"`)
- Never block paste on any input
- Labels must be clickable (wrap input or use `htmlFor`)
- Disable `spellcheck` on email and code inputs

### Animation
- Honor `prefers-reduced-motion`: wrap animations in `@media (prefers-reduced-motion: no-preference)`
- Only animate `transform` and `opacity` for smooth 60fps
- Never use `transition: all` — always specify exact properties
- Confetti and phase transitions must be interruptible

### Typography
- Use ellipsis character (`…`) not three dots
- Use curly quotes (`"` `"`) in user-facing text, not straight quotes
- Use non-breaking spaces (`&nbsp;`) for measurements and brand names
- Use `tabular-nums` font feature for number columns (card counts, timers, stats)

### Content Handling
- All text containers need truncation strategy (`truncate`, `line-clamp-*`, or scroll)
- Handle empty states everywhere (no cards, no retros, no action items, no stats)
- Anticipate long user input (card text, retro titles, user names) — design for overflow

### Images
- Set explicit `width` and `height` on all images (avatars, retro photos)
- Lazy load below-fold images
- Priority load for critical images (user avatar in nav)

### Performance
- Virtualize card lists if they exceed 50 items (unlikely for ~5 users, but guard)
- Avoid layout reads during render
- Prefer uncontrolled inputs where possible (card input can be controlled for emoji insertion)
- Preconnect to CDNs if using external fonts

### Navigation & State
- URL must reflect application state (retro ID in URL, phase visible on load)
- Use semantic `<a>` / `<Link>` for navigation, `<button>` for actions
- Deep-link stateful UI: refreshing the page at any phase should restore the exact view
- Require confirmation for destructive actions (delete retro, delete card)

### Touch & Interaction
- Set `touch-action: manipulation` on swipeable areas (category tabs)
- Set `overscroll-behavior: contain` on scrollable panels to prevent pull-to-refresh interference
- Handle text selection during drag (disable selection on swipe targets)

### Safe Areas
- Use `env(safe-area-inset-*)` for bottom nav on notched devices
- Manage scrollbar appearance across platforms
- Use flex/grid layouts (not absolute positioning)

### Dark Mode
- Apply `color-scheme: dark` when in dark mode
- Set `<meta name="theme-color">` dynamically per theme
- Explicitly style native select elements in dark mode

### Locale & i18n
- Use `Intl.DateTimeFormat` for all dates (retro date, due dates) — never manual formatting
- Use `Intl.NumberFormat` for number display (stats, durations)
- Detect language from cookie, not browser `navigator.language`

### Hydration Safety
- Controlled inputs must have `onChange` handlers
- Guard date/time rendering that differs between server and client (use serialized strings)
- Minimize `suppressHydrationWarning` — only on `<html>` for theme class

### Content & Copy
- Use active voice in UI text ("Create a retro" not "A retro can be created")
- Title Case for headings, sentence case for descriptions
- Specific button labels ("Create Retro" not "Submit", "Mark Discussed" not "Done")
- Error messages must suggest a fix ("No cards yet. Add one above." not just "Empty")

### Anti-patterns to Avoid
- Never disable zoom in viewport meta (`maximum-scale=1` is acceptable, `user-scalable=no` is not)
- Never `preventDefault` on paste events
- Never use `transition: all`
- Never leave form inputs without labels

