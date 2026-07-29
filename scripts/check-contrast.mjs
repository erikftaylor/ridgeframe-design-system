import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const colorsPath = (rootDir) => resolve(rootDir, 'tokens/source/colors.json');
const REQUIRED_RATIOS = {
  'normal-text': 4.5,
  'large-text': 3,
  'non-text-control': 3,
};

const flattenTokens = (value, prefix = '', tokens = new Map()) => {
  if (value !== null && typeof value === 'object' && !Array.isArray(value) && '$value' in value) {
    tokens.set(prefix, value);
    return tokens;
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Token group must be an object: ${prefix || 'colors.json'}`);
  }
  Object.entries(value).forEach(([name, child]) => {
    flattenTokens(child, prefix ? `${prefix}.${name}` : name, tokens);
  });
  return tokens;
};

const aliasName = (value) => typeof value === 'string' && /^\{([^{}]+)\}$/.exec(value)?.[1];

const resolveColor = (tokens, name, chain = []) => {
  if (chain.includes(name)) {
    throw new Error(`Cyclic color alias: ${[...chain, name].join(' -> ')}`);
  }
  const token = tokens.get(name);
  if (!token || token.$type !== 'color') {
    throw new Error(`Unknown semantic color token: ${name}`);
  }
  const alias = aliasName(token.$value);
  const value = alias ? resolveColor(tokens, alias, [...chain, name]) : token.$value;
  if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`Invalid color value for ${name}: ${JSON.stringify(value)}`);
  }
  return value.toUpperCase();
};

const channel = (value) => {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};

export const relativeLuminance = (hex) => {
  if (typeof hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(hex)) {
    throw new Error(`Expected a six-digit hexadecimal color, received ${JSON.stringify(hex)}`);
  }
  const [red, green, blue] = hex.slice(1).match(/../g).map((part) => channel(Number.parseInt(part, 16)));
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
};

export const contrastRatio = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
};

const declaredPairs = (tokens) => [...tokens.entries()]
  .filter(([name, token]) => name.startsWith('color.semantic.') && Array.isArray(token.$extensions?.ridgeframe?.contrastPairs))
  .flatMap(([, token]) => token.$extensions.ridgeframe.contrastPairs)
  .map((pair) => {
    if (!pair || typeof pair !== 'object'
      || typeof pair.foreground !== 'string'
      || typeof pair.background !== 'string'
      || !Object.hasOwn(REQUIRED_RATIOS, pair.usage)) {
      throw new Error('Invalid declared contrast pair in colors.json');
    }
    if (!pair.foreground.startsWith('color.semantic.') || !pair.background.startsWith('color.semantic.')) {
      throw new Error(`Contrast pairs must name semantic tokens: ${pair.foreground} / ${pair.background}`);
    }
    return { ...pair, threshold: REQUIRED_RATIOS[pair.usage] };
  });

export const loadContrastCatalog = ({ rootDir = scriptRoot } = {}) => {
  const source = JSON.parse(readFileSync(colorsPath(rootDir), 'utf8'));
  const tokens = flattenTokens(source);
  const pairs = declaredPairs(tokens).map((pair) => ({
    ...pair,
    foregroundColor: resolveColor(tokens, pair.foreground),
    backgroundColor: resolveColor(tokens, pair.background),
  }));
  if (pairs.length === 0) {
    throw new Error('No declared semantic contrast pairs found in colors.json');
  }
  return { pairs, tokens };
};

const formatRatio = (ratio) => `${ratio.toFixed(2)}:1`;
const formatThreshold = (threshold) => `${threshold.toFixed(1)}:1`;

export const validateContrastPair = (catalog, { foreground, background, usage = 'normal-text' }) => {
  if (!Object.hasOwn(REQUIRED_RATIOS, usage)) {
    throw new Error(`Unknown contrast usage: ${usage}`);
  }
  const foregroundColor = resolveColor(catalog.tokens, foreground);
  const backgroundColor = resolveColor(catalog.tokens, background);
  const ratio = contrastRatio(foregroundColor, backgroundColor);
  const declared = catalog.pairs.find((pair) => pair.foreground === foreground
    && pair.background === background && pair.usage === usage);
  const threshold = REQUIRED_RATIOS[usage];
  const description = `${foreground} on ${background}; ratio ${formatRatio(ratio)}; threshold ${formatThreshold(threshold)}`;

  if (!declared) {
    throw new Error(`Contrast pair is not declared: ${description}`);
  }
  if (ratio < threshold) {
    throw new Error(`Contrast requirement failed: ${description}`);
  }
  return { ...declared, ratio };
};

export const checkContrast = ({ rootDir = scriptRoot } = {}) => {
  const catalog = loadContrastCatalog({ rootDir });
  return catalog.pairs.map(({ foreground, background, usage }) =>
    validateContrastPair(catalog, { foreground, background, usage }));
};

const rootFromArguments = (argumentsList) => {
  const rootIndex = argumentsList.indexOf('--root');
  if (rootIndex === -1) return scriptRoot;
  const rootValue = argumentsList[rootIndex + 1];
  if (!rootValue) throw new Error('Expected a directory after --root');
  return resolve(process.cwd(), rootValue);
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    checkContrast({ rootDir: rootFromArguments(process.argv.slice(2)) });
    console.log('Approved semantic contrast pairs pass.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
