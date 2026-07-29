import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type DimensionToken = {
  $type: 'dimension';
  $value: string;
};

const repositoryFile = (path: string): string => readFileSync(resolve(path), 'utf8');

const ruleFor = (css: string, selector: string): string => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, 'm').exec(css);

  if (!match) {
    throw new Error(`Missing CSS rule: ${selector}`);
  }

  return match[1];
};

describe('WCAG 2.2 focus appearance', () => {
  it('uses a token-backed indicator at least two pixels thick for Button and Link on every approved surface', () => {
    const effects = JSON.parse(repositoryFile('tokens/source/effects.json')) as {
      border: { width: { focus?: DimensionToken } };
    };
    const focusWidth = effects.border.width.focus;

    expect(focusWidth).toBeDefined();
    expect(focusWidth?.$type).toBe('dimension');
    expect(Number.parseFloat(focusWidth?.$value ?? '0')).toBeGreaterThanOrEqual(2);

    const focusDeclaration =
      'outline: var(--rf-border-width-focus) solid var(--rf-color-semantic-focus-light);';
    const inverseFocusDeclaration =
      'outline: var(--rf-border-width-focus) solid var(--rf-color-semantic-focus-inverse);';
    const buttonCss = repositoryFile('components/Button/Button.css');
    const linkCss = repositoryFile('components/Link/Link.css');
    const galleryCss = repositoryFile('examples/component-gallery/src/gallery.css');

    expect(ruleFor(buttonCss, '.rf-button')).toContain(
      '--rf-button-focus-color: var(--rf-color-semantic-focus-light);',
    );
    expect(ruleFor(buttonCss, '.rf-button--surface-inverse')).toContain(
      '--rf-button-focus-color: var(--rf-color-semantic-focus-inverse);',
    );
    expect(ruleFor(buttonCss, '.rf-button:focus-visible')).toContain(
      'outline: var(--rf-border-width-focus) solid var(--rf-button-focus-color);',
    );
    expect(ruleFor(linkCss, '.rf-link:focus-visible')).toContain(focusDeclaration);
    expect(ruleFor(linkCss, '.rf-link--inverse:focus-visible')).toContain(
      inverseFocusDeclaration,
    );
    expect(ruleFor(galleryCss, '.gallery-force-button-focus.rf-button')).toContain(
      'outline: var(--rf-border-width-focus) solid var(--rf-button-focus-color);',
    );
    expect(ruleFor(galleryCss, '.gallery-force-link-focus')).toContain(focusDeclaration);
    expect(ruleFor(galleryCss, '.gallery-force-button-focus.rf-button')).toContain(
      'box-shadow: var(--rf-button-focus-shadow);',
    );
  });
});
