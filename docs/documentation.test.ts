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

    const dateRelease = readme.indexOf('Change `## v0.1.0 — Unreleased` to `## v0.1.0 — YYYY-MM-DD`');
    const commitRelease = readme.indexOf('Commit the dated changelog before creating the tag');
    const createTag = readme.indexOf('git tag -a v0.1.0');
    expect(dateRelease).toBeGreaterThan(-1);
    expect(commitRelease).toBeGreaterThan(dateRelease);
    expect(createTag).toBeGreaterThan(commitRelease);
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

    const primitiveGroups = (JSON.parse(
      readFileSync(resolve(root, 'tokens/source/colors.json'), 'utf8'),
    ) as { color: { primitive: Record<string, Record<string, { $value: string }>> } })
      .color.primitive;

    for (const [group, members] of Object.entries(primitiveGroups)) {
      for (const [name, { $value }] of Object.entries(members)) {
        expect(designSystem).toContain(`\`${group}/${name}\``);
        expect(designSystem).toContain(`\`${$value}\``);
      }
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

  it('defines the complete gallery and manual accessibility review contract', () => {
    const designSystem = readRootDocument('DESIGN_SYSTEM.md');

    for (const state of [
      'default',
      'hover',
      'focus-visible',
      'active or pressed',
      'current or selected',
      'loading',
      'disabled',
    ]) {
      expect(designSystem).toMatch(new RegExp(`\\b${state}\\b`, 'i'));
    }

    expect(designSystem).toMatch(/Button[\s\S]*light and inverse surfaces/i);
    expect(designSystem).toMatch(/Card and SectionShell[\s\S]*default, raised, subtle-emphasis, and inverse surfaces/i);
    expect(designSystem).toContain('Mobile: `0–767px`');
    expect(designSystem).toContain('Tablet: `768–1023px`');
    expect(designSystem).toContain('Desktop: `1024–1439px`');
    expect(designSystem).toContain('Wide: `1440px` and above');
    expect(designSystem).toMatch(/prefers-reduced-motion:[\s\S]*zero-duration token/i);

    expect(designSystem).toMatch(/alternative text/i);
    expect(designSystem).toContain('Consistent Help');
    expect(designSystem).toContain('Redundant Entry');
    expect(designSystem).toMatch(/authentication[\s\S]*not applicable/i);
    expect(designSystem).toMatch(/automation supplements but does not replace manual keyboard, screen-reader, and visual review/i);
  });

  it('keeps v0.1.0 unreleased and records the brand authority transition', () => {
    const changelog = readRootDocument('CHANGELOG.md');

    expect(changelog).toContain('## v0.1.0 — Unreleased');
    expect(changelog).toMatch(/Ridgeframe Strategies[\s\S]*only current brand/i);
    expect(changelog).toMatch(/Convergence[\s\S]*historical references/i);
  });
});
