# Changelog

All notable changes to the Ridgeframe Design System are recorded here. Releases use semantic version tags; the entry remains Unreleased until its verification run and pull-request review are complete.

## v0.1.0 — Unreleased

### Added

- Primitive and semantic source tokens with generated CSS, TypeScript, breakpoint media, and the guarded token snapshot in `DESIGN_SYSTEM.md`.
- Button, Link, Card, and SectionShell as the four public React primitives for this release.
- Findings Card, Annotated Screen, and Priority Map as reference compositions in the component gallery.
- Mobile-first layout foundations, admitted-pair contrast enforcement, component and accessibility tests, and asset provenance records.
- Human setup, validation, release-tagging, and explicit Claude Design `/design-sync` guidance.

### Changed

- Withdrew the "Architectural Editorial Modernism" visual-direction mandate and its aesthetic prohibitions; no visual direction is ratified while design-system exploration continues. The current palette, type stack, and effect tokens are documented as a provisional working set, not a brand commitment.
- Relaxed direction-pinning tests to structural checks — exact palette hex values, the severity-to-color mapping, font-role face assignments, the radius ceiling, and the documentation palette list are no longer hard-coded, so candidate directions can be explored without test collisions. The token pipeline, generated-file checks, admitted-pair contrast enforcement, component scope, and accessibility requirements are unchanged and remain binding.

### Authority

- Ridgeframe Strategies is the only current brand and component namespace.
- The current Ridgeframe Strategies Strategic Foundation and Website Status documents are authoritative for brand and website readiness respectively.
- The legacy Convergence Strategic Foundation and Website Specification remain historical references only. Their names are preserved for provenance and do not define current positioning, copy, website structure, or component scope.

### Deferred

- FormControl, Disclosure, Header, and Footer remain planned for `v0.2.0`.
- Homepage work remains gated on an approved current Ridgeframe website specification, sitemap, and content direction.
