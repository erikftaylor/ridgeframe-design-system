# Ridgeframe Design System Repository Design

**Status:** Approved architecture; implementation pending written-spec review
**Date:** 2026-07-28
**Repository:** `erikftaylor/ridgeframe-design-system`
**Initial implementation branch:** `feat/design-system-foundation`

## 1. Purpose

Build a small, production-quality React design-system package that Claude Design can ingest through Claude Code's `/design-sync` command. The same package must be understandable to designers and developers, render a canonical Ridgeframe homepage, and provide a stable code foundation for a future native Figma library.

The system expresses Ridgeframe Strategies as a senior, diagnosis-first product experience and growth consultancy for established, owner-led businesses. Its core promise is:

> Clarity on what to fix and fund.

The implementation must feel architectural, editorial, precise, calm, modern, and enduring. It must communicate senior consultancy rather than marketing agency, web shop, startup, or Colorado lifestyle brand.

## 2. Primary Consumers and Retrieval Paths

### Claude Design

The preferred ingestion path is:

1. Clone or open the repository locally.
2. Start Claude Code from the package root.
3. Run `/design-sync`.
4. Publish the resulting Ridgeframe system within Claude Design.

`/design-sync` receives the complete token definitions and real React components. `DESIGN_SYSTEM.md` is the single machine-facing rules document and must remain sufficient to explain the system without requiring Claude to stitch together multiple policy files.

If only one file can be supplied, provide `DESIGN_SYSTEM.md`. That fallback communicates the complete rules and token snapshot but cannot substitute for the React component implementations. Repository sync is therefore the authoritative Claude Design ingestion path.

### Humans

`README.md` is the human entry point. It explains setup, development, validation, release tagging, Claude Design synchronization, and the future Figma workflow.

### Figma

A native Figma library is not part of version `0.1.0`. After the code system is approved, the repository can seed a Figma Design file through Figma's `figma-generate-library` workflow. An exported `.fig` file is an output of that later workflow; the repository does not carry an empty stand-in.

## 3. Scope

Version `0.1.0` includes:

- Primitive and semantic design tokens
- Generated CSS variables and typed TypeScript token exports
- Eight React primitives
- Layout foundations
- A state-complete component gallery
- One canonical responsive homepage
- Brand, content, accessibility, and usage rules
- Automated generation and validation
- GitHub Actions verification
- Release and Claude Design synchronization instructions

Version `0.1.0` excludes:

- A complete marketing website
- Services, About, Contact, case-study, article, or legal page templates
- Dashboards, audit reports, scorecards, prioritization matrices, or application UI
- Authentication, ecommerce, or product navigation
- A Figma plugin
- A generated or recreated Ridgeframe logo
- A `.fig` file
- Presentation, social-media, or client-deliverable templates
- Code Connect mappings
- Storybook
- A published npm package

## 4. Source-of-Truth Boundaries

The system has deliberately separate authorities:

1. **Approved Figma identity components:** logo geometry, wordmark geometry, lockups, and optical spacing.
2. **`tokens/source/*.json`:** canonical token values.
3. **`DESIGN_SYSTEM.md`:** canonical usage rules, semantic intent, content guidance, prohibitions, and an automatically generated token snapshot.
4. **React component source:** canonical component behavior, properties, DOM semantics, and accessibility implementation.
5. **Generated files:** derived representations only; never edit them directly.
6. **Examples:** reference compositions; they demonstrate the system but do not introduce new primitives or tokens.
7. **Exported SVG, PNG, PDF, or `.fig` files:** distribution artifacts, not replacement masters.

When sources conflict, follow the highest applicable authority. Token generation must make conflicts between JSON values, generated CSS, generated TypeScript, and the token snapshot impossible to merge unnoticed.

No asset is approved merely because it exists in the repository. Every identity asset must identify its source and approval status in `assets/README.md` and the relevant manifest. The logo manifest records that approved binaries are absent until they are supplied; it is not permission to synthesize them. The icon manifest records the pinned Lucide package, license, and icon names used by components.

## 5. Repository Architecture

```text
ridgeframe-design-system/
├── README.md
├── DESIGN_SYSTEM.md
├── CHANGELOG.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── docs/
│   ├── decisions/
│   └── superpowers/
│       └── specs/
├── tokens/
│   ├── source/
│   │   ├── colors.json
│   │   ├── typography.json
│   │   ├── spacing.json
│   │   ├── layout.json
│   │   └── effects.json
│   └── generated/
│       ├── tokens.css
│       └── tokens.ts
├── components/
│   ├── Button/
│   ├── Link/
│   ├── FormControl/
│   ├── Card/
│   ├── Disclosure/
│   ├── Header/
│   ├── Footer/
│   ├── SectionShell/
│   └── index.ts
├── layouts/
│   ├── reset.css
│   ├── typography.css
│   ├── containers.css
│   ├── grid.css
│   └── index.css
├── examples/
│   ├── component-gallery/
│   └── homepage/
├── assets/
│   ├── logos/
│   │   └── manifest.json
│   ├── icons/
│   │   └── manifest.json
│   ├── licenses/
│   └── README.md
├── scripts/
│   ├── generate-tokens.mjs
│   ├── check-generated.mjs
│   ├── check-contrast.mjs
│   ├── check-links.mjs
│   ├── check-structure.mjs
│   └── tests/
└── .github/
    └── workflows/
        └── validate.yml
```

The three Markdown files at the root have non-overlapping responsibilities:

- `README.md`: human orientation and operations
- `DESIGN_SYSTEM.md`: complete machine-facing system definition
- `CHANGELOG.md`: release history

Supporting documents under `docs/decisions/` record significant design or technical decisions without duplicating operating rules.

## 6. Technology and Package Contract

The package uses React, TypeScript, Vite, Vitest, Testing Library, and an axe-core integration. React is a peer dependency so consumers can use their own compatible React installation. The examples install React as a development dependency.

Components use semantic HTML, CSS custom properties, and co-located component CSS. They do not depend on Tailwind, CSS-in-JS, a proprietary styling runtime, or a third-party component framework.

The package exports:

- Every public React primitive and its TypeScript properties
- Generated TypeScript tokens
- Generated CSS tokens
- Layout foundation CSS

No component may introduce an undeclared color, type size, spacing value, radius, shadow, breakpoint, or z-index when an appropriate token exists.

## 7. Brand Foundations

### Visual classification

**Architectural Editorial Modernism** combines:

- Swiss grid discipline
- Quiet Intelligence's calm authority
- Contemporary editorial typography
- Monochrome restraint
- Architectural framing
- Functional teal signals

The system avoids literal newspaper styling, dark technical dashboards, soft lifestyle minimalism, generic SaaS polish, high-energy agency conventions, and Colorado or mountain clichés.

### Primitive colors

The approved existing primitives are preserved:

| Token | Value |
|---|---|
| `brand/slate` | `#1B3A52` |
| `brand/teal` | `#0F6E56` |
| `brand/rust` | `#854F0B` |
| `neutral/off-white` | `#F9F8F7` |
| `neutral/light` | `#BFBDB3` |
| `neutral/mid` | `#6B6A64` |
| `neutral/charcoal` | `#2C2C2A` |
| `accent/teal-100` | `#9FE1CB` |

The web system may add only the primitives required for accessible semantic roles, including pure white, pure black, and status colors. Additions must be documented and must not change the character of the approved palette.

### Color behavior

- Off-white, white, charcoal, and neutral grays carry most of the interface.
- Teal signals focus, active state, priority, diagnostic emphasis, and primary conversion.
- Slate supports inverse surfaces and structural emphasis.
- Rust is a restricted secondary accent and may not compete with teal.
- Color never communicates meaning by itself.
- Large teal or rust decorative fields are prohibited.

### Typography

- **Space Grotesk:** display, headings, navigation, labels, buttons, and utilities
- **EB Garamond:** body, lead, quotes, and editorial reading
- **Jost:** approved logotype only; never a general-purpose UI or heading face

Pin `@fontsource-variable/space-grotesk` and `@fontsource-variable/eb-garamond` so synced examples render reliably. Record their OFL-1.1 licenses and provenance. Jost is not a runtime dependency unless an approved logotype asset specifically requires it.

### Geometry and effects

- Use square or modestly softened corners.
- Default borders are one pixel.
- Use hairline rules and framing before shadows.
- Shadows are rare, low-contrast, and limited to genuine elevation.
- Gradients, glass effects, glow, ornamental texture, and exaggerated rounding are prohibited.

### Iconography

Lucide is the only interface icon system for `0.1.0`. The React package must pin `lucide-react`; `assets/README.md` must state the pinned version and use rules, and `assets/licenses/` must contain the Lucide ISC license text. Custom Ridgeframe identity marks are not part of the icon system.

## 8. Token Architecture

### Layers

Tokens have three layers:

1. **Primitive:** raw reusable values such as colors and spacing units
2. **Semantic:** purpose-driven aliases such as `color.text.primary`
3. **Component:** introduced only when a component requires a stable public customization point

Semantic tokens cover:

- Canvas, surface, raised surface, and inverse surface
- Primary, secondary, muted, and inverse text
- Default and strong borders
- Primary action and action states
- Focus ring and focus offset
- Diagnostic emphasis and subtle emphasis surface
- Success, warning, error, and information states
- Disabled foreground, background, border, and opacity

### Scales

- Spacing uses a four-pixel base and a restrained named scale.
- Responsive breakpoints are mobile-first at `0`, `768`, `1024`, and `1440` pixels.
- Maximum content width is `1280px`.
- Standard content width is `1120px`.
- Editorial reading width is `720px`.
- Radius values remain between zero and eight pixels.
- Motion defaults to short, functional transitions and respects `prefers-reduced-motion`.

### Generation flow

`tokens/source/*.json` feeds `scripts/generate-tokens.mjs`, which writes:

- `tokens/generated/tokens.css`
- `tokens/generated/tokens.ts`
- The generated token snapshot between guarded markers in `DESIGN_SYSTEM.md`

Generated files carry a header that identifies their source and forbids direct editing.

## 9. React Primitives

The public component count is exactly eight.

### Button

Provides primary, secondary, and tertiary visual variants; required interaction states; optional leading or trailing Lucide icon; loading state; and native button semantics. Loading preserves the button's dimensions and exposes status without relying on animation.

### Link

Provides inline, standalone, navigation, and inverse presentation while preserving native anchor behavior. External links receive an accessible indication when they open a new context.

### FormControl

Provides a discriminated TypeScript API for text, email, telephone, textarea, select, checkbox, and radio controls. It owns labels, descriptions, required state, validation messages, and ID relationships. A contact form is a composition of FormControl and Button, not another primitive.

### Card

Provides structural surface, border, spacing, and optional interactive behavior. Service, principle, proof, testimonial, and founder presentations compose content inside Card rather than creating new primitive components.

### Disclosure

Provides accessible open and closed disclosure behavior for FAQs and progressive content. It owns button semantics, `aria-expanded`, region association, keyboard behavior, and reduced-motion handling.

### Header

Provides desktop and mobile navigation structures, current-page state, a skip-link target, accessible menu behavior, and a restrained conversion action. It does not include multi-level application navigation.

### Footer

Provides brand context, utility navigation, and contact access without introducing an alternate navigation system. Legal links appear only when a valid destination exists.

### SectionShell

Provides page-width containment, vertical rhythm, framing, background tone, and heading relationships. It is the primary composition boundary for website sections.

## 10. State and Accessibility Coverage

The component gallery demonstrates every meaningful state:

- Default
- Hover
- Focus-visible
- Active or pressed when applicable
- Current or selected when applicable
- Open and closed when applicable
- Loading when applicable
- Disabled when applicable
- Error and success for form controls
- Light, inverse, and subtle surfaces where supported
- Mobile, tablet, desktop, and wide layouts
- Reduced-motion behavior

The system targets WCAG 2.2 AA. Requirements include:

- Text contrast of at least `4.5:1` for normal text
- Contrast of at least `3:1` for large text and meaningful graphical controls
- Visible keyboard focus
- Logical heading hierarchy
- Native semantics before ARIA
- Touch targets sized for reliable use
- Programmatic form labels, descriptions, and errors
- No meaning conveyed by color alone
- Responsive reflow without horizontal page scrolling
- Clear alternative text guidance
- Motion that can be reduced or removed

Automated accessibility checks supplement but do not replace manual keyboard, screen-reader, and visual review.

## 11. Layout Foundations

The layout system is mobile-first and uses:

- A flexible one-column mobile foundation
- An eight-column tablet grid
- A twelve-column desktop and wide-desktop grid
- Responsive page margins and gutters
- Standard, reading-width, framed, and full-bleed container patterns
- Section spacing that scales by breakpoint

Desktop compositions may use restrained asymmetry. Mobile compositions intentionally reorder and stack content rather than shrinking desktop layouts.

## 12. Reference Compositions

### Component gallery

The gallery is the kitchen sink. It exists for state coverage, accessibility review, token QA, and Claude Design ingestion evidence. It introduces no new primitives.

### Canonical homepage

The homepage is the only page composition in `0.1.0`. It demonstrates:

1. Homepage hero
2. Problem framing
3. Core promise
4. Services overview
5. Diagnosis-first process
6. Why Ridgeframe
7. Founder introduction
8. Credibility or evidence
9. Primary conversion section
10. Contact composition
11. Footer

The page uses realistic Ridgeframe content and the core promise “Clarity on what to fix and fund.” It must work at mobile, tablet, desktop, and wide-desktop widths.

## 13. Content Direction

The voice is clear, experienced, calm, candid, practical, evidence-based, approachable, and decisive without overpromising.

Avoid:

- Agency jargon
- Startup language
- Empty superlatives
- Vague transformation claims
- Unsupported revenue promises
- Clever headlines without meaning
- Excessive references to innovation
- Long paragraphs inside interface components
- Lorem ipsum

## 14. Automation and Failure Behavior

### Scripts

- `generate-tokens.mjs`: validate source tokens and generate derived outputs
- `check-generated.mjs`: fail when generated outputs or the inline snapshot are stale
- `check-contrast.mjs`: calculate contrast for every declared semantic foreground/background pair
- `check-links.mjs`: validate local Markdown and built-example links
- `check-structure.mjs`: validate required files, eight public component exports, asset provenance, and prohibited speculative directories

Each script must:

- Exit nonzero on failure
- Identify the exact file, token, color pair, component, or link that failed
- Explain the expected condition
- Avoid silently rewriting files during check mode

### Continuous integration

`.github/workflows/validate.yml` runs on pull requests and pushes to protected branches. It installs locked dependencies and runs generation checks, unit tests, accessibility checks, the production build, structural validation, contrast validation, and link validation.

CI failure blocks release readiness. The workflow does not publish packages or deploy a website.

## 15. Test Strategy

Implementation follows test-driven development for behavior and validation scripts.

Tests cover:

- Public component rendering and properties
- Native semantics and keyboard behavior
- ARIA state and relationships
- Loading, disabled, open, error, and success states
- Generated token shape and naming
- Detection of stale generated files
- Contrast pass and fail cases
- Link-validation pass and fail cases
- Required repository structure
- Successful production builds for the gallery and homepage

The component gallery and homepage receive manual visual review at all four responsive ranges before release.

## 16. Release and Synchronization

The initial release is `v0.1.0`. Every release requires:

1. A clean verification run
2. An updated `CHANGELOG.md`
3. A reviewed pull request
4. A semantic version tag
5. A Claude Design `/design-sync` run from the tagged checkout
6. A generated landing-page smoke test in Claude Design

Consumers such as Claude Design, a future Figma generator, a deck builder, or a demo-site builder pin semantic tags instead of tracking `main`.

## 17. Known Source Gaps

The repository does not currently contain approved logo binaries, icon geometry, a Figma design file, font binaries, or the historical Figma plugin source described in earlier Ridgeframe materials. Version `0.1.0` must not reconstruct those assets from prose.

The current approved design inputs available for implementation are:

- Ridgeframe's diagnosis-first positioning and website scope
- Architectural Editorial Modernism direction
- Approved typography roles
- Approved primitive color values
- Figma's authority over logo geometry and optical identity decisions
- Lucide as the interface icon system
- WCAG 2.2 AA as the accessibility target

## 18. Acceptance Criteria

The repository is ready for `v0.1.0` when:

- `DESIGN_SYSTEM.md` is complete on its own
- `/design-sync` can discover tokens and all eight React primitives from the package root
- JSON, CSS, TypeScript, and documented token values are synchronized
- The component gallery demonstrates all required states
- The canonical homepage demonstrates the complete website visual language
- No speculative page templates or duplicate homepage artifacts exist
- No unapproved logo geometry or custom interface icons are introduced
- All automated verification passes
- Manual responsive, keyboard, accessibility, and visual review is recorded
- `CHANGELOG.md` documents the release
- The release is tagged `v0.1.0`
