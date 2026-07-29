import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

type Token = {
  $value: string | number;
  $type?: string;
};

type TokenGroup = Record<string, Token | TokenGroup>;

const source = (name: string): TokenGroup =>
  JSON.parse(
    readFileSync(
      resolve(dirname(fileURLToPath(import.meta.url)), `../../tokens/source/${name}.json`),
      'utf8',
    ),
  ) as TokenGroup;

const token = (group: TokenGroup, path: string): Token => {
  const result = path.split('.').reduce<Token | TokenGroup>((current, part) => {
    if ('$value' in current) {
      throw new Error(`${path} is not a token path`);
    }
    return current[part];
  }, group);

  if (!result || !('$value' in result)) {
    throw new Error(`Missing token: ${path}`);
  }

  return result;
};

const alias = (path: string) => `{${path}}`;

const leaves = (group: TokenGroup): Token[] =>
  Object.values(group).flatMap((candidate) =>
    '$value' in candidate ? [candidate] : leaves(candidate),
  );

describe('Ridgeframe source tokens', () => {
  it('defines only the approved primitive palette values', () => {
    const colors = source('colors');

    expect(token(colors, 'color.primitive.brand.slate').$value).toBe('#1B3A52');
    expect(token(colors, 'color.primitive.brand.teal').$value).toBe('#0F6E56');
    expect(token(colors, 'color.primitive.brand.rust').$value).toBe('#854F0B');
    expect(token(colors, 'color.primitive.neutral.off-white').$value).toBe('#F9F8F7');
    expect(token(colors, 'color.primitive.neutral.light').$value).toBe('#BFBDB3');
    expect(token(colors, 'color.primitive.neutral.mid').$value).toBe('#6B6A64');
    expect(token(colors, 'color.primitive.neutral.charcoal').$value).toBe('#2C2C2A');
    expect(token(colors, 'color.primitive.accent.teal-100').$value).toBe('#9FE1CB');
  });

  it('backs semantic color roles with primitive aliases', () => {
    const colors = source('colors');
    const semantic = colors.color as TokenGroup;

    const semanticValues = leaves(semantic.semantic as TokenGroup)
      .map(({ $value }) => $value);

    expect(semanticValues.length).toBeGreaterThan(0);
    expect(semanticValues.every((value) => typeof value === 'string' && /^\{color\.primitive\./.test(value))).toBe(true);
  });

  it('maps audit severities to admitted primitive colors', () => {
    const colors = source('colors');

    expect(token(colors, 'color.semantic.severity.critical.foreground').$value).toBe(alias('color.primitive.brand.rust'));
    expect(token(colors, 'color.semantic.severity.high.foreground').$value).toBe(alias('color.primitive.brand.teal'));
    expect(token(colors, 'color.semantic.severity.medium.foreground').$value).toBe(alias('color.primitive.brand.slate'));
  });

  it('assigns runtime type roles without shipping Jost', () => {
    const typography = source('typography');

    expect(token(typography, 'font.family.display').$value).toBe(alias('font.family.space-grotesk'));
    expect(token(typography, 'font.family.utility').$value).toBe(alias('font.family.space-grotesk'));
    expect(token(typography, 'font.family.editorial').$value).toBe(alias('font.family.eb-garamond'));
    expect(token(typography, 'font.family.identity').$value).toBe(alias('font.family.jost'));
    expect(token(typography, 'font.family.jost').$value).toBe('Jost');
    expect(token(typography, 'font.dependency.space-grotesk').$value).toBe('@fontsource-variable/space-grotesk');
    expect(token(typography, 'font.dependency.eb-garamond').$value).toBe('@fontsource-variable/eb-garamond');
    expect((typography.font as TokenGroup).dependency).not.toHaveProperty('jost');
  });

  it('uses a four-pixel spacing base', () => {
    const spacing = source('spacing');
    const values = Object.values(spacing.space as TokenGroup)
      .filter((candidate): candidate is Token => '$value' in candidate)
      .map(({ $value }) => Number.parseInt(String($value), 10));

    expect(token(spacing, 'space.base').$value).toBe('4px');
    expect(values).toEqual(expect.arrayContaining([0, 4, 8, 12, 16, 24, 32, 48, 64, 96]));
    expect(values.every((value) => value % 4 === 0)).toBe(true);
  });

  it('defines approved responsive widths', () => {
    const layout = source('layout');

    expect(token(layout, 'breakpoint.mobile').$value).toBe('0px');
    expect(token(layout, 'breakpoint.tablet').$value).toBe('768px');
    expect(token(layout, 'breakpoint.desktop').$value).toBe('1024px');
    expect(token(layout, 'breakpoint.wide').$value).toBe('1440px');
    expect(token(layout, 'container.reading').$value).toBe('720px');
    expect(token(layout, 'container.standard').$value).toBe('1120px');
    expect(token(layout, 'container.maximum').$value).toBe('1280px');
  });

  it('keeps radii modest and sets the required target minimum', () => {
    const effects = source('effects');
    const layout = source('layout');
    const radii = Object.values(effects.radius as TokenGroup)
      .filter((candidate): candidate is Token => '$value' in candidate)
      .map(({ $value }) => Number.parseInt(String($value), 10));

    expect(radii.length).toBeGreaterThan(0);
    expect(radii.every((value) => value >= 0 && value <= 8)).toBe(true);
    expect(token(layout, 'size.target.minimum').$value).toBe('24px');
  });
});
