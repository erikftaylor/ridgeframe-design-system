import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';

type Token = {
  $type: string;
  $value: string | number;
};

type TokenGroup = Record<string, Token | TokenGroup>;

type GeneratorModule = {
  generateTokens: (options: { rootDir: string; write?: boolean }) => {
    css: string;
    documentation: string;
    media: string;
    typescript: string;
  };
};

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const checkScript = resolve(repositoryRoot, 'scripts/check-generated.mjs');
const fixtures: string[] = [];

const writeJson = (path: string, value: TokenGroup): void => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
};

const writeText = (path: string, value: string): void => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
};

const createFixture = (): string => {
  const rootDir = mkdtempSync(resolve(tmpdir(), 'ridgeframe-token-generator-'));
  fixtures.push(rootDir);
  writeText(
    resolve(rootDir, 'DESIGN_SYSTEM.md'),
    [
      '# Ridgeframe',
      '',
      'Before snapshot.',
      '',
      '<!-- GENERATED:TOKENS:START -->',
      'Outdated snapshot.',
      '<!-- GENERATED:TOKENS:END -->',
      '',
      'After snapshot.',
      '',
    ].join('\n'),
  );
  return rootDir;
};

const writeCompleteSources = (rootDir: string): void => {
  writeJson(resolve(rootDir, 'tokens/source/z-base.json'), {
    color: {
      accent: {
        primary: { $type: 'color', $value: '#123456' },
      },
    },
    space: {
      unit: { $type: 'dimension', $value: '4px' },
    },
  });
  writeJson(resolve(rootDir, 'tokens/source/a-semantic.json'), {
    component: {
      gap: { $type: 'dimension', $value: '{space.unit}' },
    },
  });
};

const loadGenerator = async (): Promise<GeneratorModule> =>
  (await import('../generate-tokens.mjs')) as GeneratorModule;

afterEach(() => {
  fixtures.splice(0).forEach((fixture) => rmSync(fixture, { recursive: true, force: true }));
});

describe('token generation', () => {
  it('reads every source file into sorted, resolved CSS, TypeScript, and documentation artifacts', async () => {
    // Removing source discovery, sorting, alias resolution, or any artifact renderer breaks this contract.
    const rootDir = createFixture();
    writeCompleteSources(rootDir);
    const { generateTokens } = await loadGenerator();

    const first = generateTokens({ rootDir, write: true });
    const mediaPath = resolve(rootDir, 'tokens/generated/media.css');
    expect(existsSync(mediaPath)).toBe(true);
    const firstArtifacts = {
      css: readFileSync(resolve(rootDir, 'tokens/generated/tokens.css'), 'utf8'),
      media: readFileSync(mediaPath, 'utf8'),
      typescript: readFileSync(resolve(rootDir, 'tokens/generated/tokens.ts'), 'utf8'),
      documentation: readFileSync(resolve(rootDir, 'DESIGN_SYSTEM.md'), 'utf8'),
    };
    const second = generateTokens({ rootDir, write: true });
    const secondArtifacts = {
      css: readFileSync(resolve(rootDir, 'tokens/generated/tokens.css'), 'utf8'),
      media: readFileSync(mediaPath, 'utf8'),
      typescript: readFileSync(resolve(rootDir, 'tokens/generated/tokens.ts'), 'utf8'),
      documentation: readFileSync(resolve(rootDir, 'DESIGN_SYSTEM.md'), 'utf8'),
    };

    expect(first.css).toBe([
      '/**',
      ' * This file is generated from tokens/source/*.json.',
      ' * Do not edit directly. Run `npm run generate:tokens`.',
      ' */',
      ':root {',
      '  --rf-color-accent-primary: #123456;',
      '  --rf-component-gap: 4px;',
      '  --rf-space-unit: 4px;',
      '}',
      '',
    ].join('\n'));
    expect(first.typescript).toBe([
      '/**',
      ' * This file is generated from tokens/source/*.json.',
      ' * Do not edit directly. Run `npm run generate:tokens`.',
      ' */',
      'export const tokens = {',
      '  "color.accent.primary": "#123456",',
      '  "component.gap": "4px",',
      '  "space.unit": "4px",',
      '} as const;',
      '',
      'export type Tokens = typeof tokens;',
      'export type TokenName = keyof Tokens;',
      'export type TokenValue = Tokens[TokenName];',
      '',
    ].join('\n'));
    expect(first.documentation).toBe([
      '# Ridgeframe',
      '',
      'Before snapshot.',
      '',
      '<!-- GENERATED:TOKENS:START -->',
      '| Token | Type | Value |',
      '| --- | --- | --- |',
      '| `color.accent.primary` | `color` | `#123456` |',
      '| `component.gap` | `dimension` | `4px` |',
      '| `space.unit` | `dimension` | `4px` |',
      '<!-- GENERATED:TOKENS:END -->',
      '',
      'After snapshot.',
      '',
    ].join('\n'));
    expect(firstArtifacts).toEqual(secondArtifacts);
    expect(second).toEqual(first);
  });

  it('derives named custom media from breakpoint tokens', async () => {
    // Dropping this artifact or hard-coding its thresholds would let responsive CSS drift from token sources.
    const rootDir = createFixture();
    writeCompleteSources(rootDir);
    writeJson(resolve(rootDir, 'tokens/source/layout.json'), {
      breakpoint: {
        tablet: { $type: 'dimension', $value: '768px' },
        desktop: { $type: 'dimension', $value: '1024px' },
      },
    });
    const { generateTokens } = await loadGenerator();

    const artifacts = generateTokens({ rootDir, write: true });

    expect(artifacts.media).toBe([
      '/**',
      ' * This file is generated from tokens/source/*.json.',
      ' * Do not edit directly. Run `npm run generate:tokens`.',
      ' */',
      '@custom-media --rf-breakpoint-desktop (min-width: 1024px);',
      '@custom-media --rf-breakpoint-tablet (min-width: 768px);',
      '',
    ].join('\n'));
    const mediaPath = resolve(rootDir, 'tokens/generated/media.css');
    expect(existsSync(mediaPath)).toBe(true);
    expect(readFileSync(mediaPath, 'utf8')).toBe(artifacts.media);
  });

  it.each([
    {
      name: 'a missing alias',
      source: {
        component: {
          gap: { $type: 'dimension', $value: '{space.missing}' },
        },
      },
      message: 'Missing token alias: space.missing (referenced by component.gap)',
    },
    {
      name: 'a cyclic alias',
      source: {
        loop: {
          first: { $type: 'dimension', $value: '{loop.second}' },
          second: { $type: 'dimension', $value: '{loop.first}' },
        },
      },
      message: 'Cyclic token alias: loop.first -> loop.second -> loop.first',
    },
    {
      name: 'an invalid dimension unit',
      source: {
        size: {
          invalid: { $type: 'dimension', $value: '10remish' },
        },
      },
      message: 'Invalid dimension value for size.invalid: "10remish"',
    },
  ])('rejects $name', async ({ source, message }) => {
    const rootDir = createFixture();
    writeJson(resolve(rootDir, 'tokens/source/invalid.json'), source);
    const { generateTokens } = await loadGenerator();

    expect(() => generateTokens({ rootDir })).toThrow(message);
  });

  it('rejects duplicate flattened token names across source files', async () => {
    // Removing duplicate detection could silently choose a source file based on filesystem order.
    const rootDir = createFixture();
    writeJson(resolve(rootDir, 'tokens/source/a.json'), {
      duplicate: { token: { $type: 'number', $value: 1 } },
    });
    writeJson(resolve(rootDir, 'tokens/source/b.json'), {
      duplicate: { token: { $type: 'number', $value: 2 } },
    });
    const { generateTokens } = await loadGenerator();

    expect(() => generateTokens({ rootDir })).toThrow(
      'Duplicate token name: duplicate.token (a.json, b.json)',
    );
  });

  it('rejects a document without both generated token markers', async () => {
    const rootDir = createFixture();
    writeCompleteSources(rootDir);
    writeText(resolve(rootDir, 'DESIGN_SYSTEM.md'), '# Ridgeframe\n');
    const { generateTokens } = await loadGenerator();

    expect(() => generateTokens({ rootDir })).toThrow(
      'DESIGN_SYSTEM.md is missing token snapshot marker: <!-- GENERATED:TOKENS:START -->',
    );
  });

  it('reports stale derived output without rewriting it in check mode', async () => {
    // Replacing comparison-only check mode with generation would overwrite the stale sentinel.
    const rootDir = createFixture();
    writeCompleteSources(rootDir);
    const { generateTokens } = await loadGenerator();
    generateTokens({ rootDir, write: true });
    writeText(resolve(rootDir, 'tokens/generated/tokens.css'), 'stale css\n');

    const result = spawnSync(process.execPath, [checkScript, '--root', rootDir], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toContain(
      'Generated files are stale: tokens/generated/tokens.css',
    );
    expect(readFileSync(resolve(rootDir, 'tokens/generated/tokens.css'), 'utf8')).toBe('stale css\n');
  });
});
