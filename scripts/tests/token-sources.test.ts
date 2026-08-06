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

const leaves = (group: TokenGroup): Token[] =>
  Object.values(group).flatMap((candidate) =>
    '$value' in candidate ? [candidate] : leaves(candidate),
  );

const leafEntries = (group: TokenGroup, prefix = ''): Array<[string, Token]> =>
  Object.entries(group).flatMap(([name, candidate]) => {
    const path = prefix ? `${prefix}.${name}` : name;
    return '$value' in candidate ? [[path, candidate]] : leafEntries(candidate, path);
  });

describe('Ridgeframe source tokens', () => {
  it('defines primitive palette values as valid hex colors', () => {
    const colors = source('colors');
    const primitives = leafEntries(colors.color as TokenGroup, 'color')
      .filter(([path]) => path.startsWith('color.primitive.'));

    expect(primitives.length).toBeGreaterThan(0);
    primitives.forEach(([path, { $value }]) => {
      expect(String($value), path).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it('backs semantic color roles with primitive aliases', () => {
    const colors = source('colors');
    const semantic = colors.color as TokenGroup;

    const semanticValues = leaves(semantic.semantic as TokenGroup)
      .map(({ $value }) => $value);

    expect(semanticValues.length).toBeGreaterThan(0);
    expect(semanticValues.every((value) => typeof value === 'string' && /^\{color\.primitive\./.test(value))).toBe(true);
  });

  it('backs audit severity foregrounds with primitive aliases', () => {
    const colors = source('colors');

    ['critical', 'high', 'medium'].forEach((severity) => {
      expect(String(token(colors, `color.semantic.severity.${severity}.foreground`).$value), severity)
        .toMatch(/^\{color\.primitive\./);
    });
  });

  it('does not define unsupported general-purpose status aliases', () => {
    const colors = source('colors');

    expect(colors.color as TokenGroup).not.toHaveProperty('semantic.status');
  });

  it('backs runtime type roles with defined font-family tokens', () => {
    const typography = source('typography');

    ['display', 'utility', 'editorial', 'identity'].forEach((role) => {
      expect(String(token(typography, `font.family.${role}`).$value), role)
        .toMatch(/^\{font\.family\./);
    });
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

  it('keeps radii valid and sets the required target minimum', () => {
    const effects = source('effects');
    const layout = source('layout');
    const radii = Object.values(effects.radius as TokenGroup)
      .filter((candidate): candidate is Token => '$value' in candidate)
      .map(({ $value }) => Number.parseInt(String($value), 10));

    expect(radii.length).toBeGreaterThan(0);
    expect(radii.every((value) => value >= 0)).toBe(true);
    expect(token(layout, 'size.target.minimum').$value).toBe('24px');
  });
});
