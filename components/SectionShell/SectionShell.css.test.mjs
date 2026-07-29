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

  it('keeps the full-bleed container connected to the approved gutter token', () => {
    expect(stylesheet).toContain(
      'inline-size: calc(100% + (var(--rf-space-semantic-page-gutter) * 2));',
    );
    expect(stylesheet).toContain(
      'margin-inline: calc(var(--rf-space-semantic-page-gutter) * -1);',
    );
  });
});
