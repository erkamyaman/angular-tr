import {readdir} from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import {parse as parseBcp47} from 'bcp-47';
import YAML from 'yaml';
import {exists, isDirectory, readJson, readText} from './fs.mjs';
import {i18nDir, langDictDir, langDir, packageRoot} from './paths.mjs';

/**
 * True for a well-formed BCP-47 tag such as `fr`, `pt-BR` or `zh-Hans`: parsed by bcp-47 and
 * with an ISO 639 primary subtag (2 or 3 letters; the 5–8 letter forms the grammar reserves are
 * not used for real languages).
 */
export function isLanguageTag(tag) {
  if (typeof tag !== 'string' || !tag) return false;
  let bad = false;
  const schema = parseBcp47(tag, {warning: () => (bad = true)});
  return !bad && typeof schema.language === 'string' && schema.language.length >= 2 && schema.language.length <= 3;
}

/** Native name, English name and direction of a language tag, from the ICU data Node ships. */
export function describeLanguage(tag) {
  const safe = (fn) => {
    try {
      return fn();
    } catch {
      return undefined;
    }
  };
  const name = safe(() => new Intl.DisplayNames([tag], {type: 'language'}).of(tag)) ?? tag;
  const englishName = safe(() => new Intl.DisplayNames(['en'], {type: 'language'}).of(tag)) ?? tag;
  const locale = safe(() => new Intl.Locale(tag));
  const info = locale ? (typeof locale.getTextInfo === 'function' ? safe(() => locale.getTextInfo()) : locale.textInfo) : undefined;
  return {name: capitalize(name), englishName, direction: info?.direction === 'rtl' ? 'rtl' : 'ltr'};
}

function capitalize(s) {
  return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
}

/** Language folders under i18n/. Folders starting with `_` are examples unless includeExample. */
export async function listLanguages({includeExample = false} = {}) {
  if (!(await exists(i18nDir))) return [];
  const entries = await readdir(i18nDir, {withFileTypes: true});
  const langs = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (e.name.startsWith('_') && !includeExample) continue;
    if (await exists(path.join(i18nDir, e.name, 'site.json'))) langs.push(e.name);
  }
  return langs.sort();
}

export async function languageExists(lang) {
  return isDirectory(langDir(lang));
}

/** UI strings used by the rosetta patch (language switcher, banners); English defaults. */
export const DEFAULT_STRINGS = {
  readInEnglish: 'Read this page in English',
  otherLanguages: 'Other languages',
  outdatedBanner: 'This translation is behind the English page; some passages may be outdated.',
  untranslatedBanner: 'This page has not been translated yet; it is shown in English.',
  reportIssue: 'Report a translation problem',
};

let validateSite;
async function siteValidator() {
  if (!validateSite) {
    const schema = await readJson(path.join(packageRoot, 'tools', 'site.schema.json'));
    const ajv = new Ajv2020({allErrors: true, strict: false});
    validateSite = ajv.compile(schema);
  }
  return validateSite;
}

/** Load and validate i18n/<lang>/site.json against tools/site.schema.json. Throws with a readable message. */
export async function loadSite(lang) {
  const file = path.join(langDir(lang), 'site.json');
  if (!(await exists(file))) {
    throw new Error(`No site.json for language "${lang}" (expected ${file}). Run: pnpm create-language ${lang}`);
  }
  const site = await readJson(file);
  const validate = await siteValidator();
  if (!validate(site)) {
    const problems = validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`).join('; ');
    throw new Error(`${path.relative(process.cwd(), file)}: ${problems}`);
  }
  if (!isLanguageTag(site.lang)) throw new Error(`${file}: "lang" must be a BCP-47 tag like fr or pt-BR`);
  site.repo.branch ||= 'main';
  site.upstreamSite ||= 'https://angular.dev';
  site.search ||= {provider: 'none'};
  site.analytics ||= {provider: 'none'};
  site.community ||= {maintainers: []};
  site.community.maintainers ||= [];
  site.notice ||= 'Community translation of angular.dev, not affiliated with Google.';
  site.strings = {...DEFAULT_STRINGS, ...(site.strings ?? {})};
  site.folder = lang;
  site.siteUrl = `https://${site.domain}`;
  site.repoUrl = `https://github.com/${site.repo.owner}/${site.repo.name}`;
  return site;
}

const DEFAULT_RULES = {
  lineParity: 'strict',
  quotes: null,
  spaceBeforePunctuation: null,
  headingCase: 'none',
  fonts: [],
};

/** Parse the YAML front matter of LANGUAGE.md into a rules object (defaults applied). */
export async function loadLanguageRules(lang) {
  const file = path.join(langDir(lang), 'LANGUAGE.md');
  if (!(await exists(file))) return {...DEFAULT_RULES, _missing: true};
  const text = await readText(file);
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return {...DEFAULT_RULES, _noFrontMatter: true};
  const parsed = YAML.parse(m[1]) ?? {};
  const rules = {...DEFAULT_RULES, ...parsed};
  if (!['strict', 'warn', 'off'].includes(rules.lineParity)) {
    throw new Error(`${file}: lineParity must be strict, warn or off`);
  }
  if (rules.quotes && (!Array.isArray(rules.quotes) || rules.quotes.length !== 2)) {
    throw new Error(`${file}: quotes must be an array of two strings`);
  }
  if (rules.spaceBeforePunctuation) {
    const s = rules.spaceBeforePunctuation;
    if (!Array.isArray(s.chars) || typeof s.space !== 'string') {
      throw new Error(`${file}: spaceBeforePunctuation needs { chars: [...], space: "..." }`);
    }
  }
  return rules;
}

/** Glossary entries, normalized. */
export async function loadGlossary(lang) {
  const file = path.join(langDir(lang), 'glossary.json');
  if (!(await exists(file))) return [];
  const entries = await readJson(file);
  if (!Array.isArray(entries)) throw new Error(`${file}: expected an array of entries`);
  return entries.map((e, i) => {
    if (!e.term) throw new Error(`${file}: entry ${i} has no "term"`);
    return {
      term: String(e.term).trim(),
      translation: e.translation ? String(e.translation).trim() : '',
      keep: Boolean(e.keep),
      forbidden: Array.isArray(e.forbidden) ? e.forbidden.map(String) : [],
      note: e.note ?? '',
    };
  });
}

/** The four dictionaries (navigation, ui, index-html, pipeline), with empty defaults. */
export async function loadDictionaries(lang) {
  const dir = langDictDir(lang);
  const load = async (name, fallback) => {
    const f = path.join(dir, name);
    return (await exists(f)) ? readJson(f) : fallback;
  };
  const navigation = await load('navigation.json', {});
  const ui = await load('ui.json', {});
  const indexHtml = await load('index-html.json', []);
  const pipeline = await load('pipeline.json', []);
  if (!Array.isArray(indexHtml)) throw new Error(`${dir}/index-html.json must be an array of {find, replace}`);
  if (!Array.isArray(pipeline)) throw new Error(`${dir}/pipeline.json must be an array of {file, find, replace}`);
  for (const p of pipeline) {
    if (typeof p?.file !== 'string' || typeof p?.find !== 'string' || typeof p?.replace !== 'string') {
      throw new Error(`${dir}/pipeline.json: every entry needs string "file", "find" and "replace" (got ${JSON.stringify(p)})`);
    }
  }
  return {navigation, ui, indexHtml, pipeline};
}

/** Resolve a language from argv: explicit arg, or the only configured language. */
export async function resolveLanguage(explicit) {
  if (explicit) return explicit;
  const langs = await listLanguages({includeExample: true});
  if (langs.length === 1) return langs[0];
  const configured = langs.filter((l) => !l.startsWith('_'));
  if (configured.length === 1) return configured[0];
  throw new Error(
    langs.length === 0
      ? 'No language configured. Run: pnpm create-language <lang>'
      : `Several languages configured (${langs.join(', ')}); pass one as argument.`,
  );
}
