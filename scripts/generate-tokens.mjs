import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GENERATED_START = '<!-- GENERATED:TOKENS:START -->';
const GENERATED_END = '<!-- GENERATED:TOKENS:END -->';
const HEADER = [
  '/**',
  ' * This file is generated from tokens/source/*.json.',
  ' * Do not edit directly. Run `npm run generate:tokens`.',
  ' */',
].join('\n');
const DIMENSION = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:%|Q|cap|ch|cm|dvb|dvh|dvi|dvmax|dvmin|em|ex|ic|in|lh|lvb|lvh|lvi|lvmax|lvmin|mm|pc|pt|px|rcap|rch|rem|rex|ric|rlh|svb|svh|svi|svmax|svmin|vb|vh|vmax|vmin|vw)$/;
const DURATION = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:ms|s)$/;

const scriptRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const isToken = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && '$value' in value;

const readSourceTokens = (rootDir) => {
  const sourceDir = resolve(rootDir, 'tokens/source');
  if (!existsSync(sourceDir)) {
    throw new Error(`Token source directory is missing: ${sourceDir}`);
  }

  const sourceFiles = readdirSync(sourceDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort();
  if (sourceFiles.length === 0) {
    throw new Error(`Token source directory contains no JSON files: ${sourceDir}`);
  }

  const tokens = new Map();
  const cssNames = new Map();

  const addToken = (name, token, sourceFile) => {
    if (!Object.hasOwn(token, '$type')) {
      throw new Error(`Token is missing $type: ${name} (${sourceFile})`);
    }
    if (tokens.has(name)) {
      throw new Error(`Duplicate token name: ${name} (${tokens.get(name).sourceFile}, ${sourceFile})`);
    }

    const cssName = `--rf-${name.replaceAll('.', '-')}`;
    if (cssNames.has(cssName)) {
      throw new Error(
        `Duplicate CSS custom property: ${cssName} (${cssNames.get(cssName)}, ${name})`,
      );
    }

    tokens.set(name, { ...token, sourceFile, cssName });
    cssNames.set(cssName, name);
  };

  const flatten = (value, sourceFile, prefix = '') => {
    if (isToken(value)) {
      addToken(prefix, value, sourceFile);
      return;
    }
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`Token group must be an object: ${prefix || sourceFile}`);
    }

    Object.entries(value).forEach(([key, child]) => {
      flatten(child, sourceFile, prefix ? `${prefix}.${key}` : key);
    });
  };

  sourceFiles.forEach((sourceFile) => {
    const sourcePath = resolve(sourceDir, sourceFile);
    let source;
    try {
      source = JSON.parse(readFileSync(sourcePath, 'utf8'));
    } catch (error) {
      throw new Error(`Unable to parse token source ${sourceFile}: ${error.message}`);
    }
    flatten(source, sourceFile);
  });

  return [...tokens.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, token]) => ({ name, ...token }));
};

const aliasName = (value) =>
  typeof value === 'string' && /^\{([^{}]+)\}$/.exec(value)?.[1];

const validateValue = (name, type, value) => {
  if (type === 'dimension' && (typeof value !== 'string' || !DIMENSION.test(value))) {
    throw new Error(`Invalid dimension value for ${name}: ${JSON.stringify(value)}`);
  }
  if (type === 'duration' && (typeof value !== 'string' || !DURATION.test(value))) {
    throw new Error(`Invalid duration value for ${name}: ${JSON.stringify(value)}`);
  }
  if ((type === 'number' || type === 'fontWeight') && (typeof value !== 'number' || !Number.isFinite(value))) {
    throw new Error(`Invalid numeric value for ${name}: ${JSON.stringify(value)}`);
  }
};

const resolveTokens = (tokens) => {
  const byName = new Map(tokens.map((token) => [token.name, token]));
  const resolved = new Map();

  const resolveValue = (name, chain = []) => {
    if (resolved.has(name)) {
      return resolved.get(name);
    }
    if (chain.includes(name)) {
      throw new Error(`Cyclic token alias: ${[...chain, name].join(' -> ')}`);
    }

    const token = byName.get(name);
    if (!token) {
      throw new Error(`Missing token alias: ${name} (referenced by ${chain.at(-1)})`);
    }

    const alias = aliasName(token.$value);
    const value = alias ? resolveValue(alias, [...chain, name]) : token.$value;
    validateValue(name, token.$type, value);
    resolved.set(name, value);
    return value;
  };

  return tokens.map((token) => ({ ...token, value: resolveValue(token.name) }));
};

const renderCss = (tokens) => [
  HEADER,
  ':root {',
  ...tokens.map((token) => `  ${token.cssName}: ${token.value};`),
  '}',
  '',
].join('\n');

const renderTypescript = (tokens) => [
  HEADER,
  'export const tokens = {',
  ...tokens.map((token) => `  ${JSON.stringify(token.name)}: ${JSON.stringify(token.value)},`),
  '} as const;',
  '',
  'export type Tokens = typeof tokens;',
  'export type TokenName = keyof Tokens;',
  'export type TokenValue = Tokens[TokenName];',
  '',
].join('\n');

const renderSnapshot = (tokens) => [
  '| Token | Type | Value |',
  '| --- | --- | --- |',
  ...tokens.map((token) => `| \`${token.name}\` | \`${token.$type}\` | \`${token.value}\` |`),
].join('\n');

const renderDocumentation = (documentation, tokens) => {
  const startIndex = documentation.indexOf(GENERATED_START);
  if (startIndex === -1) {
    throw new Error(`DESIGN_SYSTEM.md is missing token snapshot marker: ${GENERATED_START}`);
  }
  const endIndex = documentation.indexOf(GENERATED_END, startIndex + GENERATED_START.length);
  if (endIndex === -1) {
    throw new Error(`DESIGN_SYSTEM.md is missing token snapshot marker: ${GENERATED_END}`);
  }

  return `${documentation.slice(0, startIndex + GENERATED_START.length)}\n${renderSnapshot(tokens)}\n${documentation.slice(endIndex)}`;
};

export const generatedPaths = (rootDir = scriptRoot) => ({
  css: resolve(rootDir, 'tokens/generated/tokens.css'),
  documentation: resolve(rootDir, 'DESIGN_SYSTEM.md'),
  typescript: resolve(rootDir, 'tokens/generated/tokens.ts'),
});

export const generateTokens = ({ rootDir = scriptRoot, write = false } = {}) => {
  const normalizedRoot = resolve(rootDir);
  const paths = generatedPaths(normalizedRoot);
  if (!existsSync(paths.documentation)) {
    throw new Error(`DESIGN_SYSTEM.md is missing: ${paths.documentation}`);
  }

  const tokens = resolveTokens(readSourceTokens(normalizedRoot));
  const artifacts = {
    css: renderCss(tokens),
    documentation: renderDocumentation(readFileSync(paths.documentation, 'utf8'), tokens),
    typescript: renderTypescript(tokens),
  };

  if (write) {
    mkdirSync(dirname(paths.css), { recursive: true });
    Object.entries(artifacts).forEach(([name, contents]) => {
      const path = paths[name];
      if (!existsSync(path) || readFileSync(path, 'utf8') !== contents) {
        writeFileSync(path, contents);
      }
    });
  }

  return artifacts;
};

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

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    generateTokens({ rootDir: rootFromArguments(process.argv.slice(2)), write: true });
    console.log('Generated Ridgeframe token artifacts.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
