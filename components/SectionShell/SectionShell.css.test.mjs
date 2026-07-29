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

  it('lets a centered full-bleed container reach viewport edges without widening the page', () => {
    expect(stylesheet).toMatch(
      /\.rf-section-shell__container--full-bleed\s*\{[\s\S]*inline-size:\s*auto;[\s\S]*margin-inline:\s*calc\(50% - 50vi\);[\s\S]*padding-inline:\s*0;/,
    );
    expect(stylesheet).not.toContain('inline-size: calc(100% +');
  });
});
