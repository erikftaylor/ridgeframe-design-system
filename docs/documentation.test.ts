import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const readRootDocument = (name: string): string => {
  const path = resolve(root, name);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
};

describe('repository documentation contract', () => {
  it('keeps exactly three non-overlapping Markdown entry points at the root', () => {
    const rootMarkdown = readdirSync(root)
      .filter((name) => name.endsWith('.md'))
      .sort();

    expect(rootMarkdown).toEqual(['CHANGELOG.md', 'DESIGN_SYSTEM.md', 'README.md']);
  });

  it('orients humans to setup, validation, tagged releases, and explicit Claude Design sync', () => {
    const readme = readRootDocument('README.md');

    expect(readme).toContain('Claude Code `2.1.181` or later');
    expect(readme).toContain('npm ci');
    expect(readme).toContain('npm run generate:tokens');
    expect(readme).toContain('npm run test:run');
    expect(readme).toContain('npm run validate');
    expect(readme).toContain('npm run dev');
    expect(readme).toMatch(/semantic version tag/i);
    expect(readme).toMatch(/tagged checkout/i);
    expect(readme).toContain('/design-sync');
    expect(readme).toMatch(/does not watch/i);
  });

  it('makes DESIGN_SYSTEM.md complete enough for single-file retrieval', () => {
    const designSystem = readRootDocument('DESIGN_SYSTEM.md');

    for (const authority of [
      'Ridgeframe Strategies — Strategic Foundation',
      'Ridgeframe Strategies — Website Status',
    ]) {
      expect(designSystem).toContain(authority);
    }
    expect(designSystem).toMatch(/Convergence[\s\S]*historical only/i);

    for (const [token, value] of [
      ['brand/slate', '#1B3A52'],
      ['brand/teal', '#0F6E56'],
      ['brand/rust', '#854F0B'],
      ['neutral/off-white', '#F9F8F7'],
      ['neutral/light', '#BFBDB3'],
      ['neutral/mid', '#6B6A64'],
      ['neutral/charcoal', '#2C2C2A'],
      ['accent/teal-100', '#9FE1CB'],
    ] as const) {
      expect(designSystem).toContain(`\`${token}\``);
      expect(designSystem).toContain(`\`${value}\``);
    }

    for (const primitive of ['Button', 'Link', 'Card', 'SectionShell']) {
      expect(designSystem).toContain(`**${primitive}:**`);
    }
    for (const composition of ['Findings Card', 'Annotated Screen', 'Priority Map']) {
      expect(designSystem).toContain(`**${composition}:**`);
    }

    expect(designSystem).toContain('WCAG 2.2 AA');
    expect(designSystem).toContain('4.5:1');
    expect(designSystem).toContain('3:1');
    expect(designSystem).toMatch(/focused content remains unobscured/i);
    expect(designSystem).toMatch(/24px[\s\S]*minimum/i);
    expect(designSystem).toMatch(/not use color alone/i);
    expect(designSystem).toMatch(/reduced motion/i);
    expect(designSystem).toMatch(/non-drag alternative/i);
    expect(designSystem).toMatch(/homepage[\s\S]*deferred to `v0\.2\.0`/i);
    expect(designSystem).toMatch(/homepage work may begin only after[\s\S]*website specification[\s\S]*sitemap[\s\S]*content direction/i);
  });

  it('keeps v0.1.0 unreleased and records the brand authority transition', () => {
    const changelog = readRootDocument('CHANGELOG.md');

    expect(changelog).toMatch(/v0\.1\.0/);
    expect(changelog).toMatch(/unreleased/i);
    expect(changelog).toMatch(/Ridgeframe Strategies[\s\S]*only current brand/i);
    expect(changelog).toMatch(/Convergence[\s\S]*historical references/i);
  });
});
