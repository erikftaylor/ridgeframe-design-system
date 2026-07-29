# Asset provenance and licenses

Every asset requires an explicit source and approval status. A file is not approved merely because it exists in this repository. Do not synthesize, trace, normalize, or reinterpret identity or interface artwork.

## Identity

Approved Figma identity components are the future authority for Ridgeframe logo geometry, wordmark geometry, lockups, and optical spacing. No approved logo binary is shipped in `v0.1.0`; [`logos/manifest.json`](logos/manifest.json) intentionally contains an empty file inventory. Exported SVG, PNG, PDF, and `.fig` files are distribution artifacts, not replacement masters.

Jost is reserved for the approved logotype only. It is not shipped, is not a runtime dependency, and must not be used for headings or interface text.

## Interface icons

Lucide is the only approved interface icon set. The repository pins `lucide-react@1.27.0`; the authoritative installed version is recorded in `package-lock.json`. Use package imports rather than copied, redrawn, or generated icon paths. Current usage and approval rules live in [`icons/manifest.json`](icons/manifest.json). The complete package license is preserved at `assets/licenses/lucide-ISC.txt`; it includes the MIT terms for icons derived from Feather.

## Runtime fonts

- Space Grotesk for display, headings, navigation, labels, buttons, and utility text: `@fontsource-variable/space-grotesk@5.3.0`, licensed under OFL-1.1 at `assets/licenses/space-grotesk-OFL-1.1.txt`.
- EB Garamond for body, lead, quote, and editorial reading text: `@fontsource-variable/eb-garamond@5.3.0`, licensed under OFL-1.1 at `assets/licenses/eb-garamond-OFL-1.1.txt`.

The exact package versions above come from `package-lock.json`. Font binaries are supplied through the pinned Fontsource packages; do not add unmanaged copies to this directory.

## Adding an asset

Before adding or changing an asset:

1. Confirm the governing source and approval status.
2. Record its exact file, package version when applicable, license, and intended use in the relevant manifest.
3. Preserve the complete applicable license text in `assets/licenses/`.
4. Update the manifest inventory and run `npm run test:run -- assets/assets.test.ts`.
