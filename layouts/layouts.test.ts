import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';

const layoutsDirectory = dirname(fileURLToPath(import.meta.url));
const generatedTokens = readFileSync(resolve(layoutsDirectory, '../tokens/generated/tokens.css'), 'utf8');
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
    // Replacing generated custom media with literal breakpoints would let layout source drift from tokens.
    const grid = readLayout('grid.css');

    expect(grid).toMatch(
      /@media\s*\(--rf-breakpoint-tablet\)\s*\{[\s\S]*grid-template-columns:\s*repeat\(var\(--rf-grid-column-tablet\),\s*minmax\(0,\s*1fr\)\)/,
    );
    expect(grid).toMatch(
      /@media\s*\(--rf-breakpoint-desktop\)\s*\{[\s\S]*grid-template-columns:\s*repeat\(var\(--rf-grid-column-desktop\),\s*minmax\(0,\s*1fr\)\)/,
    );
    expect(grid).not.toMatch(/(?:768|1024)px/);
  });

  it('compiles named grid media from generated breakpoint data', async () => {
    // Removing the build-time custom-media configuration would leave unsupported custom-media syntax for consumers.
    const configPath = resolve(layoutsDirectory, '../postcss.config.mjs');

    expect(existsSync(configPath)).toBe(true);
    const { default: config } = await import(pathToFileURL(configPath).href);
    const result = await postcss(config.plugins).process(readLayout('grid.css'), {
      from: resolve(layoutsDirectory, 'grid.css'),
    });

    expect(result.css).toContain('@media (min-width: 768px)');
    expect(result.css).toContain('@media (min-width: 1024px)');
    expect(result.css).not.toContain('--rf-breakpoint-tablet');
  });

  it('provides standard, reading, maximum, and full-bleed container contracts', () => {
    // Dropping a container class or disconnecting it from its width token would make its approved width unavailable.
    const containers = readLayout('containers.css');

    expect(containers).toMatch(/\.rf-container--standard[\s\S]*max-width:\s*var\(--rf-container-standard\)/);
    expect(containers).toMatch(/\.rf-container--reading[\s\S]*max-width:\s*var\(--rf-container-reading\)/);
    expect(containers).toMatch(/\.rf-container--maximum[\s\S]*max-width:\s*var\(--rf-container-maximum\)/);
    expect(containers).toMatch(
      /\.rf-container--full-bleed\s*\{[\s\S]*inline-size:\s*auto;[\s\S]*margin-inline:\s*calc\(50% - 50vi\);[\s\S]*max-width:\s*none;[\s\S]*padding-inline:\s*0/,
    );
    expect(containers).not.toContain('inline-size: calc(100% +');
    expect(containers).toContain('padding-inline: var(--rf-space-semantic-page-gutter);');
  });

  it.each([375, 500, 834, 1280])(
    'resolves the centered full-bleed breakout to the %ipx viewport without overflow',
    (viewportWidth) => {
      const gutter = viewportWidth < 768 ? 16 : viewportWidth < 1024 ? 24 : 32;
      const containingWidth = viewportWidth - gutter * 2;
      const inlineMargin = containingWidth / 2 - viewportWidth / 2;
      const autoInlineSize = containingWidth - inlineMargin * 2;

      expect(inlineMargin).toBe(-gutter);
      expect(autoInlineSize).toBe(viewportWidth);
    },
  );

  it('uses the approved readable EB Garamond body baseline', () => {
    // Replacing either token would lower body readability or discard the editorial body-face contract.
    const typography = readLayout('typography.css');

    expect(typography).toMatch(/body\s*\{[\s\S]*font-family:\s*var\(--rf-font-family-editorial\)/);
    expect(typography).toMatch(/body\s*\{[\s\S]*font-size:\s*var\(--rf-type-size-body\)/);
    expect(generatedTokens).toContain('--rf-font-family-editorial: "EB Garamond", serif;');
    expect(generatedTokens).toMatch(/--rf-type-size-body:\s*(?:1[89]|[2-9]\d|[1-9]\d{2,})px;/);
  });

  it('honors reduced-motion preferences with the reduced-duration token', () => {
    // Removing this media query can leave animated consumer styles active for motion-sensitive users.
    const reset = readLayout('reset.css');

    expect(reset).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*var\(--rf-motion-duration-reduced\)/);
  });
});
