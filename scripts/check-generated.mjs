import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generatedPaths, generateTokens } from './generate-tokens.mjs';

const scriptRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

const rootFromArguments = (argumentsList) => {
  const rootIndex = argumentsList.indexOf('--root');
  if (rootIndex === -1) {
    return scriptRoot;
  }
  const rootValue = argumentsList[rootIndex + 1];
  if (!rootValue) {
    throw new Error('Expected a directory after --root');
  }
  return resolve(process.cwd(), rootValue);
};

export const checkGenerated = ({ rootDir = scriptRoot } = {}) => {
  const artifacts = generateTokens({ rootDir, write: false });
  const paths = generatedPaths(rootDir);
  const stale = Object.entries(artifacts)
    .filter(([name, contents]) => !existsSync(paths[name]) || readFileSync(paths[name], 'utf8') !== contents)
    .map(([name]) => {
      const relativePaths = {
        css: 'tokens/generated/tokens.css',
        documentation: 'DESIGN_SYSTEM.md',
        media: 'tokens/generated/media.css',
        typescript: 'tokens/generated/tokens.ts',
      };
      return relativePaths[name];
    });

  if (stale.length > 0) {
    throw new Error(`Generated files are stale: ${stale.join(', ')}. Run npm run generate:tokens.`);
  }
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    checkGenerated({ rootDir: rootFromArguments(process.argv.slice(2)) });
    console.log('Generated token artifacts are current.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
