import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesheet = readFileSync(resolve(process.cwd(), 'components/Button/Button.css'), 'utf8');

describe('Button loading styles', () => {
  it('hides the label with color rather than visibility', () => {
    expect(stylesheet).toContain('.rf-button__label--loading {\n  color: transparent;\n}');
    expect(stylesheet).not.toMatch(
      /\.rf-button__label--loading[^{]*\{[^}]*visibility\s*:\s*hidden/,
    );
  });
});
