/**
 * Validate translated files, dictionaries and language configuration.
 *
 *   pnpm check <lang>                       everything under i18n/<lang>
 *   pnpm check <lang> <file…>               only these files (paths relative to the repo or to adev/src)
 *   pnpm check <lang> --changed [--base ref] files changed against `ref` (default origin/main)
 *   --strict                                warnings fail too
 *   --allow-outdated                        do not fail on marker != snapshot (for status pages, not PRs)
 *
 * Structure checks compare the translation with its English snapshot (marked tokens: headings,
 * <docs-step> anchors, docs elements, code blocks, links). Glossary enforcement runs through
 * textlint + prh with rules generated from glossary.json. Exit code 1 on errors (or warnings
 * with --strict).
 */
import path from 'node:path';
import pc from 'picocolors';
import {applyIndexHtmlPairs, checkPipelinePairs, extractNavLabels} from '../lib/adev.mjs';
import {command, langArg, resolveLang, restPositionals} from '../lib/cli.mjs';
import {git} from '../lib/exec.mjs';
import {exists, readText} from '../lib/fs.mjs';
import {lintGlossary, writeGlossaryRules} from '../lib/glossary.mjs';
import {loadDictionaries, loadGlossary, loadLanguageRules, loadSite} from '../lib/languages.mjs';
import {ALERT_KEYWORDS, countAlerts, countCodeFences, countDocsElements, extractHeadings, extractLinkTargets, extractStepTitles, proseLines} from '../lib/markdown.mjs';
import {INDEX_HTML, NAVIGATION_FILE, adevSrc, langSrcDir, originDir, rootDir, toPosix} from '../lib/paths.mjs';
import {blobHash, hasMarkerLine, isSnapshot, listSnapshots, markerStyle, readMarkerOf, sidecarOf, snapshotOf, stripMarker} from '../lib/snapshots.mjs';

export default command({
  meta: {name: 'check', description: 'Validate translations, dictionaries and language configuration'},
  args: {
    lang: langArg,
    changed: {type: 'boolean', description: 'Only files changed against --base (git)'},
    base: {type: 'string', valueHint: 'ref', description: 'Base ref for --changed', default: 'origin/main'},
    strict: {type: 'boolean', description: 'Warnings fail too'},
    'allow-outdated': {type: 'boolean', description: 'Outdated markers are warnings, not errors'},
  },
  async run({args}) {
    const lang = await resolveLang(args);
    const checker = new Checker(lang, {strict: Boolean(args.strict), allowOutdated: Boolean(args['allow-outdated'])});
    await checker.loadConfiguration();
    const targets = await checker.selectTargets({changed: Boolean(args.changed), base: args.base, explicit: restPositionals(args)});
    for (const file of targets) await checker.checkFile(file);
    await checker.checkDictionaries();
    const ok = checker.report(targets.length);
    if (!ok) process.exit(1);
  },
});

class Checker {
  constructor(lang, {strict, allowOutdated}) {
    this.lang = lang;
    this.strict = strict;
    this.allowOutdated = allowOutdated;
    this.src = langSrcDir(lang);
    this.findings = []; // {file, level: 'error'|'warning', message}
    this.rules = {};
    this.glossary = [];
    this.lineOffset = 0; // 1 while checking a file whose first line is the source marker
  }

  /** File line number for a line of the marker-less body. */
  ln(bodyLine) {
    return bodyLine + this.lineOffset;
  }

  err(file, message) {
    this.findings.push({file, level: 'error', message});
  }
  warn(file, message) {
    this.findings.push({file, level: 'warning', message});
  }

  // -------------------------------------------------------------------------------------------
  // Configuration

  async loadConfiguration() {
    const {lang} = this;
    try {
      await loadSite(lang);
    } catch (e) {
      this.err(`i18n/${lang}/site.json`, e.message);
    }
    try {
      this.rules = await loadLanguageRules(lang);
      if (this.rules._missing) this.warn(`i18n/${lang}/LANGUAGE.md`, 'missing: add the language rules file (docs/language-rules.md)');
      else if (this.rules._noFrontMatter) this.warn(`i18n/${lang}/LANGUAGE.md`, 'no YAML front matter: machine-checked rules disabled');
    } catch (e) {
      this.err(`i18n/${lang}/LANGUAGE.md`, e.message);
    }
    try {
      this.glossary = await loadGlossary(lang);
      // Keep the textlint rules in sync with glossary.json (editors read the same files).
      const {written} = await writeGlossaryRules(lang);
      if (written.length) this.warn(`i18n/${lang}/glossary.json`, `regenerated ${written.join(', ')}; commit them`);
    } catch (e) {
      this.err(`i18n/${lang}/glossary.json`, e.message);
    }
  }

  // -------------------------------------------------------------------------------------------
  // Which files

  async selectTargets({changed, base, explicit}) {
    const {lang, src} = this;
    if (changed) {
      const out = await git(['diff', '--name-only', '--diff-filter=ACMR', `${base}...HEAD`, '--', `i18n/${lang}/src`], {cwd: rootDir, allowFailure: true});
      return out
        .split('\n')
        .filter(Boolean)
        .map((p) => path.join(rootDir, p))
        .filter((p) => !isSnapshot(p));
    }
    if (explicit.length) {
      return explicit.map((p) => {
        const abs = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
        return abs.startsWith(src) ? abs : path.join(src, p);
      });
    }
    return (await listSnapshots(lang)).map((s) => s.translated);
  }

  // -------------------------------------------------------------------------------------------
  // Per-file checks

  async checkFile(file) {
    const {lang, src} = this;
    const rel = toPosix(path.relative(src, file));
    const label = `i18n/${lang}/src/${rel}`;
    if (!(await exists(file))) {
      this.err(label, 'file not found');
      return;
    }
    const snapshot = snapshotOf(file);
    if (!(await exists(snapshot))) {
      this.err(label, `no snapshot ${path.basename(snapshot)} next to it: the next sync would overwrite this translation`);
      return;
    }
    const translated = await readText(file);
    const english = await readText(snapshot);
    const marker = await readMarkerOf(file, translated);
    const snapshotHash = blobHash(english);
    if (!marker) {
      const where = markerStyle(file) ? 'on the first line' : `in ${path.basename(sidecarOf(file))} next to it`;
      this.err(label, `no source marker ${where} (expected: source: ${snapshotHash}; pnpm status ${lang} --mark ${rel})`);
    } else if (marker !== snapshotHash) {
      const report = this.allowOutdated ? this.warn : this.err;
      report.call(this, label, `outdated: marker ${marker.slice(0, 10)} but snapshot is ${snapshotHash.slice(0, 10)} (pnpm status ${lang} --diff ${rel})`);
    }
    const upstream = path.join(adevSrc(originDir), rel);
    if ((await exists(adevSrc(originDir))) && !(await exists(upstream))) {
      this.warn(label, 'upstream no longer has this file: move or delete the pair');
    }

    const ext = path.extname(file).toLowerCase();
    const body = stripMarker(translated);
    this.lineOffset = hasMarkerLine(translated) ? 1 : 0;
    if (body === english) this.warn(label, 'identical to the English snapshot: nothing translated yet');
    this.checkLineParity(label, body, english, ext);
    if (ext === '.md') {
      this.checkMarkdownStructure(label, body, english);
      await this.checkGlossary(label, file, body, english);
      this.checkTypography(label, body, english);
    }
  }

  checkLineParity(label, body, english, ext) {
    const mode = ext === '.md' ? this.rules.lineParity ?? 'strict' : 'warn';
    if (mode === 'off') return;
    const a = body.split('\n').length;
    const b = english.split('\n').length;
    if (a !== b) {
      const report = mode === 'strict' ? this.err : this.warn;
      report.call(this, label, `line count ${a} differs from snapshot ${b}: keep the same line breaks so diffs line up`);
    }
  }

  checkMarkdownStructure(label, body, english) {
    const hT = extractHeadings(body);
    const hE = extractHeadings(english);
    if (hT.length !== hE.length) {
      this.err(label, `${hT.length} headings vs ${hE.length} in the snapshot`);
    } else {
      hE.forEach((e, i) => {
        const t = hT[i];
        if (t.level !== e.level) this.err(label, `line ${this.ln(t.line)}: heading level ${t.level} vs ${e.level} in the snapshot`);
        if (t.id !== e.id) {
          this.err(label, `line ${this.ln(t.line)}: heading anchor "${t.id}" must be "${e.id}": write \`${'#'.repeat(t.level)} ${t.label} {#${e.id}}\``);
        }
      });
    }
    const sT = extractStepTitles(body);
    const sE = extractStepTitles(english);
    if (sT.length !== sE.length) {
      this.err(label, `${sT.length} <docs-step> titles vs ${sE.length} in the snapshot`);
    } else {
      sE.forEach((e, i) => {
        const t = sT[i];
        if (t.id !== e.id) {
          this.err(label, `line ${this.ln(t.line)}: <docs-step> anchor "${t.id}" must be "${e.id}": write title="${t.label} {#${e.id}}"`);
        }
      });
    }
    const dT = countDocsElements(body);
    const dE = countDocsElements(english);
    for (const tag of new Set([...Object.keys(dT), ...Object.keys(dE)])) {
      if ((dT[tag] ?? 0) !== (dE[tag] ?? 0)) this.err(label, `<${tag}>: ${dT[tag] ?? 0} vs ${dE[tag] ?? 0} in the snapshot`);
    }
    const cT = countCodeFences(body);
    const cE = countCodeFences(english);
    if (cT !== cE) this.err(label, `${cT} code blocks vs ${cE} in the snapshot`);
    const aT = countAlerts(body);
    const aE = countAlerts(english);
    for (const k of ALERT_KEYWORDS) {
      if ((aT[k] ?? 0) !== (aE[k] ?? 0)) {
        this.err(label, `${aT[k] ?? 0} "${k}:" alert(s) vs ${aE[k] ?? 0} in the snapshot: the keyword and its plain colon are syntax and stay in English (\`${k}: …\`); the label readers see is translated in dictionaries/pipeline.json`);
      }
    }
    const linksT = extractLinkTargets(body);
    const linksE = extractLinkTargets(english);
    if (linksT.join('\n') !== linksE.join('\n')) {
      const onlyT = linksT.filter((x) => !linksE.includes(x));
      const onlyE = linksE.filter((x) => !linksT.includes(x));
      const report = this.strict ? this.err : this.warn;
      report.call(
        this,
        label,
        `link targets differ from the snapshot${onlyE.length ? `; missing: ${onlyE.slice(0, 3).join(', ')}` : ''}${onlyT.length ? `; extra: ${onlyT.slice(0, 3).join(', ')}` : ''}`,
      );
    }
  }

  /** Forbidden renderings via textlint/prh (errors); keep-in-English terms absent from the translation (warnings). */
  async checkGlossary(label, file, body, english) {
    if (!this.glossary.length) return;
    if (this.glossary.some((g) => g.forbidden.length)) {
      for (const m of await lintGlossary(this.lang, body, file)) this.err(label, `line ${this.ln(m.line)}: forbidden rendering: ${m.message}`);
    }
    const proseText = proseLines(body)
      .map((p) => p.text)
      .join('\n');
    const englishProse = proseLines(english)
      .map((p) => p.text)
      .join('\n');
    for (const g of this.glossary) {
      if (g.keep && wordRe(g.term).test(englishProse) && !wordRe(g.term).test(proseText)) {
        this.warn(label, `"${g.term}" appears in the English and is a keep-in-English term, but is absent from the translation`);
      }
    }
  }

  /**
   * Typography rules from LANGUAGE.md, on prose lines only. A line left identical to its English
   * (a passage deferred in English, markup, code) keeps English typography and is skipped.
   */
  checkTypography(label, body, english) {
    const englishLines = new Set(english.split('\n').map((l) => l.replace(/\r$/, '')));
    const bodyLines = body.split('\n').map((l) => l.replace(/\r$/, ''));
    const prose = proseLines(body).filter((p) => !englishLines.has(bodyLines[p.line - 1]));
    const {rules} = this;
    const sp = rules.spaceBeforePunctuation;
    if (sp?.chars?.length) {
      for (const c of sp.chars) {
        const esc = escapeRegExp(c);
        const plainSpace = new RegExp(` ${esc}(?=\\s|$)`, 'u');
        const noSpace = new RegExp(`[\\p{L})]${esc}(?=\\s|$)`, 'u');
        for (const p of prose) {
          if (plainSpace.test(p.text)) this.warn(label, `line ${this.ln(p.line)}: regular space before "${c}"; use ${describeSpace(sp.space)}`);
          else if (noSpace.test(p.text)) this.warn(label, `line ${this.ln(p.line)}: missing ${describeSpace(sp.space)} before "${c}"`);
        }
      }
    }
    if (rules.quotes) {
      for (const p of prose) {
        const straight = (p.text.match(/"/g) ?? []).length;
        if (straight >= 2) this.warn(label, `line ${this.ln(p.line)}: straight quotes; use ${rules.quotes[0]} ${rules.quotes[1]}`);
      }
    }
    if (rules.headingCase === 'sentence') {
      for (const h of extractHeadings(body)) {
        const words = h.label.split(/\s+/).slice(1).filter((w) => w.length > 3 && /^\p{L}/u.test(w));
        const upper = words.filter((w) => /^\p{Lu}/u.test(w));
        if (words.length >= 2 && upper.length > words.length / 2) this.warn(label, `line ${this.ln(h.line)}: heading looks Title Cased; use sentence case`);
      }
    }
  }

  // -------------------------------------------------------------------------------------------
  // Dictionaries (always, when origin is available)

  async checkDictionaries() {
    const {lang} = this;
    if (!(await exists(adevSrc(originDir)))) {
      this.warn(`i18n/${lang}`, 'origin not initialized: dictionary checks skipped (pnpm bootstrap)');
      return;
    }
    try {
      const dict = await loadDictionaries(lang);
      const originSrc = adevSrc(originDir);
      const labels = extractNavLabels(await readText(path.join(originSrc, NAVIGATION_FILE)));
      const missing = labels.filter((l) => dict.navigation[l] === undefined);
      if (missing.length) this.warn(`i18n/${lang}/dictionaries/navigation.json`, `${missing.length} upstream label(s) without entry (pnpm dictionaries ${lang}); first: "${missing[0]}"`);
      for (const [k, v] of Object.entries(dict.navigation)) {
        if (typeof v !== 'string') this.err(`i18n/${lang}/dictionaries/navigation.json`, `value of "${k}" must be a string`);
        else if (!v.trim()) this.err(`i18n/${lang}/dictionaries/navigation.json`, `empty translation for "${k}" (keep the English text instead)`);
      }
      for (const [file, entries] of Object.entries(dict.ui)) {
        if (typeof entries !== 'object' || Array.isArray(entries)) this.err(`i18n/${lang}/dictionaries/ui.json`, `"${file}" must map English strings to translations`);
      }
      const {missing: pairsMissing} = applyIndexHtmlPairs(await readText(path.join(originSrc, INDEX_HTML)), dict.indexHtml);
      for (const m of pairsMissing) this.err(`i18n/${lang}/dictionaries/index-html.json`, `pair no longer matches upstream index.html: ${JSON.stringify(m)}`);
      const {missing: pipelineMissing} = await checkPipelinePairs(originDir, dict.pipeline);
      for (const m of pipelineMissing) this.err(`i18n/${lang}/dictionaries/pipeline.json`, `pair no longer matches upstream ${m.file}: ${JSON.stringify(m.find)} (fix "find", keep "replace")`);
    } catch (e) {
      this.err(`i18n/${lang}/dictionaries`, e.message);
    }
  }

  // -------------------------------------------------------------------------------------------
  // Report

  /** Print findings grouped by file; returns true when the run passes. */
  report(checked) {
    const errors = this.findings.filter((f) => f.level === 'error');
    const warnings = this.findings.filter((f) => f.level === 'warning');
    const byFile = new Map();
    for (const f of this.findings) (byFile.get(f.file) ?? byFile.set(f.file, []).get(f.file)).push(f);
    for (const [file, list] of byFile) {
      console.log(pc.bold(file));
      for (const f of list) console.log(`  ${f.level === 'error' ? pc.red('error  ') : pc.yellow('warning')} ${f.message}`);
    }
    if (process.env.GITHUB_ACTIONS) {
      // Workflow commands: the findings show up as annotations on the PR's changed lines.
      for (const f of this.findings) {
        const line = /^line (\d+): /.exec(f.message)?.[1];
        const props = [`file=${ghEscape(f.file, true)}`, ...(line ? [`line=${line}`] : [])].join(',');
        console.log(`::${f.level} ${props}::${ghEscape(f.message)}`);
      }
    }
    console.log(
      `\n${checked} file(s) checked for ${this.lang}: ${errors.length ? pc.red(`${errors.length} error(s)`) : pc.green('0 errors')}, ${warnings.length ? pc.yellow(`${warnings.length} warning(s)`) : '0 warnings'}${this.strict ? ' (strict)' : ''}`,
    );
    return !(errors.length || (this.strict && warnings.length));
  }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Escaping rules of GitHub Actions workflow commands (message data, or a property value). */
function ghEscape(s, property = false) {
  let out = s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  if (property) out = out.replace(/:/g, '%3A').replace(/,/g, '%2C');
  return out;
}

function wordRe(term) {
  return new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(term)}(?![\\p{L}\\p{N}])`, 'iu');
}

function describeSpace(s) {
  if (s === ' ') return 'a narrow no-break space (U+202F)';
  if (s === ' ') return 'a no-break space (U+00A0)';
  return JSON.stringify(s);
}
