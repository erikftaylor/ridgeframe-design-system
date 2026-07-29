import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesheet = readFileSync(resolve(process.cwd(), 'components/SectionShell/SectionShell.css'), 'utf8');

describe('SectionShell styles', () => {
  it('scales section spacing with the generated responsive tokens', () => {
    expect(stylesheet).toMatch(
      /\.rf-section-shell\s*\{[\s\S]*padding-block:\s*var\(--rf-space-semantic-section\)/,
    );
    expect(stylesheet).toMatch(
      /@media\s*\(--rf-breakpoint-desktop\)\s*\{[\s\S]*\.rf-section-shell\s*\{[\s\S]*padding-block:\s*var\(--rf-space-semantic-section-wide\)/,
    );
  });

  it('keeps full-bleed scrollbar-safe at a viewport-wide SectionShell boundary', () => {
    const rules = [
      ...stylesheet.matchAll(/\.rf-section-shell__container--full-bleed\s*\{([^}]*)\}/g),
    ];
    const rule = rules.at(-1)?.[1] ?? '';

    expect(rule).toContain('inline-size: 100%;');
    expect(rule).toContain('margin-inline: 0;');
    expect(rule).toContain('max-width: none;');
    expect(rule).toContain('padding-inline: 0;');
    expect(rule).not.toMatch(/(?:vw|vi|cqi|calc\(|-\s*var\()/);
  });
});
