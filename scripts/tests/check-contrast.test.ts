import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  checkContrast,
  loadContrastCatalog,
  validateContrastPair,
} from '../check-contrast.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const checkScript = resolve(repositoryRoot, 'scripts/check-contrast.mjs');

describe('approved contrast pairs', () => {
  it('accepts every explicitly declared semantic contrast pair', () => {
    // Removing contrast validation or admitting arbitrary CSS combinations must fail this command.
    const result = spawnSync(process.execPath, [checkScript], {
      cwd: repositoryRoot,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(`${result.stdout}${result.stderr}`).toContain('Approved semantic contrast pairs pass.');
  });

  it.each([
    ['color.semantic.text.primary', 'color.semantic.canvas.default', 'normal-text', 13.19161595],
    ['color.semantic.text.primary', 'color.semantic.surface.default', 'normal-text', 13.99252959],
    ['color.semantic.text.secondary', 'color.semantic.canvas.default', 'normal-text', 11.16219773],
    ['color.semantic.canvas.default', 'color.semantic.surface.inverse', 'large-text', 11.16219773],
    ['color.semantic.action.primary-foreground', 'color.semantic.action.primary-background', 'normal-text', 11.83989761],
    ['color.semantic.diagnostic.emphasis', 'color.semantic.canvas.default', 'normal-text', 5.84863576],
    ['color.semantic.diagnostic.emphasis', 'color.semantic.surface.default', 'normal-text', 6.20372889],
    ['color.semantic.canvas.default', 'color.semantic.diagnostic.emphasis', 'normal-text', 5.84863576],
    ['color.semantic.action.primary-foreground', 'color.semantic.diagnostic.emphasis', 'normal-text', 6.20372889],
    ['color.semantic.severity.critical.foreground', 'color.semantic.canvas.default', 'normal-text', 6.34442242],
    ['color.semantic.text.inverse', 'color.semantic.severity.critical.foreground', 'normal-text', 6.72961667],
    ['color.semantic.text.muted', 'color.semantic.canvas.default', 'normal-text', 5.11471037],
    ['color.semantic.text.muted', 'color.semantic.surface.default', 'normal-text', 5.42524407],
    ['color.semantic.text.primary', 'color.semantic.surface.subtle-emphasis', 'normal-text', 9.39940213],
    ['color.semantic.text.secondary', 'color.semantic.surface.subtle-emphasis', 'normal-text', 7.95338385],
    ['color.semantic.focus.inverse', 'color.semantic.focus.light', 'non-text-control', 7.95338385],
  ])('calculates the admitted %s on %s ratio', (foreground, background, usage, expectedRatio) => {
    // Breaking WCAG luminance math, alias resolution, or the declared pair registry breaks this check.
    const catalog = loadContrastCatalog({ rootDir: repositoryRoot });
    const result = validateContrastPair(catalog, { foreground, background, usage });

    expect(result.threshold).toBe(usage === 'normal-text' ? 4.5 : 3);
    expect(result.ratio).toBeCloseTo(expectedRatio, 7);
  });

  it('requires 4.5:1 for normal text and 3:1 for large text and meaningful non-text controls', () => {
    // Lowering normal text to 3:1 would silently admit the teal/teal-100 failure.
    const catalog = loadContrastCatalog({ rootDir: repositoryRoot });

    expect(() => validateContrastPair(catalog, {
      foreground: 'color.semantic.diagnostic.emphasis',
      background: 'color.semantic.surface.subtle-emphasis',
      usage: 'normal-text',
    })).toThrow(/ratio 4\.17:1; threshold 4\.5:1/);
    expect(validateContrastPair(catalog, {
      foreground: 'color.semantic.canvas.default',
      background: 'color.semantic.surface.inverse',
      usage: 'large-text',
    }).threshold).toBe(3);
    expect(validateContrastPair(catalog, {
      foreground: 'color.semantic.focus.inverse',
      background: 'color.semantic.focus.light',
      usage: 'non-text-control',
    }).threshold).toBe(3);
  });

  it.each([
    ['color.semantic.diagnostic.emphasis', 'color.semantic.surface.inverse', '1.91:1'],
    ['color.semantic.border.decorative', 'color.semantic.canvas.default', '1.78:1'],
    ['color.semantic.diagnostic.emphasis', 'color.semantic.surface.subtle-emphasis', '4.17:1'],
    ['color.semantic.focus.inverse', 'color.semantic.canvas.default', '1.40:1'],
  ])('fails the prohibited %s on %s pair with its tokens, ratio, and threshold', (foreground, background, ratio) => {
    // Accidentally declaring or exempting any known failing pair must be visible in validation output.
    const catalog = loadContrastCatalog({ rootDir: repositoryRoot });

    expect(() => validateContrastPair(catalog, { foreground, background })).toThrow(
      `Contrast pair is not declared: ${foreground} on ${background}; ratio ${ratio}; threshold 4.5:1`,
    );
  });

  it('fails an otherwise sufficient but undeclared semantic pair closed', () => {
    // Replacing the registry with arbitrary semantic/CSS comparison would admit this white-background pair.
    const catalog = loadContrastCatalog({ rootDir: repositoryRoot });

    expect(() => validateContrastPair(catalog, {
      foreground: 'color.semantic.text.primary',
      background: 'color.semantic.surface.raised',
    })).toThrow('Contrast pair is not declared: color.semantic.text.primary on color.semantic.surface.raised');
  });

  it('validates exactly the admitted pair registry', () => {
    // Scanning arbitrary combinations or omitting a registry entry changes this admitted set.
    expect(checkContrast({ rootDir: repositoryRoot })).toHaveLength(16);
  });
});
