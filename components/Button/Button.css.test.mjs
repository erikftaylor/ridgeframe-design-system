import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesheet = readFileSync(resolve(process.cwd(), 'components/Button/Button.css'), 'utf8');

const ruleFor = (selector) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, 'm').exec(stylesheet);

  if (!match) {
    throw new Error(`Missing CSS rule: ${selector}`);
  }

  return match[1];
};

describe('Button loading styles', () => {
  it('hides the label with color rather than visibility', () => {
    expect(stylesheet).toContain('.rf-button__label--loading {\n  color: transparent;\n}');
    expect(stylesheet).not.toMatch(
      /\.rf-button__label--loading[^{]*\{[^}]*visibility\s*:\s*hidden/,
    );
  });
});

describe('Button inverse-surface styles', () => {
  it('drives native default, hover, active, and focus-visible states from the inverse contract', () => {
    expect(ruleFor('.rf-button--surface-inverse')).toContain(
      '--rf-button-focus-color: var(--rf-color-semantic-focus-inverse);',
    );
    expect(ruleFor('.rf-button--surface-inverse')).toContain(
      '--rf-button-focus-shadow: 0 0 0 var(--rf-space-1) var(--rf-color-semantic-focus-inverse);',
    );
    expect(ruleFor('.rf-button--surface-inverse.rf-button--primary')).toContain(
      '--rf-button-background: var(--rf-color-primitive-neutral-white);',
    );
    expect(ruleFor('.rf-button--surface-inverse.rf-button--secondary')).toContain(
      '--rf-button-color: var(--rf-color-primitive-neutral-white);',
    );
    expect(ruleFor('.rf-button--surface-inverse.rf-button--tertiary')).toContain(
      '--rf-button-color: var(--rf-color-primitive-neutral-white);',
    );
    expect(ruleFor('.rf-button:hover:not(:disabled)')).toContain(
      'background: var(--rf-button-hover-background);',
    );
    expect(ruleFor('.rf-button:active:not(:disabled)')).toContain(
      'background: var(--rf-button-active-background);',
    );
    expect(ruleFor('.rf-button:focus-visible')).toContain(
      'outline: var(--rf-border-width-focus) solid var(--rf-button-focus-color);',
    );
    expect(ruleFor('.rf-button:focus-visible')).toContain(
      'box-shadow: var(--rf-button-focus-shadow);',
    );
  });
});
