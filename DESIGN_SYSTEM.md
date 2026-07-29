# Ridgeframe Design System

**Release:** `v0.1.0` — Unreleased

This document is the single machine-facing Ridgeframe design-system entry point. It is deliberately self-contained: when repository ingestion is unavailable, supply this file alone. Repository `/design-sync` remains preferred because it also exposes implemented component behavior and validation.

## 1. Brand and audience

Ridgeframe Strategies is a senior, diagnosis-first product experience and growth consultancy for established, owner-led businesses. Its promise is **clarity on what to fix and fund**. Build for leaders who need credible evidence, practical priorities, and calm senior judgment—not agency spectacle, startup optimism, or a generic software interface.

## 2. Authority boundaries

Apply the highest relevant authority in this order:

1. [Ridgeframe Strategies — Strategic Foundation](https://docs.google.com/document/d/169AxuBLFfFxSYzQkUmwacrtp9UCC0UquwIMkfM8j4hM/edit) governs current positioning, audience, outcomes, roles, and strategic decisions.
2. [Ridgeframe Strategies — Website Status](https://docs.google.com/document/d/1uxfGCAhgi9ss-2J4Dq-GJhy-3np1KzFGKVNpCiQwspE/edit) governs website readiness; it records that no Ridgeframe sitemap or final website copy is approved.
3. Approved Figma identity components govern logo geometry, wordmark geometry, lockups, and optical spacing when supplied. No approved logo binary or native Figma library ships in `v0.1.0`.
4. `tokens/source/*.json` governs token values; this document governs their usage, semantic intent, and prohibitions; React source governs implemented component properties, DOM semantics, and accessibility behavior.
5. Generated files are derived representations only. Examples demonstrate compositions and introduce neither tokens nor public primitives. Exported SVG, PNG, PDF, and `.fig` files are distribution artifacts, not replacement masters.

The Convergence text files [00 - Strategic Foundation](https://drive.google.com/file/d/1OC2dkPvdfaind0Rg-mGKFfDRCn6totFR/view) (`v2.3`) and [01 - Website Specification](https://drive.google.com/file/d/1xO55N0pQmsT1N0iHA43gqHL66mcti2BT/view) (`v2.5`) are historical only. They may explain provenance for a ratified decision, but cannot define current positioning, service tiers, site structure, copy, evidence requirements, or component scope.

An asset is not approved merely because it exists. Its source and approval status must be recorded in `assets/README.md` and the appropriate manifest; absent identity artwork must never be synthesized, traced, normalized, or reinterpreted.

## 3. Architectural Editorial Modernism

Use Architectural Editorial Modernism: Swiss grid discipline, calm authority, contemporary editorial typography, monochrome restraint, architectural framing, and functional teal signals. Favor structure, hairline rules, precise spacing, and quiet evidence. Avoid literal newspaper styling, dark technical dashboards, soft lifestyle minimalism, generic SaaS polish, high-energy agency conventions, Colorado or mountain clichés, ornamental texture, gradients, glass, glow, and exaggerated rounding.

`v0.1.0` includes tokens, layout foundations, Button, Link, Card, SectionShell, three evidence compositions, and a state-complete gallery. FormControl, Disclosure, Header, Footer, link and structure checks, and any approved homepage composition are deferred to `v0.2.0`. Do not infer those deferred interfaces from this release.

## 4. Token rules and generated snapshot

Use primitive tokens for raw values and semantic tokens for purpose. Do not introduce a color, type size, spacing value, radius, shadow, breakpoint, or z-index outside the token source when an existing token fits. Reference CSS through generated custom properties and TypeScript through the generated `tokens` export. Never edit generated output; change `tokens/source/*.json`, then run `npm run generate:tokens` and `npm run check:generated`.

The eight approved Ridgeframe primitive colors are:

| Approved token | Value | Primary role |
| --- | --- | --- |
| `brand/slate` | `#1B3A52` | Structure, inverse surfaces, ordinary interaction |
| `brand/teal` | `#0F6E56` | Findings and priority signals |
| `brand/rust` | `#854F0B` | Critical severity and admitted evidence roles |
| `neutral/off-white` | `#F9F8F7` | Canvas |
| `neutral/light` | `#BFBDB3` | Decorative dividers only |
| `neutral/mid` | `#6B6A64` | Muted text and control borders |
| `neutral/charcoal` | `#2C2C2A` | Primary text and strong structure |
| `accent/teal-100` | `#9FE1CB` | Subtle fills and the inverse focus halo |

White is an added accessibility primitive for raised surfaces and inverse text; it is not a ninth approved brand color. Off-white, white, charcoal, and neutrals carry most of the interface. Slate or charcoal carries ordinary actions. Teal is limited to diagnostic emphasis, priority, and High severity; no viewport may contain more than three persistent teal signal elements. Rust must not compete with teal. Teal-100 is fill-only and never a divider or standalone edge. Large teal or rust decorative fields are prohibited.

The table below is generated from the same in-memory token graph as `tokens/generated/tokens.css` and `tokens/generated/tokens.ts`. Preserve these exact guarded markers; the generator may replace only the content between them.

<!-- GENERATED:TOKENS:START -->
| Token | Type | Value |
| --- | --- | --- |
| `border.width.hairline` | `dimension` | `1px` |
| `breakpoint.desktop` | `dimension` | `1024px` |
| `breakpoint.mobile` | `dimension` | `0px` |
| `breakpoint.tablet` | `dimension` | `768px` |
| `breakpoint.wide` | `dimension` | `1440px` |
| `color.primitive.accent.teal-100` | `color` | `#9FE1CB` |
| `color.primitive.brand.rust` | `color` | `#854F0B` |
| `color.primitive.brand.slate` | `color` | `#1B3A52` |
| `color.primitive.brand.teal` | `color` | `#0F6E56` |
| `color.primitive.neutral.charcoal` | `color` | `#2C2C2A` |
| `color.primitive.neutral.light` | `color` | `#BFBDB3` |
| `color.primitive.neutral.mid` | `color` | `#6B6A64` |
| `color.primitive.neutral.off-white` | `color` | `#F9F8F7` |
| `color.primitive.neutral.white` | `color` | `#FFFFFF` |
| `color.semantic.action.primary-active` | `color` | `#1B3A52` |
| `color.semantic.action.primary-background` | `color` | `#1B3A52` |
| `color.semantic.action.primary-foreground` | `color` | `#FFFFFF` |
| `color.semantic.action.primary-hover` | `color` | `#1B3A52` |
| `color.semantic.border.control` | `color` | `#6B6A64` |
| `color.semantic.border.decorative` | `color` | `#BFBDB3` |
| `color.semantic.border.strong` | `color` | `#2C2C2A` |
| `color.semantic.canvas.default` | `color` | `#F9F8F7` |
| `color.semantic.diagnostic.emphasis` | `color` | `#0F6E56` |
| `color.semantic.disabled.background` | `color` | `#BFBDB3` |
| `color.semantic.disabled.border` | `color` | `#BFBDB3` |
| `color.semantic.disabled.foreground` | `color` | `#6B6A64` |
| `color.semantic.focus.inverse` | `color` | `#9FE1CB` |
| `color.semantic.focus.light` | `color` | `#1B3A52` |
| `color.semantic.focus.signal` | `color` | `#0F6E56` |
| `color.semantic.severity.critical.foreground` | `color` | `#854F0B` |
| `color.semantic.severity.high.foreground` | `color` | `#0F6E56` |
| `color.semantic.severity.medium.foreground` | `color` | `#1B3A52` |
| `color.semantic.surface.default` | `color` | `#FFFFFF` |
| `color.semantic.surface.inverse` | `color` | `#1B3A52` |
| `color.semantic.surface.raised` | `color` | `#FFFFFF` |
| `color.semantic.surface.subtle-emphasis` | `color` | `#9FE1CB` |
| `color.semantic.text.inverse` | `color` | `#FFFFFF` |
| `color.semantic.text.muted` | `color` | `#6B6A64` |
| `color.semantic.text.primary` | `color` | `#2C2C2A` |
| `color.semantic.text.secondary` | `color` | `#1B3A52` |
| `container.maximum` | `dimension` | `1280px` |
| `container.reading` | `dimension` | `720px` |
| `container.standard` | `dimension` | `1120px` |
| `font.dependency.eb-garamond` | `fontFamily` | `@fontsource-variable/eb-garamond` |
| `font.dependency.space-grotesk` | `fontFamily` | `@fontsource-variable/space-grotesk` |
| `font.family.display` | `fontFamily` | `"Space Grotesk", sans-serif` |
| `font.family.eb-garamond` | `fontFamily` | `"EB Garamond", serif` |
| `font.family.editorial` | `fontFamily` | `"EB Garamond", serif` |
| `font.family.identity` | `fontFamily` | `Jost` |
| `font.family.jost` | `fontFamily` | `Jost` |
| `font.family.space-grotesk` | `fontFamily` | `"Space Grotesk", sans-serif` |
| `font.family.utility` | `fontFamily` | `"Space Grotesk", sans-serif` |
| `font.weight.bold` | `fontWeight` | `700` |
| `font.weight.medium` | `fontWeight` | `500` |
| `font.weight.regular` | `fontWeight` | `400` |
| `font.weight.semibold` | `fontWeight` | `600` |
| `grid.column.desktop` | `number` | `12` |
| `grid.column.mobile` | `number` | `1` |
| `grid.column.tablet` | `number` | `8` |
| `grid.column.wide` | `number` | `12` |
| `grid.gutter` | `dimension` | `16px` |
| `motion.duration.default` | `duration` | `180ms` |
| `motion.duration.fast` | `duration` | `120ms` |
| `motion.duration.reduced` | `duration` | `0ms` |
| `motion.easing.standard` | `cubicBezier` | `cubic-bezier(0.2, 0, 0, 1)` |
| `motion.preference.reduced` | `string` | `prefers-reduced-motion` |
| `opacity.disabled` | `number` | `0.6` |
| `opacity.subtle` | `number` | `0.72` |
| `radius.default` | `dimension` | `4px` |
| `radius.maximum` | `dimension` | `8px` |
| `radius.none` | `dimension` | `0px` |
| `radius.subtle` | `dimension` | `2px` |
| `shadow.none` | `shadow` | `none` |
| `shadow.raised` | `shadow` | `0 2px 8px rgb(44 44 42 / 0.12)` |
| `size.target.minimum` | `dimension` | `24px` |
| `space.1` | `dimension` | `4px` |
| `space.10` | `dimension` | `40px` |
| `space.12` | `dimension` | `48px` |
| `space.16` | `dimension` | `64px` |
| `space.2` | `dimension` | `8px` |
| `space.24` | `dimension` | `96px` |
| `space.3` | `dimension` | `12px` |
| `space.4` | `dimension` | `16px` |
| `space.5` | `dimension` | `20px` |
| `space.6` | `dimension` | `24px` |
| `space.8` | `dimension` | `32px` |
| `space.base` | `dimension` | `4px` |
| `space.none` | `dimension` | `0px` |
| `space.semantic.page-gutter` | `dimension` | `16px` |
| `space.semantic.section` | `dimension` | `64px` |
| `space.semantic.section-wide` | `dimension` | `96px` |
| `type.letter-spacing.normal` | `dimension` | `0em` |
| `type.letter-spacing.utility` | `dimension` | `0.08em` |
| `type.line-height.body` | `number` | `1.55` |
| `type.line-height.editorial` | `number` | `1.6` |
| `type.line-height.tight` | `number` | `1.1` |
| `type.line-height.ui` | `number` | `1.3` |
| `type.size.body` | `dimension` | `18px` |
| `type.size.display` | `dimension` | `48px` |
| `type.size.heading-large` | `dimension` | `40px` |
| `type.size.heading-medium` | `dimension` | `32px` |
| `type.size.heading-small` | `dimension` | `24px` |
| `type.size.label` | `dimension` | `14px` |
| `type.size.lead` | `dimension` | `20px` |
| `type.size.ui` | `dimension` | `16px` |
| `type.size.utility` | `dimension` | `12px` |
| `z-index.base` | `number` | `0` |
| `z-index.overlay` | `number` | `30` |
| `z-index.raised` | `number` | `10` |
| `z-index.sticky` | `number` | `20` |
<!-- GENERATED:TOKENS:END -->

## 5. Typography and icon rules

Use Space Grotesk for display, headings, navigation, labels, buttons, and utilities. Use EB Garamond for body, lead, quotes, and editorial reading; body copy is at least `18px`. Jost is restricted to approved logotype geometry and is not a runtime UI or heading font. Lucide is the only interface icon system in `v0.1.0`; use a pinned `lucide-react` icon by name, never custom interface-icon geometry.

## 6. Layout and responsive behavior

Start mobile-first with one column, then use eight columns at tablet and twelve at desktop and wide. Breakpoints are `0px`, `768px`, `1024px`, and `1440px`; content widths are `720px` reading, `1120px` standard, and `1280px` maximum. Stack and reorder intentionally on mobile rather than shrinking desktop layouts. Use contained, framed, reading-width, and full-bleed patterns; keep reflow free of horizontal page scrolling.

## 7. Four public primitives

`v0.1.0` exposes exactly four public primitives:

- **Button:** primary, secondary, and tertiary actions with native button semantics, visible states, optional Lucide icons, and a dimension-preserving loading state.
- **Link:** inline, standalone, navigation, and inverse anchors that preserve native behavior and indicate external new-context links accessibly.
- **Card:** structural surfaces, control-grade borders, spacing, and optional interactive behavior.
- **SectionShell:** page-width containment, vertical rhythm, framing, surface tone, and heading relationships.

FormControl, Disclosure, Header, and Footer are deferred to `v0.2.0` and must not be simulated as additional public primitives in `v0.1.0`.

## 8. Three evidence compositions

The gallery may compose these examples from the four primitives, tokens, and layout; they are not exported primitives:

- **Findings Card:** Problem → Evidence → Impact → Recommendation, with an explicit Critical, High, or Medium label.
- **Annotated Screen:** one interface image, numbered annotations, text equivalents, and an explanatory caption.
- **Priority Map:** a bounded severity/effort excerpt with text labels and a linear mobile fallback, never a full audit matrix or dashboard.

Severity labels remain present in text and reading order; color is supplementary.

## 9. Accessibility and admitted contrast pairs

Target WCAG 2.2 AA: normal text meets `4.5:1`; large text and meaningful non-text controls meet `3:1`; focused content remains unobscured; native semantics precede ARIA; heading hierarchy is logical; and interactive targets use the `24px` minimum token unless a WCAG exception applies. Provide programmatic labels, descriptions, and errors; do not use color alone; respect reduced motion; and provide a non-drag alternative for any future dragging interaction.

Only these foreground/background pairs are admitted until contrast validation says otherwise: charcoal/off-white, charcoal/white, slate/off-white, off-white/slate, white/slate, teal/off-white, teal/white, off-white/teal, white/teal, rust/off-white, white/rust, mid/off-white, mid/white, charcoal/teal-100, slate/teal-100, and teal-100/slate. Teal/slate, light/off-white, teal/teal-100, and teal-100/off-white are known failures and prohibited. The explicit semantic registry in `tokens/source/colors.json` is the machine-enforced admission set: run `npm run check:contrast` after any relevant source-token change. It validates normal text at `4.5:1`, large text at `3:1`, and meaningful non-text controls at `3:1`; an undeclared pair fails closed even if its calculated ratio would otherwise pass. Use `color.focus.light` on light surfaces; reserve `color.focus.signal` for diagnostic and priority controls on light surfaces; render `color.focus.inverse` as a filled halo on slate.

## 10. Content guidance

Write with clarity, experience, calm candor, practical evidence, approachability, and decisive restraint. State the problem, evidence, impact, and recommendation plainly. Avoid agency jargon, startup language, empty superlatives, vague transformation claims, unsupported revenue promises, clever but meaningless headlines, excessive innovation language, long component copy, and Lorem ipsum.

## 11. Prohibitions and website gate

Do not create a homepage, website templates, marketing pages, dashboard, full audit UI, speculative navigation, authentication, ecommerce, a Figma plugin, an empty `.fig` file, recreated logo assets, or custom interface icons. The Ridgeframe homepage is deferred to `v0.2.0`. Homepage work may begin only after the current Ridgeframe website specification, sitemap, and content direction are approved and linked by the current website authority; the historical eleven-section Convergence outline does not clear this gate.

## 12. Claude Design `/design-sync` use

Use repository sync as the authoritative Claude Design ingestion path: open this package with Claude Code `2.1.181` or later, run `/design-sync`, and publish the resulting system. If a single file must be supplied, use this file because it carries the complete policy and token snapshot, while recognizing that it cannot replace component validation. `/design-sync` does not watch the repository: rerun it after each token or component change intended for Claude Design and from every tagged release checkout.
