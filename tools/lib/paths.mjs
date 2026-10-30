import path from 'node:path';
import {fileURLToPath} from 'node:url';

/** Where the tooling and its node_modules live (the directory that holds package.json). */
export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * The repository the tooling works on: the directory that holds i18n/, origin/, languages.json.
 * Normally the package root itself; ROSETTA_ROOT points the tooling (and its tests) at another
 * checkout without copying the tools.
 */
export const rootDir = process.env.ROSETTA_ROOT ? path.resolve(process.env.ROSETTA_ROOT) : packageRoot;

/**
 * Upstream checkout. Normally the `origin/` submodule; ROSETTA_ORIGIN lets tests and
 * contributors point the tooling at any angular/angular checkout.
 */
export const originDir = process.env.ROSETTA_ORIGIN
  ? path.resolve(process.env.ROSETTA_ORIGIN)
  : path.join(rootDir, 'origin');

export const i18nDir = path.join(rootDir, 'i18n');
export const buildRoot = path.join(rootDir, 'build');
export const patchesDir = path.join(rootDir, 'tools', 'adev-patches');
export const languagesFile = path.join(rootDir, 'languages.json');

/** `adev` inside any upstream checkout (origin or a build directory). */
export const adevDir = (checkoutDir) => path.join(checkoutDir, 'adev');

/** `adev/src` inside any upstream checkout (origin or a build directory). */
export const adevSrc = (checkoutDir) => path.join(checkoutDir, 'adev', 'src');

export const langDir = (lang) => path.join(i18nDir, lang);
export const langSrcDir = (lang) => path.join(langDir(lang), 'src');
export const langDictDir = (lang) => path.join(langDir(lang), 'dictionaries');
export const buildDir = (lang) => path.join(buildRoot, lang);

/** Files upstream generates or that must never be overlaid. Paths relative to adev/src. */
export const CONTENT_EXCLUDES = [
  'content/examples/**',
  'content/api/**',
  'content/cli/**',
  'content/cdk/**',
  'content/aria/**',
  'content/reference/license.md',
  'content/reference/press-kit.md',
];

/** Markdown that is in scope for translation, relative to adev/src. */
export const CONTENT_GLOBS = ['content/**/*.md'];

/**
 * Templates whose visible strings go to dictionaries/ui.json, relative to adev/: the app itself
 * and the shared docs components (search dialog, table of contents, cookie banner, example
 * viewer, breadcrumbs…) that the docs pages render.
 */
export const UI_TEMPLATE_GLOBS = ['src/app/**/*.html', '!src/app/**/*.spec.html', 'shared-docs/components/**/*.html', '!shared-docs/components/**/*.spec.html'];

/** Navigation entries file, relative to adev/src. */
export const NAVIGATION_FILE = 'app/routing/navigation-entries/index.ts';

/** index.html, relative to adev/src. */
export const INDEX_HTML = 'index.html';

export function toPosix(p) {
  return p.split(path.sep).join('/');
}
