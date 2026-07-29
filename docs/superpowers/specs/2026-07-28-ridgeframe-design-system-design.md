# Ridgeframe Design System Repository Design

**Status:** Revised architecture; ratification pending written-spec review
**Date:** 2026-07-28
**Repository:** `erikftaylor/ridgeframe-design-system`
**Initial implementation branch:** `feat/design-system-foundation`

## 1. Purpose

Build a small, production-quality design-system repository that Claude Design can ingest through Claude Code's `/design-sync` command. Version `0.1.0` provides tokens, four React primitives, evidence compositions, and a component gallery. Version `0.2.0` completes the eight-primitive contract and adds the canonical Ridgeframe homepage. The repository must remain understandable to designers and developers and provide a stable code foundation for a future native Figma library.

The system expresses Ridgeframe Strategies as a senior, diagnosis-first product experience and growth consultancy for established, owner-led businesses. Its core promise is:

> Clarity on what to fix and fund.

The implementation must feel architectural, editorial, precise, calm, modern, and enduring. It must communicate senior consultancy rather than marketing agency, web shop, startup, or Colorado lifestyle brand.

## 2. Primary Consumers and Retrieval Paths

### Claude Design

The preferred ingestion path is:

1. Install Claude Code version `2.1.181` or later.
2. Clone or open the repository locally.
3. Start Claude Code from the package root.
4. Run `/design-sync`.
5. Publish the resulting Ridgeframe system within Claude Design.

`/design-sync` accepts GitHub repositories, local codebases, design files, and raw token uploads; React is not required for ingestion. This repository includes React because real components let Claude Design build with the implemented component contract and validate generated output against it before presentation. `DESIGN_SYSTEM.md` is the single machine-facing rules document and must remain sufficient to explain the system without requiring Claude to stitch together multiple policy files.

If only one file can be supplied, provide `DESIGN_SYSTEM.md`. That fallback communicates the complete rules and token snapshot but cannot substitute for component-level validation. Repository sync is therefore the authoritative Claude Design ingestion path.

`/design-sync` does not watch the repository. Re-run it after every token or component change intended for Claude Design and once more from each tagged release checkout.

### Humans

`README.md` is the human entry point. It states Claude Code `2.1.181` or later as a prerequisite and explains setup, development, validation, release tagging, the non-watching `/design-sync` behavior, Claude Design synchronization, and the future Figma workflow.

### Figma

A native Figma library is not part of version `0.1.0`. After the code system is approved, the repository can seed a Figma Design file through Figma's `figma-generate-library` workflow. An exported `.fig` file is an output of that later workflow; the repository does not carry an empty stand-in.

## 3. Scope

Version `0.1.0` ships first and includes:

- Primitive and semantic design tokens
- Generated CSS variables and typed TypeScript token exports
- Token generation through `generate-tokens.mjs`
- `check-contrast.mjs` and `check-generated.mjs`
- Four React primitives: Button, Link, Card, and SectionShell
- Findings Card, Annotated Screen, and Priority Map reference compositions
- Layout foundations
- A state-complete component gallery
- Brand, content, accessibility, and usage rules
- GitHub Actions verification
- Release and Claude Design synchronization instructions

Version `0.2.0` defers:

- FormControl, Disclosure, Header, and Footer
- The canonical eleven-section responsive homepage
- `check-links.mjs` and `check-structure.mjs`
- Homepage-specific responsive and accessibility validation

The end-state public component contract remains exactly eight primitives. The split prevents website concerns from blocking the first usable design-system release when no production website exists.

Version `0.1.0` excludes:

- A complete marketing website
- Services, About, Contact, case-study, article, or legal page templates
- Full audit-report UI, dashboard UI, complete scorecards, full prioritization matrices, or application UI; the three required homepage evidence excerpts remain in scope as reference compositions
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

1. **`00 – Strategic Foundation`:** positioning, brand character, creative direction, and the rule that teal is a signal rather than ambient brand color.
2. **`01 – Website Specification`:** site structure, page content, evidence requirements, and component inventory.
3. **Approved Figma identity components:** logo geometry, wordmark geometry, lockups, and optical spacing.
4. **`tokens/source/*.json`:** canonical token values.
5. **`DESIGN_SYSTEM.md`:** canonical usage rules, semantic intent, content guidance, prohibitions, and an automatically generated token snapshot.
6. **React component source:** canonical component behavior, properties, DOM semantics, and accessibility implementation.
7. **Generated files:** derived representations only; never edit them directly.
8. **Examples:** reference compositions; they demonstrate the system but do not introduce new primitives or tokens.
9. **Exported SVG, PNG, PDF, or `.fig` files:** distribution artifacts, not replacement masters.

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
│   │   └── 0001-use-react-for-claude-design-validation.md
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
│   ├── Card/
│   ├── SectionShell/
│   └── index.ts
├── layouts/
│   ├── reset.css
│   ├── typography.css
│   ├── containers.css
│   ├── grid.css
│   └── index.css
├── examples/
│   └── component-gallery/
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
│   └── tests/
└── .github/
    └── workflows/
        └── validate.yml
```

The three Markdown files at the root have non-overlapping responsibilities:

- `README.md`: human orientation and operations
- `DESIGN_SYSTEM.md`: complete machine-facing system definition
- `CHANGELOG.md`: release history

Supporting documents under `docs/decisions/` record significant design or technical decisions without duplicating operating rules. ADR `0001` records the reversal from a framework-neutral static system to React and its maintenance cost.

`docs/superpowers/specs/` contains approved design and implementation-planning artifacts used to audit how the repository was created. These files are process records, not machine-facing design-system instructions; `DESIGN_SYSTEM.md` remains Claude's only policy entry point.

The architecture above is the `0.1.0` tree. Version `0.2.0` adds the four deferred component directories, `examples/homepage/`, `check-links.mjs`, and `check-structure.mjs`.

## 6. Technology and Package Contract

The package uses React, TypeScript, Vite, Vitest, Testing Library, and an axe-core integration. React is a peer dependency so consumers can use their own compatible React installation. The examples install React as a development dependency.

React is a deliberate reversal of the original framework-neutral HTML/CSS/JSON proposal. `/design-sync` does not require React; the reason for accepting the dependency is that Claude Design can use and validate against the implemented components rather than infer behavior from static examples. ADR `docs/decisions/0001-use-react-for-claude-design-validation.md` records the rationale, alternatives, and maintenance cost.

Components use semantic HTML, CSS custom properties, and co-located component CSS. They do not depend on Tailwind, CSS-in-JS, a proprietary styling runtime, or a third-party component framework.

The package exports:

- Every public React primitive and its TypeScript properties
- Generated TypeScript tokens
- Generated CSS tokens
- Layout foundation CSS

This peer-dependency and export contract is forward-looking. Publishing to npm remains outside `0.1.0`; implementation must not spend time on registry automation, package discoverability, multi-format bundles, or packaging polish beyond what local `/design-sync`, tests, and examples require.

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

### Verified color pairs

Only the following foreground/background pairs are admitted initially:

| Pair | Ratio |
|---|---:|
| Charcoal on off-white | 13.19 |
| Charcoal on white | 13.99 |
| Slate on off-white | 11.16 |
| Off-white on slate | 11.16 |
| White on slate | 11.84 |
| Teal on off-white | 5.85 |
| Teal on white | 6.20 |
| Off-white on teal | 5.85 |
| White on teal | 6.20 |
| Rust on off-white | 6.34 |
| White on rust | 6.73 |
| Mid on off-white | 5.11 |
| Mid on white | 5.43 |
| Charcoal on teal-100 | 9.40 |
| Slate on teal-100 | 7.95 |
| Teal-100 on slate | 7.95 |

The following known failures are prohibited:

| Pair | Ratio | Failure |
|---|---:|---|
| Teal on slate | 1.91 | Focus and non-text contrast |
| Light on off-white | 1.78 | Control-border contrast |
| Teal on teal-100 | 4.17 | Normal-text contrast |
| Teal-100 on off-white | 1.40 | Non-text edge contrast |

Any pair not listed in the admitted table is prohibited until `check-contrast.mjs` computes it, verifies the applicable WCAG threshold, and adds it to the admitted set. New primitives require the same computation and review before ratification; the specification does not assign an unverified hex value.

### Color behavior

- Off-white, white, charcoal, and neutral grays carry most of the interface.
- Charcoal or slate carries ordinary interaction, including primary buttons, hover, active, and focus-visible treatment on light surfaces. A filled primary button uses slate with white or off-white text; a light primary treatment uses charcoal text on white or off-white. No other button pair is allowed until admitted by contrast verification.
- Teal carries findings and priority only: diagnostic emphasis, severity signaling, framework elements, and decision markers.
- Teal is permitted as a light-surface focus color only for diagnostic or priority controls that already carry teal. General controls do not use teal focus.
- The inverse-context focus token uses `accent/teal-100` as a filled focus halo on slate surfaces; teal on slate is prohibited.
- Direct use of `accent/teal-100` is fill-only. It is never a border, divider, or standalone edge. The inverse focus halo is its sole focus-specific semantic use and must be rendered as a filled underlay rather than a teal-100 border.
- `neutral/light` is a decorative divider only. It is non-load-bearing and cannot define control boundaries or required separation.
- The control-border token uses `neutral/mid` on off-white or white surfaces.
- Text on a teal-100 subtle-emphasis surface is charcoal or slate only. Teal text is prohibited.
- Slate supports inverse surfaces, structural emphasis, and ordinary interaction.
- Rust is restricted to admitted severity or evidence roles and may not compete with teal.
- No viewport may contain more than three persistent teal signal elements. A transient focus halo on an already signal-coded diagnostic control does not increase the budget.
- Color never communicates meaning by itself.
- Large teal or rust decorative fields are prohibited.

These rules resolve the earlier over-assignment of teal to every interactive state. `00 – Strategic Foundation` is the higher authority: teal is a signal, not ambient brand color.

### Typography

- **Space Grotesk:** display, headings, navigation, labels, buttons, and utilities
- **EB Garamond:** body, lead, quotes, and editorial reading
- **Jost:** approved logotype only; never a general-purpose UI or heading face

EB Garamond body copy uses a minimum base size of `18px` because its low x-height reduces screen legibility at smaller sizes.

The system names three typefaces because two perform distinct runtime roles while Jost is identity geometry only. Pin `@fontsource-variable/space-grotesk` and `@fontsource-variable/eb-garamond` so synced examples render reliably and record their OFL-1.1 licenses and provenance. Jost is not shipped in the font bundle and is not a runtime dependency.

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
- Decorative divider, control border, and strong structural border
- Primary action and action states
- Light-surface focus, diagnostic light-surface focus, inverse-surface focus halo, and focus offset
- Diagnostic emphasis and subtle emphasis surface
- Critical, High, and Medium severity
- Success, warning, error, and information states
- Disabled foreground, background, border, and opacity

Required aliases include:

- `color.border.control` → `neutral/mid`
- `color.divider.decorative` → `neutral/light`
- `color.focus.light` → `brand/slate`
- `color.focus.signal` → `brand/teal`, limited to diagnostic and priority controls on light surfaces
- `color.focus.inverse` → `accent/teal-100`, rendered as a filled halo on slate
- `color.severity.critical.foreground` → `brand/rust` on off-white
- `color.severity.high.foreground` → `brand/teal` on off-white
- `color.severity.medium.foreground` → `brand/slate` on off-white

Severity tokens map to the firm's Critical, High, and Medium audit tiers. Every severity indicator includes its text label; color is supplementary and never the sole encoding.

**Decision status:** Approved by Erik on 2026-07-28.

### Scales

- Spacing uses a four-pixel base and a restrained named scale.
- Responsive breakpoints are mobile-first at `0`, `768`, `1024`, and `1440` pixels.
- Maximum content width is `1280px`.
- Standard content width is `1120px`.
- Editorial reading width is `720px`.
- Radius values remain between zero and eight pixels.
- `size.target.minimum` is `24px` by `24px` in CSS pixels.
- Motion defaults to short, functional transitions and respects `prefers-reduced-motion`.

### Generation flow

`tokens/source/*.json` feeds `scripts/generate-tokens.mjs`, which writes:

- `tokens/generated/tokens.css`
- `tokens/generated/tokens.ts`
- The generated token snapshot between guarded markers in `DESIGN_SYSTEM.md`

Generated files carry a header that identifies their source and forbids direct editing.

## 9. React Primitives

The end-state public component count is exactly eight. Version `0.1.0` ships Button, Link, Card, and SectionShell. Version `0.2.0` adds FormControl, Disclosure, Header, and Footer.

### Version 0.1.0

#### Button

Provides primary, secondary, and tertiary visual variants; required interaction states; optional leading or trailing Lucide icon; loading state; and native button semantics. Primary presentation uses only white or off-white text on slate, or charcoal text on white or off-white, rather than teal. Loading preserves the button's dimensions and exposes status without relying on animation.

#### Link

Provides inline, standalone, navigation, and inverse presentation while preserving native anchor behavior. External links receive an accessible indication when they open a new context.

#### Card

Provides structural surface, control-grade border options, spacing, and optional interactive behavior. Findings Card, Annotated Screen, and Priority Map compose evidence content inside Card rather than creating new primitive components.

#### SectionShell

Provides page-width containment, vertical rhythm, framing, background tone, and heading relationships. It is the primary composition boundary for website sections.

### Version 0.2.0

#### FormControl

Provides a discriminated TypeScript API for text, email, telephone, textarea, select, checkbox, and radio controls. It owns labels, descriptions, required state, validation messages, and ID relationships. A contact form is a composition of FormControl and Button, not another primitive.

#### Disclosure

Provides accessible open and closed disclosure behavior for FAQs and progressive content. It owns button semantics, `aria-expanded`, region association, keyboard behavior, and reduced-motion handling.

#### Header

Provides sticky desktop and mobile navigation structures, current-page state, a skip-link target, accessible menu behavior, and a restrained conversion action. It does not include multi-level application navigation and must not obscure keyboard-focused content.

#### Footer

Provides brand context, utility navigation, and contact access without introducing an alternate navigation system. Legal links appear only when a valid destination exists.

## 10. State and Accessibility Coverage

The `0.1.0` component gallery demonstrates every meaningful state for Button, Link, Card, SectionShell, and the three evidence compositions. Version `0.2.0` extends the same coverage to the four deferred primitives.

- Default
- Hover
- Focus-visible
- Active or pressed when applicable
- Current or selected when applicable
- Open and closed when applicable in `0.2.0`
- Loading when applicable
- Disabled when applicable
- Error and success for form controls in `0.2.0`
- Light, inverse, and subtle surfaces where supported
- Mobile, tablet, desktop, and wide layouts
- Reduced-motion behavior

The system targets WCAG 2.2 AA. Requirements include:

- Text contrast of at least `4.5:1` for normal text
- Contrast of at least `3:1` for large text and meaningful graphical controls
- Visible keyboard focus using the context-appropriate verified focus token
- Logical heading hierarchy
- Native semantics before ARIA
- Touch targets no smaller than `size.target.minimum`, defined as `24px` by `24px` in CSS pixels
- Programmatic form labels, descriptions, and errors
- No meaning conveyed by color alone
- Responsive reflow without horizontal page scrolling
- Clear alternative text guidance
- Motion that can be reduced or removed

The following WCAG 2.2 criteria are explicit release requirements:

- **2.4.11 Focus Not Obscured (Minimum):** keyboard-focused content cannot be fully hidden by sticky or fixed content.
- **2.4.12 Focus Not Obscured (Enhanced):** adopted as a project enhancement even though it exceeds the AA baseline. The `0.2.0` sticky Header must not cover any focused target during sequential keyboard navigation.
- **2.5.7 Dragging Movements:** any dragging interaction must have a non-dragging alternative. Version `0.1.0` introduces no drag-only behavior.
- **2.5.8 Target Size (Minimum):** interactive targets use the `24px` by `24px` minimum-size token, subject to the criterion's spacing and inline exceptions.
- **3.2.6 Consistent Help:** repeated help or contact mechanisms appear in a consistent relative order.
- **3.3.7 Redundant Entry:** information previously supplied in the same process is auto-populated or selectable unless re-entry is essential.
- **3.3.8 Accessible Authentication:** not applicable to `0.1.0` or `0.2.0` because authentication is explicitly outside repository and website scope. Reassess before adding authentication.

Automated accessibility checks supplement but do not replace manual keyboard, screen-reader, and visual review.

The firm's audit framework and current client-facing materials cite WCAG 2.1 AA while this repository targets WCAG 2.2 AA. Erik and Chris must reconcile that wording across all materials before this system is used in client work.

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

Version `0.1.0` includes three evidence compositions built from Card, typography, layout, and severity tokens:

- **Findings Card:** presents Problem → Evidence → Impact → Recommendation and a required Critical, High, or Medium text label.
- **Annotated Screen:** presents one interface image with numbered annotations, text equivalents, and an explanatory caption.
- **Priority Map:** presents a bounded excerpt of severity/effort scoring with text labels and a linear mobile fallback. It is not a full audit matrix or dashboard.

Severity is never communicated by color alone. Every composition must preserve its label and reading order when color, positioning, or the two-dimensional Priority Map layout is unavailable.

### Canonical homepage

The homepage is deferred to `0.2.0` and is the only page composition in that release. It demonstrates:

1. Homepage hero
2. Problem framing
3. Core promise
4. Services overview
5. Diagnosis-first process
6. Why Ridgeframe
7. Founder introduction
8. Evidence
9. Primary conversion section
10. Contact composition
11. Footer

Evidence is the single most important homepage section. It must contain one Annotated Screen, one Findings Card, and one Priority Map excerpt using the `0.1.0` compositions.

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

Version `0.1.0` includes:

- `generate-tokens.mjs`: validate source tokens and generate derived outputs
- `check-generated.mjs`: fail when generated outputs or the inline snapshot are stale
- `check-contrast.mjs`: calculate contrast for every declared semantic foreground/background pair, admit only verified pairs, and reject the four known failures

Version `0.2.0` adds:

- `check-links.mjs`: validate local Markdown and built-example links
- `check-structure.mjs`: validate required files, all eight public component exports, asset provenance, and prohibited speculative directories

Each script must:

- Exit nonzero on failure
- Identify the exact file, token, color pair, component, or link that failed
- Explain the expected condition
- Avoid silently rewriting files during check mode

### Continuous integration

`.github/workflows/validate.yml` runs on pull requests and pushes to protected branches. In `0.1.0`, it installs locked dependencies and runs generation checks, unit tests, accessibility checks, the component-gallery production build, and contrast validation. Version `0.2.0` adds structural validation, link validation, and the homepage production build.

CI failure blocks release readiness. The workflow does not publish packages or deploy a website.

## 15. Test Strategy

Implementation follows test-driven development for behavior and validation scripts.

Tests cover:

- Public component rendering and properties for the four components shipped in each release
- Native semantics and keyboard behavior
- ARIA state and relationships
- Loading and disabled states in `0.1.0`; open, error, and success states in `0.2.0`
- Generated token shape and naming
- Detection of stale generated files
- Contrast pass and fail cases
- Link-validation pass and fail cases in `0.2.0`
- Required repository structure and eight-export enforcement in `0.2.0`
- A successful component-gallery production build in `0.1.0`
- A successful homepage production build in `0.2.0`

The component gallery receives manual visual review at all four responsive ranges before `0.1.0`. The homepage receives the same review before `0.2.0`.

## 16. Release and Synchronization

The initial release is `v0.1.0`; the deferred website primitives and homepage ship as `v0.2.0`. Every release requires:

1. A clean verification run
2. An updated `CHANGELOG.md`
3. A reviewed pull request
4. A semantic version tag
5. A Claude Design `/design-sync` run from the tagged checkout
6. A generated landing-page smoke test in Claude Design

Because `/design-sync` does not watch the repository, any token or component change requires an explicit sync before Claude Design is treated as current. The tagged-release sync is required even when the branch was synced during development.

The `v0.1.0` changelog entry records the completed rename from “Convergence Strategies Group” to “Ridgeframe Strategies.” The two canonical upstream documents now use Ridgeframe Strategies. The former name remains historical context only and is not a second brand or component namespace.

Consumers such as Claude Design, a future Figma generator, a deck builder, or a demo-site builder pin semantic tags instead of tracking `main`.

## 17. Known Source Gaps

The repository does not currently contain approved logo binaries, icon geometry, a Figma design file, font binaries, or the historical Figma plugin source described in earlier Ridgeframe materials. Version `0.1.0` must not reconstruct those assets from prose.

The current approved design inputs available for implementation are:

- `00 – Strategic Foundation`, including its higher-authority teal rules
- `01 – Website Specification`, including its mandatory Evidence section
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
- The README states Claude Code `2.1.181` or later and explains that `/design-sync` must be rerun after changes
- `/design-sync` can discover tokens and Button, Link, Card, and SectionShell from the package root
- JSON, CSS, TypeScript, and documented token values are synchronized
- `check-contrast.mjs` admits the verified pairs, rejects the four known failures, and rejects unverified pairs
- The component gallery demonstrates all required states for the four shipped primitives
- Findings Card, Annotated Screen, and Priority Map appear in the gallery with required severity text labels
- The canonical homepage and the four website primitives do not ship in `0.1.0`
- No speculative page templates or duplicate homepage artifacts exist
- No unapproved logo geometry or custom interface icons are introduced
- `generate-tokens.mjs`, `check-generated.mjs`, `check-contrast.mjs`, tests, the gallery build, and CI pass
- Manual responsive, keyboard, accessibility, and visual review of the gallery is recorded
- `CHANGELOG.md` documents the release and the Convergence-to-Ridgeframe name resolution
- The release is tagged `v0.1.0`
- `/design-sync` is rerun from the tagged checkout and a Claude Design landing-page smoke test is recorded

The repository is ready for `v0.2.0` when:

- FormControl, Disclosure, Header, and Footer complete the eight-primitive contract
- The canonical eleven-section homepage ships and treats Evidence as its most important section
- The homepage includes one Findings Card, one Annotated Screen, and one Priority Map excerpt
- The sticky Header passes focus-not-obscured keyboard review
- `check-links.mjs`, `check-structure.mjs`, and the homepage build pass in CI
- Manual responsive, keyboard, accessibility, and visual review of the homepage is recorded
- The release is tagged and synchronized through `/design-sync`

## Revision Change Log

| Section | Change | Revision satisfied |
|---|---|---:|
| §§7, 8, 14, 18 | Added admitted and prohibited color pairs, contextual focus tokens, mid control border, decorative-only light divider, teal-100 restrictions, subtle-surface text rules, and contrast admission checks | 1 |
| §§4, 7, 8, 9 | Restored the Strategic Foundation as higher authority, moved ordinary interaction to charcoal/slate, limited teal to findings and priority, and imposed a three-signal viewport budget | 2 |
| §§3, 8, 9, 12, 18 | Added severity tokens and the Findings Card, Annotated Screen, and Priority Map compositions without increasing the primitive count; narrowed the audit-UI exclusion | 3 |
| §§8, 9, 10, 18 | Added WCAG 2.2 focus-obscuration, target-size, dragging, consistent-help, redundant-entry, and authentication requirements, including sticky Header handling | 4 |
| §§5, 6 and ADR-0001 | Recorded the framework-neutral starting point, the non-requirement of React for ingestion, the validation rationale, and the maintenance cost | 5 |
| §§2, 16, 17, 18 | Added the Claude Code version floor, non-watching sync behavior, release resynchronization, and Convergence-to-Ridgeframe name resolution | 6 |
| §§1, 3, 5, 9, 12, 14, 15, 16, 18 | Split delivery into four-primitives-plus-evidence `0.1.0` and website-oriented `0.2.0`; adjusted architecture, automation, tests, and acceptance criteria | 7 |
| §§5, 6, 7 | Defined `docs/superpowers/specs/`, set the EB Garamond minimum to 18px, justified the three typeface names, excluded Jost from the font bundle, and marked packaging as forward-looking | Additional |

## Open Questions

1. **Accessibility standard reconciliation — Erik and Chris:** Decide whether the audit framework and client-facing materials will be updated from WCAG 2.1 AA to WCAG 2.2 AA. Complete the cross-material update before client use.
2. **Upstream document locations — Erik:** Record the canonical paths or URLs and approved versions of `00 – Strategic Foundation` and `01 – Website Specification` before implementation begins.
3. **Release split ratification — Erik and Chris:** Approve `0.1.0` as tokens, four primitives, three evidence compositions, gallery, and CI, with the remaining website concerns deferred to `0.2.0`.
