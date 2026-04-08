## Frontend Design Philosophy

Rekapka must feel intentionally designed, not like generic AI-generated UI. Each theme is a distinct aesthetic commitment, not just a color swap. The app should be memorable — something people enjoy using, not just tolerate.

### Design Thinking
- **Purpose**: Team retrospective — reflective, collaborative, slightly playful. People use it after a sprint to be honest about what went wrong and celebrate what went well.
- **Audience**: Small dev teams (~5 people) who appreciate craft and personality in their tools.
- **Differentiator**: The 6 wildly different themes. Switching from iOS Liquid Glass to MS-DOS should feel like entering a completely different world, not just changing colors.

### Typography
- Avoid generic fonts (Inter, Roboto, Arial). Each theme uses a font that reinforces its identity:
  - **Default**: Geist Sans — clean, modern, slightly technical
  - **CLI**: JetBrains Mono — monospace, developer-native
  - **MS-DOS**: Courier New — fixed-width, retro CRT feel
  - **Material 3**: Geist Sans with larger line-height — airy, Google-inspired spacing
  - **Windows 95**: Tahoma — authentic system font from that era
  - **iOS 26**: SF Pro / system font — Apple-native feel
- Use `tabular-nums` for all numeric displays (timers, card counts, stats)
- Card text should have comfortable line-height (1.5+) for readability

### Color & Theme
- Each theme commits fully to its palette. No half-measures:
  - CLI dark mode: pure black background, bright green text — not gray-on-dark-gray
  - MS-DOS dark mode: saturated blue (#0000AA feel via oklch) — not washed-out navy
  - iOS 26: translucent glass with real alpha transparency — not just light gray
- Use CSS variables for every color. One theme file = one complete world
- Dominant color with sharp accent outperforms timid even distribution
- The Mad/Sad/Glad categories should have subtle color differentiation (warm red, muted blue, bright green) that works across all 6 themes

### Motion & Animations

All animations must respect `prefers-reduced-motion` — instant transitions for users who disable motion. Prefer CSS transitions on `transform` and `opacity` for 60fps. Use `animation-delay` for staggered effects.

**Page & Phase Transitions**
- **Phase switch**: Content crossfades (opacity 0→1, 150ms ease) when phase changes. Outgoing phase slides slightly up and fades out, incoming slides up from below and fades in. Not a hard cut.
- **Page load**: Staggered reveal — phase bar appears first (50ms), then participant bar (100ms), then main content (150ms). Subtle `translateY(8px)` → `0` on each.
- **Dashboard retro list**: Cards stagger in on load with 30ms delay between each. New retro slides in at the top when created.

**Card Animations**
- **Card added**: New card slides in from bottom with fade (`translateY(12px)` → `0`, opacity 0→1, 200ms ease-out). Other cards smoothly shift to make room (CSS `gap` transition).
- **Card deleted**: Card shrinks and fades out (`scale(1)→scale(0.95)`, opacity 1→0, 150ms), then list collapses smoothly.
- **Card edited**: Subtle flash/highlight on save — brief border glow (box-shadow pulse) to confirm the edit was saved.
- **Card blur reveal** (discussion phase): `filter: blur(8px)` → `blur(0)` over 300ms with slight scale `1.01` → `1` — feels like focusing a camera lens.
- **Card discussed**: Card slides out to the left with a green checkmark trail before disappearing. Next card slides in from the right.
- **Card skipped**: Card slides out to the right with a muted skip animation. Reappears at the end of the queue with a subtle "Skipped" badge fade-in.

**Interactive Feedback**
- **Button press**: Scale down to `0.97` on `:active` (50ms), back to `1` on release — tactile feel.
- **Send card button**: Brief rotate animation on the send icon (paper plane) when submitting — arrow shoots forward.
- **Phase bar "Next" button**: Gentle pulse glow (box-shadow animation, 2s loop) to draw attention — stops pulsing once clicked.
- **Tab switch** (mobile): Active tab underline slides to the new position (CSS `translateX` transition) rather than jumping. Content crossfades.
- **Emoji picker open**: Popover scales from `0.9` → `1` with fade (100ms ease-out) — bouncy entrance.
- **Delete confirmation**: Card border briefly flashes red before deletion.

**Timer & Progress**
- **Discussion timer**: Digits use `tabular-nums` and crossfade on number change (no layout shift). At 60-second marks, a subtle pulse on the clock icon (scale `1` → `1.15` → `1`, 300ms).
- **Phase bar progress**: When advancing, the completed phase pill background fills with a left-to-right wipe (200ms) before the next phase highlights.

**Celebration & Completion**
- **Confetti**: Full-screen canvas-confetti burst from both bottom corners, 3 seconds of particles. Triggered once on entering completed phase.
- **Stats counter**: Numbers on the completion screen count up from 0 to final value (e.g., "14 cards" counts 0→14 over 800ms, eased). Staggered start per stat card (100ms between each).
- **"View Full Stats" link**: Subtle shimmer/glow effect to invite clicking.

**Presence & Collaboration**
- **User comes online**: Avatar fades in with scale `0.8` → `1` in the participant bar. Green dot pulses once.
- **User goes offline**: Avatar fades to grayscale, green dot fades out.
- **Typing indicator** (if implemented): Three-dot bounce animation in the card input area when another user is typing.

**AI Grouping**
- **AI processing**: Cards scatter slightly (random `translateX/Y` jitter, ±4px) during loading — "thinking" effect. When groups resolve, cards smoothly slide into their group sections with staggered delay.
- **Group collapse/expand**: Chevron rotates 90°, content height animates with `grid-template-rows: 0fr → 1fr` (smooth CSS-only collapse).

**Empty States**
- **No cards yet**: Subtle floating animation on the illustration/icon (gentle `translateY` oscillation, 3s ease-in-out loop) — feels alive, not dead.
- **All cards discussed**: Checkmark draws itself (SVG stroke-dasharray animation) before the "All done!" message fades in.

### Spatial Composition
- **Writing phase (desktop)**: Three equal columns with generous gap — cards breathe, not cramped
- **Discussion phase**: Single card centered with dramatic negative space around it — focus and importance
- **Stats page**: Metric cards in a responsive grid, not a boring vertical stack — allow asymmetry (hero stat larger, secondary stats in 2-3 column grid)
- **Phase bar**: Horizontal stepper with clear visual weight on current phase — not a flat breadcrumb

### Backgrounds & Visual Details
- **Default theme**: Clean white/dark, minimal — the "professional" option
- **CLI theme**: Subtle scanline overlay effect in dark mode (CSS repeating gradient), cursor blink on focused inputs
- **MS-DOS theme**: Hard pixel borders (box-shadow based), no rounded corners anywhere, uppercase text in headers
- **Material 3 theme**: Layered elevation via subtle shadow + tonal surface colors, generous border-radius
- **Windows 95 theme**: Beveled borders (inset/outset box-shadow), classic title bar styling on cards
- **iOS 26 theme**: `backdrop-filter: blur()` on cards for real frosted glass, subtle gradient mesh background

### What to Avoid
- Generic purple-gradient-on-white aesthetic
- Cookie-cutter component layouts with no personality
- Same spacing/sizing for every element (vary to create rhythm)
- Flat, lifeless empty states — make "No cards yet" feel inviting, not dead
- Over-reliance on borders for separation — use spacing and background contrast instead

