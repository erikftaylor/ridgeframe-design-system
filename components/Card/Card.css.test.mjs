import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesheet = readFileSync(resolve(process.cwd(), 'components/Card/Card.css'), 'utf8');

describe('Card styles', () => {
  it('uses token-backed color values rather than raw color literals or transparent', () => {
    expect(stylesheet).not.toMatch(/\btransparent\b/i);
    expect(stylesheet).not.toMatch(/#[\da-f]{3,8}\b|\b(?:rgb|hsl)a?\(/i);
  });

  it('keeps structural, control, and interactive border presentation token-backed', () => {
    expect(stylesheet).toContain(
      '.rf-card--border-structural {\n  border: var(--rf-border-width-hairline) solid var(--rf-color-semantic-border-decorative);\n}',
    );
    expect(stylesheet).toContain(
      '.rf-card--border-control {\n  border: var(--rf-border-width-hairline) solid var(--rf-color-semantic-border-control);\n}',
    );
    expect(stylesheet).toContain(
      '.rf-card--interactive:hover {\n  border-color: var(--rf-color-semantic-border-strong);\n}',
    );
    expect(stylesheet).toContain(
      '.rf-card--border-none.rf-card--interactive:hover {\n  outline: var(--rf-border-width-hairline) solid currentColor;\n  outline-offset: var(--rf-space-1);\n}',
    );
  });
});
