import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const layoutsDirectory = dirname(fileURLToPath(import.meta.url));
const readLayout = (name: string): string => {
  const path = resolve(layoutsDirectory, name);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
};

describe('layout foundations', () => {
  it('makes the generated token contract available to every layout consumer', () => {
    // Removing the generated-token import would leave all layout token references unresolved.
    expect(readLayout('index.css')).toContain('@import "../tokens/generated/tokens.css";');
  });

  it('starts the grid as one mobile column', () => {
    // Replacing the mobile token or removing the base declaration would make narrow layouts multi-column.
    expect(readLayout('grid.css')).toMatch(
      /\.rf-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(var\(--rf-grid-column-mobile\),\s*minmax\(0,\s*1fr\)\)/,
    );
  });

  it('expands the grid at the approved tablet and desktop breakpoints', () => {
    // Removing either media query or its column token would break the responsive grid contract.
    const grid = readLayout('grid.css');

    expect(grid).toMatch(
      /@media\s*\(min-width:\s*768px\)\s*\{[\s\S]*grid-template-columns:\s*repeat\(var\(--rf-grid-column-tablet\),\s*minmax\(0,\s*1fr\)\)/,
    );
    expect(grid).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*\{[\s\S]*grid-template-columns:\s*repeat\(var\(--rf-grid-column-desktop\),\s*minmax\(0,\s*1fr\)\)/,
    );
  });

  it('provides standard, reading, and maximum container contracts', () => {
    // Dropping a container class or disconnecting it from its width token would make its approved width unavailable.
    const containers = readLayout('containers.css');

    expect(containers).toMatch(/\.rf-container--standard[\s\S]*max-width:\s*var\(--rf-container-standard\)/);
    expect(containers).toMatch(/\.rf-container--reading[\s\S]*max-width:\s*var\(--rf-container-reading\)/);
    expect(containers).toMatch(/\.rf-container--maximum[\s\S]*max-width:\s*var\(--rf-container-maximum\)/);
    expect(containers).toContain('padding-inline: var(--rf-space-semantic-page-gutter);');
  });

  it('uses the approved readable EB Garamond body baseline', () => {
    // Replacing either token would lower body readability or discard the editorial body-face contract.
    const typography = readLayout('typography.css');

    expect(typography).toMatch(/body\s*\{[\s\S]*font-family:\s*var\(--rf-font-family-editorial\)/);
    expect(typography).toMatch(/body\s*\{[\s\S]*font-size:\s*var\(--rf-type-size-body\)/);
  });

  it('honors reduced-motion preferences with the reduced-duration token', () => {
    // Removing this media query can leave animated consumer styles active for motion-sensitive users.
    const reset = readLayout('reset.css');

    expect(reset).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*var\(--rf-motion-duration-reduced\)/);
  });
});
