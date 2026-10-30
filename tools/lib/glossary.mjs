/**
 * Glossary enforcement through textlint + textlint-rule-prh (the setup angular-ja uses):
 * glossary.json -> i18n/<lang>/prh.yml (forbidden renderings -> expected term) and
 * i18n/<lang>/.textlintrc.json, so the same rules run in `pnpm check`, in CI and in any editor
 * with a textlint extension. Both files are generated; glossary.json is the source.
 */
import path from 'node:path';
import YAML from 'yaml';
import {exists, readText, writeText} from './fs.mjs';
import {loadGlossary} from './languages.mjs';
import {langDir, packageRoot, rootDir} from './paths.mjs';

const GENERATED = '# Generated from glossary.json by `pnpm glossary <lang>`. Edit glossary.json, not this file.\n';

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

/**
 * prh dictionary for a glossary: one rule per entry that has forbidden renderings.
 * Patterns use Unicode-aware word boundaries (`\b` fails on accented letters); prh adds the
 * `u` and `g` flags itself and ignores matches equal to `expected`.
 */
export function prhFromGlossary(glossary) {
  const rules = [];
  for (const g of glossary) {
    if (!g.forbidden?.length) continue;
    const expected = g.keep || !g.translation ? g.term : g.translation;
    const rule = {
      expected,
      patterns: g.forbidden.map((f) => `/(?<![\\p{L}\\p{N}])${escapeRegExp(f)}(?![\\p{L}\\p{N}])/i`),
    };
    if (g.note) rule.prh = g.note;
    rules.push(rule);
  }
  return GENERATED + YAML.stringify({version: 1, rules});
}

/** textlint configuration: prh over prose, headings, links, emphasis and quotes; code is never checked. */
export function textlintrcFor() {
  return (
    JSON.stringify(
      {
        rules: {
          prh: {rulePaths: ['./prh.yml'], checkLink: true, checkEmphasis: true, checkBlockQuote: true},
        },
      },
      null,
      2,
    ) + '\n'
  );
}

/**
 * Write prh.yml and .textlintrc.json for a language when their content changed (with dryRun,
 * only report which ones would change). Returns {written: [relative paths], rules: prh rule count}.
 */
export async function writeGlossaryRules(lang, {dryRun = false} = {}) {
  const glossary = await loadGlossary(lang);
  const dir = langDir(lang);
  const files = {
    [path.join(dir, 'prh.yml')]: prhFromGlossary(glossary),
    [path.join(dir, '.textlintrc.json')]: textlintrcFor(),
  };
  const written = [];
  for (const [file, content] of Object.entries(files)) {
    if ((await exists(file)) && (await readText(file)) === content) continue;
    if (!dryRun) await writeText(file, content);
    written.push(path.relative(rootDir, file));
  }
  return {written, rules: glossary.filter((g) => g.forbidden?.length).length};
}

const linters = new Map();

/** The textlint linter of a language (prh rules from its .textlintrc.json), created once. */
async function linterFor(lang) {
  if (!linters.has(lang)) {
    linters.set(
      lang,
      (async () => {
        const {createLinter, loadTextlintrc} = await import('textlint');
        const descriptor = await loadTextlintrc({
          configFilePath: path.join(langDir(lang), '.textlintrc.json'),
          node_modulesDir: path.join(packageRoot, 'node_modules'),
        });
        return createLinter({descriptor, cwd: rootDir});
      })(),
    );
  }
  return linters.get(lang);
}

/**
 * Forbidden renderings in a translated Markdown text, as [{line, column, message}].
 * Call writeGlossaryRules(lang) first so the rules match glossary.json.
 */
export async function lintGlossary(lang, text, filePath) {
  const linter = await linterFor(lang);
  const result = await linter.lintText(text, filePath);
  return result.messages.map((m) => ({line: m.line, column: m.column, message: m.message.split('\n')[0], ruleId: m.ruleId}));
}
