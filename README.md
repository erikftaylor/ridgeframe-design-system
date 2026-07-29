# Ridgeframe Design System

Ridgeframe Strategies' code-first design system for Claude Design and future product work. The `v0.1.0` release is currently **Unreleased**: it contains generated design tokens, four React primitives, three evidence compositions, layout foundations, and the component gallery.

[`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) is the one machine-facing system definition. It contains the complete brand, token, component, accessibility, content, authority, and scope rules. This README is for people operating the repository.

## Prerequisites and setup

- Claude Code `2.1.181` or later for Claude Design synchronization
- A current Node.js and npm installation

Install the locked dependencies and generate the derived token files:

```sh
npm ci
npm run generate:tokens
```

Never edit files in `tokens/generated/` or the generated token snapshot in `DESIGN_SYSTEM.md` directly. Change `tokens/source/*.json`, then regenerate.

## Work locally

Run the component gallery:

```sh
npm run dev
```

Run the tests or build a production copy of the gallery:

```sh
npm run test:run
npm run build:gallery
```

Before opening or updating a pull request, run the complete local validation:

```sh
npm run validate
```

This checks generated files, admitted contrast pairs, unit and accessibility tests, and the production gallery build.

## Release and Claude Design sync

Keep the changelog entry marked **Unreleased** until verification and pull-request review are complete. After both are complete:

1. Change `## v0.1.0 — Unreleased` to `## v0.1.0 — YYYY-MM-DD`, using the actual release date.
2. Commit the dated changelog before creating the tag so the tag points at the final release record.
3. Create and push the approved semantic version tag:

```sh
git tag -a v0.1.0 -m "Ridgeframe Design System v0.1.0"
git push origin v0.1.0
```

Check out the tagged release, open the package root in Claude Code, and run `/design-sync`. Publish the resulting Ridgeframe system in Claude Design and perform a landing-page smoke test.

`/design-sync` is explicit: it does not watch this repository. Re-run it after every token or component change intended for Claude Design and again from every tagged checkout, even if a development branch was synchronized earlier. Consumers should pin semantic version tags rather than track `main`.

## Future Figma library

No `.fig` file or Figma plugin ships in `v0.1.0`. After the code system and approved identity assets are ready, this repository can seed a native Figma library through Figma's `figma-generate-library` workflow. The future Figma file will govern logo and wordmark geometry, lockups, and optical spacing; exported `.fig`, SVG, PNG, and PDF files remain distribution artifacts rather than replacement masters.

See [`assets/README.md`](assets/README.md) for current asset provenance and license rules.
