# Ridgeframe Design System `v0.1.0` Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task by task. Use `superpowers:test-driven-development` for every behavior or validation feature and `superpowers:verification-before-completion` before any completion claim.

**Goal:** Build and verify the first Claude Design–ready Ridgeframe design-system release: machine-readable tokens, four React primitives, three evidence compositions, a state-complete component gallery, concise documentation, and CI.

**Architecture:** Keep `DESIGN_SYSTEM.md` as the only machine-facing policy entry point. Generate CSS, TypeScript, and the documented token snapshot from JSON sources. Keep Button, Link, Card, and SectionShell as the only public `v0.1.0` primitives. Implement Findings Card, Annotated Screen, and Priority Map inside the gallery as compositions rather than exported primitives. Do not create a homepage, website templates, or unapproved identity assets.

**Tech stack:** React, TypeScript, Vite, Vitest, Testing Library, axe-core, CSS custom properties, Lucide React, Fontsource variable fonts, Node.js scripts, and GitHub Actions.

**Approved design:** `docs/superpowers/specs/2026-07-28-ridgeframe-design-system-design.md`

---

## Task 1: Bootstrap the package and test harness

**Files:**

- Create: `.gitignore`
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `test/harness.test.tsx`
- Create: `test/accessibility.ts`
- Create: `components/index.ts`

**Step 1: Write the failing harness test**

Create `test/harness.test.tsx` with a minimal React render assertion. Run it before dependencies and configuration exist so the failure proves the test harness is not yet wired.

```ts
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('test harness', () => {
  it('renders React in jsdom', () => {
    render(<button type="button">Ready</button>);
    expect(screen.getByRole('button', { name: 'Ready' })).toBeInTheDocument();
  });
});
```

**Step 2: Install the minimum toolchain**

Use npm to initialize the package as private ESM version `0.1.0`. Install pinned current compatible releases of React, React DOM, TypeScript, Vite, `@vitejs/plugin-react`, Vitest, jsdom, Testing Library, `@testing-library/jest-dom`, `@testing-library/user-event`, axe-core, Lucide React, Space Grotesk variable Fontsource, and EB Garamond variable Fontsource. Keep React and React DOM as peer dependencies and development dependencies; do not add a UI framework, Tailwind, CSS-in-JS, Storybook, or publishing automation.

Required scripts:

```json
{
  "generate:tokens": "node scripts/generate-tokens.mjs",
  "check:generated": "node scripts/check-generated.mjs",
  "check:contrast": "node scripts/check-contrast.mjs",
  "test": "vitest",
  "test:run": "vitest run",
  "dev": "vite --config examples/component-gallery/vite.config.ts",
  "build:gallery": "vite build --config examples/component-gallery/vite.config.ts",
  "validate": "npm run check:generated && npm run check:contrast && npm run test:run && npm run build:gallery"
}
```

**Step 3: Configure TypeScript, Vite, Vitest, and the accessibility helper**

Set strict TypeScript, JSX `react-jsx`, DOM libraries, JSON module support, and bundler module resolution. Configure jsdom, `vitest.setup.ts`, and the React Vite plugin. Add `test/accessibility.ts` as the shared axe-core assertion helper used by component and composition tests. Add `.gitignore` entries for `node_modules`, `dist`, coverage, local environment files, and OS metadata. Leave `components/index.ts` empty until primitives are implemented.

**Step 4: Run the configured harness and confirm it passes**

Run:

```bash
npm run test:run -- test/harness.test.tsx
```

Expected after configuration: pass.

**Step 5: Commit the harness**

```bash
git add .gitignore package.json package-lock.json tsconfig.json vite.config.ts vitest.setup.ts test components/index.ts
git commit -m "build: bootstrap design system package"
```

## Task 2: Define source tokens and token-contract tests

**Files:**

- Create: `tokens/source/colors.json`
- Create: `tokens/source/typography.json`
- Create: `tokens/source/spacing.json`
- Create: `tokens/source/layout.json`
- Create: `tokens/source/effects.json`
- Create: `scripts/tests/token-sources.test.ts`

**Step 1: Write failing token-source tests**

Test that:

- The eight approved primitive colors match the exact approved hex values.
- Semantic color aliases reference primitives rather than duplicating hex values.
- Severity aliases map Critical → rust, High → teal, and Medium → slate.
- Space Grotesk owns display/utility roles; EB Garamond owns editorial roles; Jost is identity-only and has no font dependency.
- Spacing follows a four-pixel base.
- Breakpoints are `0`, `768`, `1024`, and `1440` pixels.
- Container widths are `720`, `1120`, and `1280` pixels.
- Radius values stay between zero and eight pixels.
- `size.target.minimum` is `24px`.

Run the test and confirm it fails because the JSON files are absent.

**Step 2: Add the primitive and semantic color model**

Use the eight approved values only:

```text
brand/slate        #1B3A52
brand/teal         #0F6E56
brand/rust         #854F0B
neutral/off-white  #F9F8F7
neutral/light      #BFBDB3
neutral/mid        #6B6A64
neutral/charcoal   #2C2C2A
accent/teal-100    #9FE1CB
```

Add pure white only where the admitted contrast table requires it. Do not add unverified status-color primitives in `v0.1.0`; represent only the semantic roles that can be backed by approved primitives and admitted pairs.

**Step 3: Add typography, spacing, layout, and effects sources**

Express values in machine-readable JSON with stable primitive and semantic groups. Include motion reduction, z-index, border, radius, opacity, control target, container, grid, and breakpoint tokens. Avoid component-specific aliases until a component requires a stable public customization point.

**Step 4: Run the token-source tests**

```bash
npm run test:run -- scripts/tests/token-sources.test.ts
```

Expected: pass.

**Step 5: Commit source tokens**

```bash
git add tokens/source scripts/tests/token-sources.test.ts
git commit -m "feat: define Ridgeframe source tokens"
```

## Task 3: Generate CSS, TypeScript, and the documentation snapshot

**Files:**

- Create: `DESIGN_SYSTEM.md`
- Create: `scripts/generate-tokens.mjs`
- Create: `scripts/check-generated.mjs`
- Create: `scripts/tests/generate-tokens.test.ts`
- Create: `tokens/generated/tokens.css`
- Create: `tokens/generated/tokens.ts`

**Step 1: Write failing generation tests**

Test that the generator:

- Reads every file in `tokens/source/`.
- Produces deterministic CSS custom properties and typed TypeScript exports.
- Adds a generated-file warning header.
- Updates only content between `<!-- GENERATED:TOKENS:START -->` and `<!-- GENERATED:TOKENS:END -->` in `DESIGN_SYSTEM.md`.
- Fails with a useful message for missing aliases, cyclic references, invalid units, duplicate flattened names, or a missing documentation marker.
- Makes `check-generated.mjs` exit nonzero when any derived output is stale without rewriting files.

Run the focused test and verify failure because the scripts do not exist.

**Step 2: Create the self-contained machine-facing document shell**

Write `DESIGN_SYSTEM.md` with these concise sections:

1. Brand and audience
2. Authority boundaries, including current Ridgeframe Google Docs and historical Convergence references
3. Architectural Editorial Modernism direction
4. Token rules and generated snapshot markers
5. Typography and icon rules
6. Layout and responsive behavior
7. Four public primitives
8. Three evidence compositions
9. Accessibility and admitted contrast pairs
10. Content guidance
11. Prohibitions and website gate
12. Claude Design `/design-sync` use

It must be complete enough to paste into Claude Design by itself. Do not add a root `CLAUDE.md`, `SOURCE_OF_TRUTH.md`, or setup-only Markdown file.

**Step 3: Implement deterministic generation**

Flatten JSON paths with stable dot-separated token names, resolve aliases, sort output, preserve numeric units, and render the documented table from the same in-memory token graph. Export token types with `as const`.

**Step 4: Run generation and tests**

```bash
npm run generate:tokens
npm run test:run -- scripts/tests/generate-tokens.test.ts
npm run check:generated
```

Expected: all pass; a second generation produces no diff.

**Step 5: Commit the generation pipeline**

```bash
git add DESIGN_SYSTEM.md scripts/generate-tokens.mjs scripts/check-generated.mjs scripts/tests/generate-tokens.test.ts tokens/generated
git commit -m "feat: generate design tokens and documentation"
```

## Task 4: Enforce the admitted contrast set

**Files:**

- Create: `scripts/check-contrast.mjs`
- Create: `scripts/tests/check-contrast.test.ts`
- Modify: `tokens/source/colors.json`
- Modify: `DESIGN_SYSTEM.md`

**Step 1: Write failing contrast tests**

Test all admitted pairs and the four known failures. Assert that an undeclared pair fails closed. Assert normal text requires `4.5:1`, large text and meaningful non-text controls require `3:1`, and failures name the tokens, ratio, and threshold.

**Step 2: Implement the contrast calculator**

Use the WCAG relative-luminance formula directly rather than importing a black-box palette utility. Read declared semantic foreground/background pairs from `colors.json`; do not scan arbitrary CSS combinations.

**Step 3: Verify exact expected ratios within rounding tolerance**

```bash
npm run test:run -- scripts/tests/check-contrast.test.ts
npm run check:contrast
```

Expected: admitted pairs pass, known failures are positively tested as failures, and no unverified pair is admitted.

**Step 4: Commit contrast enforcement**

```bash
git add scripts/check-contrast.mjs scripts/tests/check-contrast.test.ts tokens/source/colors.json DESIGN_SYSTEM.md tokens/generated
git commit -m "test: enforce approved contrast pairs"
```

## Task 5: Build layout foundations

**Files:**

- Create: `layouts/reset.css`
- Create: `layouts/typography.css`
- Create: `layouts/containers.css`
- Create: `layouts/grid.css`
- Create: `layouts/index.css`
- Create: `layouts/layouts.test.ts`

**Step 1: Write failing static-contract tests**

Test that layout CSS imports generated tokens, defines mobile-first one-column behavior, adds eight columns at tablet and twelve columns at desktop, exposes standard/reading/max containers, uses token-backed spacing, sets EB Garamond body text to at least `18px`, and includes reduced-motion handling.

**Step 2: Implement the CSS foundations**

Import the two Fontsource variable families from the gallery entry rather than embedding remote font URLs. Make the CSS usable by package consumers without global decorative assumptions. Provide utility classes only for the approved container and grid contracts.

**Step 3: Run focused tests**

```bash
npm run test:run -- layouts/layouts.test.ts
```

Expected: pass.

**Step 4: Commit layout foundations**

```bash
git add layouts
git commit -m "feat: add responsive layout foundations"
```

## Task 6: Implement Button with TDD

**Files:**

- Create: `components/Button/Button.tsx`
- Create: `components/Button/Button.css`
- Create: `components/Button/Button.test.tsx`
- Create: `components/Button/index.ts`
- Modify: `components/index.ts`

**Step 1: Write failing behavior tests**

Cover native button props, primary/secondary/tertiary variants, disabled state, loading semantics, preserved accessible name, leading/trailing Lucide icon slots, dimension-preserving loader, and default `type="button"`.

**Step 2: Implement the smallest accessible component**

Use a discriminated `iconPosition` API, `aria-busy` for loading, and a visually hidden loading message. Use only admitted slate/off-white/white/charcoal pairs. General Button focus uses slate, never teal.

**Step 3: Run component and accessibility tests**

Render every variant through the shared axe helper. Verify keyboard focus and disabled behavior.

```bash
npm run test:run -- components/Button/Button.test.tsx
```

**Step 4: Commit Button**

```bash
git add components/Button components/index.ts
git commit -m "feat: add Button primitive"
```

## Task 7: Implement Link with TDD

**Files:**

- Create: `components/Link/Link.tsx`
- Create: `components/Link/Link.css`
- Create: `components/Link/Link.test.tsx`
- Create: `components/Link/index.ts`
- Modify: `components/index.ts`

**Step 1: Write failing behavior tests**

Cover inline, standalone, navigation, and inverse variants; current-page state; native anchor props; visible focus; external-context indication; and accessible external-link text.

**Step 2: Implement native anchor behavior**

Do not intercept navigation. Require an explicit `newContext` flag before adding `target="_blank"`, `rel="noreferrer"`, a Lucide external-link icon, and hidden explanatory text.

**Step 3: Run focused tests and axe**

```bash
npm run test:run -- components/Link/Link.test.tsx
```

**Step 4: Commit Link**

```bash
git add components/Link components/index.ts
git commit -m "feat: add Link primitive"
```

## Task 8: Implement Card with TDD

**Files:**

- Create: `components/Card/Card.tsx`
- Create: `components/Card/Card.css`
- Create: `components/Card/Card.test.tsx`
- Create: `components/Card/index.ts`
- Modify: `components/index.ts`

**Step 1: Write failing behavior tests**

Cover semantic element selection, surface variants, padding variants, structural versus control-grade borders, optional interactive presentation without fake button behavior, and forwarded HTML attributes.

**Step 2: Implement Card as a structural primitive**

Default to a semantic `article` only when content is independently meaningful; otherwise default to `div`. Do not add click handlers, role overrides, or keyboard behavior merely because the card looks interactive. Keep radii within the approved range and avoid shadows except the defined raised surface.

**Step 3: Run focused tests and axe**

```bash
npm run test:run -- components/Card/Card.test.tsx
```

**Step 4: Commit Card**

```bash
git add components/Card components/index.ts
git commit -m "feat: add Card primitive"
```

## Task 9: Implement SectionShell with TDD

**Files:**

- Create: `components/SectionShell/SectionShell.tsx`
- Create: `components/SectionShell/SectionShell.css`
- Create: `components/SectionShell/SectionShell.test.tsx`
- Create: `components/SectionShell/index.ts`
- Modify: `components/index.ts`
- Create: `components/index.test.ts`

**Step 1: Write failing behavior tests**

Cover semantic sectioning, optional accessible label/heading association, standard/reading/max/full-bleed widths, framed versus unframed presentation, surface tones, and responsive spacing.

**Step 2: Implement the composition boundary**

Use `section` by default, accept an `as` override for valid landmarks, and expose a stable inner-container element. Do not create page-specific section variants.

**Step 3: Add and run the public export-contract test**

Create `components/index.test.ts` and assert that the package root exports exactly `Button`, `Link`, `Card`, and `SectionShell`:

```ts
import { describe, expect, it } from 'vitest';
import * as components from './index';

describe('v0.1 public component contract', () => {
  it('exports exactly four primitives', () => {
    expect(Object.keys(components).sort()).toEqual(
      ['Button', 'Card', 'Link', 'SectionShell'].sort(),
    );
  });
});
```

Run:

```bash
npm run test:run -- components/SectionShell/SectionShell.test.tsx components/index.test.ts
```

Expected: the four-export contract passes.

**Step 4: Commit SectionShell**

```bash
git add components/SectionShell components/index.ts components/index.test.ts
git commit -m "feat: add SectionShell primitive"
```

## Task 10: Build the gallery and evidence compositions

**Files:**

- Create: `examples/component-gallery/index.html`
- Create: `examples/component-gallery/vite.config.ts`
- Create: `examples/component-gallery/src/main.tsx`
- Create: `examples/component-gallery/src/Gallery.tsx`
- Create: `examples/component-gallery/src/gallery.css`
- Create: `examples/component-gallery/src/compositions/FindingsCard.tsx`
- Create: `examples/component-gallery/src/compositions/AnnotatedScreen.tsx`
- Create: `examples/component-gallery/src/compositions/PriorityMap.tsx`
- Create: `examples/component-gallery/src/compositions/compositions.test.tsx`

**Step 1: Write failing composition tests**

Assert:

- Findings Card preserves Problem → Evidence → Impact → Recommendation and always renders Critical/High/Medium text.
- Annotated Screen pairs every numbered visual annotation with ordered text and a figure caption.
- Priority Map exposes a linear reading-order fallback and does not communicate severity or effort by position/color alone.
- The compositions are not exported from `components/index.ts`.
- Axe reports no violations for representative states.

**Step 2: Implement the compositions from primitives**

Compose Card, SectionShell, typography, and layout CSS. Use a neutral CSS-rendered interface sample for Annotated Screen rather than inventing a Ridgeframe logo or client screenshot. Enforce the three-persistent-teal-signal budget in the gallery examples.

**Step 3: Build the kitchen-sink gallery**

Show every meaningful state for the four primitives and three compositions on light, subtle, and inverse surfaces. Include mobile/tablet/desktop/wide review anchors, reduced-motion guidance, keyboard instructions, and admitted/prohibited color-pair examples. Do not add homepage sections.

**Step 4: Run tests and production build**

```bash
npm run test:run -- examples/component-gallery/src/compositions/compositions.test.tsx
npm run build:gallery
```

**Step 5: Commit the gallery**

```bash
git add examples/component-gallery
git commit -m "feat: add component gallery and evidence patterns"
```

## Task 11: Add asset provenance and licenses

**Files:**

- Create: `assets/README.md`
- Create: `assets/logos/manifest.json`
- Create: `assets/icons/manifest.json`
- Create: `assets/licenses/lucide-ISC.txt`
- Create: `assets/licenses/space-grotesk-OFL-1.1.txt`
- Create: `assets/licenses/eb-garamond-OFL-1.1.txt`
- Create: `assets/assets.test.ts`

**Step 1: Write failing provenance tests**

Require manifests to identify approval status, source, license, pinned package version where applicable, and prohibited synthesis. Assert the logo manifest contains no fake binary path and the icon manifest names Lucide as the only interface icon set.

**Step 2: Add authoritative license texts and manifests**

Copy license texts from the installed packages or their official repositories and record exact package versions from `package-lock.json`. State that Jost is logotype-only and is not shipped.

**Step 3: Run tests**

```bash
npm run test:run -- assets/assets.test.ts
```

**Step 4: Commit asset governance**

```bash
git add assets
git commit -m "docs: add asset provenance and licenses"
```

## Task 12: Complete human documentation and release history

**Files:**

- Modify: `README.md`
- Modify: `DESIGN_SYSTEM.md`
- Create: `CHANGELOG.md`
- Create: `docs/documentation.test.ts`

**Step 1: Write failing documentation tests**

Assert that:

- Only `README.md`, `DESIGN_SYSTEM.md`, and `CHANGELOG.md` are root Markdown files.
- README states Claude Code `2.1.181` or later, setup, validation, version tags, and non-watching `/design-sync` behavior.
- `DESIGN_SYSTEM.md` names the two authoritative Ridgeframe Docs and the historical Convergence boundary.
- `DESIGN_SYSTEM.md` contains all eight approved primitive colors, four public components, three evidence compositions, accessibility rules, and homepage gate.
- CHANGELOG records `v0.1.0`, Ridgeframe as current, and Convergence as historical.

**Step 2: Replace the trial README**

Write concise human instructions for install, generate, test, validate, run gallery, tag release, and run `/design-sync` from the tagged checkout. Explain that sync is explicit rather than continuous. Describe the future Figma-library path without inventing a `.fig` file or plugin.

**Step 3: Finish `DESIGN_SYSTEM.md` and CHANGELOG**

Keep the machine-facing document self-contained and non-repetitive. Do not copy the entire upstream strategy documents into the repo. Record `v0.1.0` as unreleased until final verification and PR review complete.

**Step 4: Run documentation and generated-file tests**

```bash
npm run generate:tokens
npm run test:run -- docs/documentation.test.ts
npm run check:generated
```

**Step 5: Commit documentation**

```bash
git add README.md DESIGN_SYSTEM.md CHANGELOG.md docs/documentation.test.ts tokens/generated
git commit -m "docs: complete design system guidance"
```

## Task 13: Add continuous integration

**Files:**

- Create: `.github/workflows/validate.yml`

**Step 1: Validate the workflow contract locally**

Before creating CI, run the same command CI will use:

```bash
npm ci
npm run validate
```

Expected: pass from the committed lockfile.

**Step 2: Add GitHub Actions validation**

Run on pull requests and pushes to `main`. Use the current supported Node LTS, npm cache, `npm ci`, and `npm run validate`. Grant read-only repository permissions. Do not publish, deploy, tag, or mutate generated files.

**Step 3: Commit CI**

```bash
git add .github
git commit -m "ci: validate design system"
```

## Task 14: Perform responsive and accessibility review

**Files:**

- Create: `docs/reviews/2026-07-28-v0.1.0-gallery-review.md`
- Modify as required by discovered defects: component, composition, layout, or gallery files

**Step 1: Start the gallery and inspect four widths**

Review at representative mobile, tablet, desktop, and wide-desktop widths. Capture findings for overflow, line length, spacing, typography, state visibility, focus treatment, and the three-signal teal budget.

**Step 2: Complete keyboard and reduced-motion review**

Tab through every interactive example. Confirm no focus is obscured, focus contrast is visible, loading/disabled behavior is understandable, and the gallery remains usable with reduced motion.

**Step 3: Record defects before fixes**

Add each observed defect to the review document with viewport, expected behavior, and affected file. For each code defect, add or tighten an automated regression test before changing implementation.

**Step 4: Fix only verified defects and rerun focused tests**

Follow the systematic-debugging workflow if behavior is unexpected. Keep the review document as evidence of manual QA.

**Step 5: Commit the review and fixes**

```bash
git add docs/reviews components layouts examples tokens scripts
git commit -m "test: complete v0.1 gallery review"
```

## Task 15: Final verification, review, and publication handoff

**Files:**

- Modify: `CHANGELOG.md`
- Modify as required by review: any in-scope file

**Step 1: Run the clean verification suite**

```bash
npm ci
npm run generate:tokens
git diff --exit-code
npm run validate
git diff --check
```

Expected: every command passes and generation leaves the worktree unchanged.

**Step 2: Verify repository boundaries**

Confirm:

- Exactly three root Markdown files exist.
- Exactly four public React primitives are exported.
- No homepage, Figma plugin, `.fig`, Storybook, speculative templates, or invented logo exists.
- All interface icons come from Lucide.
- Historical Convergence files are linked only as non-authoritative provenance.
- The branch contains no unrelated user changes.

**Step 3: Request code review**

Use `superpowers:requesting-code-review`. Address actionable findings through `superpowers:receiving-code-review`, with regression tests for behavior changes.

**Step 4: Update the changelog only after verification**

Change `v0.1.0` from Unreleased to the actual release date only if the branch is ready for the user-approved release flow. Do not tag or release before the PR review gate.

**Step 5: Re-run verification after review fixes**

Repeat Step 1 and record the exact passing commands in the PR description.

**Step 6: Publish the branch and open a draft PR**

Use the GitHub publication workflow to push `feat/design-system-foundation` and open a draft PR against `main`. Include scope, authority boundary, accessibility evidence, verification output, `/design-sync` follow-up, and the explicit homepage gate. Do not merge or create a release tag without separate user approval.
