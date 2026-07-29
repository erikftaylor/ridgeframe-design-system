import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Manifest = Record<string, unknown>;

const root = resolve(import.meta.dirname, '..');

function readJson(relativePath: string): Manifest {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8')) as Manifest;
}

describe('asset governance', () => {
  it('records the approved logo boundary without inventing a binary', () => {
    const manifest = readJson('assets/logos/manifest.json');

    expect(manifest).toMatchObject({
      assetType: 'identity-logo',
      approvalStatus: 'approved-binaries-absent',
      source: {
        authority: 'Approved Figma identity components',
        status: 'future-authority',
      },
      license: {
        name: 'Proprietary',
        owner: 'Ridgeframe Strategies',
      },
      prohibitedSynthesis: true,
      files: [],
    });
    expect(manifest).not.toHaveProperty('path');
    expect(manifest).not.toHaveProperty('file');
  });

  it('pins Lucide as the only interface icon set and inventories current use', () => {
    const manifest = readJson('assets/icons/manifest.json');
    const packageLock = readJson('package-lock.json') as {
      packages?: Record<string, { version?: string; license?: string }>;
    };
    const installedLucide = packageLock.packages?.['node_modules/lucide-react'];

    expect(manifest).toMatchObject({
      assetType: 'interface-icons',
      approvalStatus: 'approved',
      source: {
        package: 'lucide-react',
        version: installedLucide?.version,
      },
      license: {
        name: installedLucide?.license,
        file: '../licenses/lucide-ISC.txt',
      },
      onlyInterfaceIconSet: 'Lucide',
      prohibitedSynthesis: true,
      icons: ['ArrowRight', 'Check', 'ExternalLink', 'Search'],
    });
    expect(installedLucide).toMatchObject({ version: '1.27.0', license: 'ISC' });
  });

  it('documents pinned font packages, their licenses, and the Jost exclusion', () => {
    const readme = readFileSync(resolve(root, 'assets/README.md'), 'utf8');
    const packageLock = readJson('package-lock.json') as {
      packages?: Record<string, { version?: string; license?: string }>;
    };

    for (const [packageName, licenseFile] of [
      ['@fontsource-variable/space-grotesk', 'space-grotesk-OFL-1.1.txt'],
      ['@fontsource-variable/eb-garamond', 'eb-garamond-OFL-1.1.txt'],
    ] as const) {
      const installed = packageLock.packages?.[`node_modules/${packageName}`];
      expect(installed).toMatchObject({ version: '5.3.0', license: 'OFL-1.1' });
      expect(readme).toContain(`\`${packageName}@${installed?.version}\``);
      expect(readme).toContain(`\`assets/licenses/${licenseFile}\``);
    }

    expect(readme).toContain('Jost');
    expect(readme).toMatch(/logotype only/i);
    expect(readme).toMatch(/not shipped/i);
  });
});
