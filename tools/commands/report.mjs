/**
 * Status report with freshness (dates from git), as JSON for the status page and dashboards.
 *
 *   pnpm report <lang>                 JSON to stdout
 *   pnpm report <lang> --out file.json
 *   pnpm report <lang> --summary       one-line human summary
 */
import {command, langArg, resolveLang} from '../lib/cli.mjs';
import {git} from '../lib/exec.mjs';
import {writeJson} from '../lib/fs.mjs';
import {fail, log} from '../lib/log.mjs';
import {rootDir} from '../lib/paths.mjs';
import {STATES, computeStatus} from '../lib/status-core.mjs';

export default command({
  meta: {name: 'report', description: 'Coverage and freshness report (JSON) for status pages and dashboards'},
  args: {
    lang: langArg,
    out: {type: 'string', valueHint: 'file', description: 'Write the JSON to this file instead of stdout'},
    summary: {type: 'boolean', description: 'One-line human summary'},
  },
  async run({args}) {
    const lang = await resolveLang(args);
    const status = await computeStatus(lang).catch((e) => fail(e.message));
    const report = await buildReport(lang, status);
    if (args.summary) {
      const t = status.totals;
      const f = report.freshness;
      log.info(
        `${lang}: ${t.translated}/${t.inScope} translated (${t.coverage} %), ${t[STATES.outdated]} outdated (median ${f.medianOutdatedDays} d, max ${f.maxOutdatedDays} d, ${f.over30Days} over 30 d), ${t[STATES.untranslated]} untranslated`,
      );
    } else if (args.out) {
      await writeJson(String(args.out), report);
      log.ok(`wrote ${args.out}`);
    } else {
      console.log(JSON.stringify(report, null, 2));
    }
  },
});

/** Status plus per-file last-change dates (one `git log` pass) and freshness figures. */
export async function buildReport(lang, status) {
  const lastChange = new Map();
  const out = await git(['log', '--format=%cI', '--name-only', '--', `i18n/${lang}/src`], {cwd: rootDir, allowFailure: true});
  let date = null;
  for (const line of out.split('\n')) {
    if (!line) continue;
    if (/^\d{4}-\d{2}-\d{2}T/.test(line)) {
      date = line;
      continue;
    }
    if (!lastChange.has(line)) lastChange.set(line, date);
  }

  const now = Date.now();
  const days = (iso) => (iso ? Math.floor((now - Date.parse(iso)) / 86_400_000) : null);
  const files = status.files.map((f) => {
    const translatedPath = `i18n/${lang}/src/${f.rel}`;
    const snapshotPath = translatedPath.replace(/(\.[^./]+)$/, '.en$1');
    const translatedAt = lastChange.get(translatedPath) ?? null;
    const snapshotAt = lastChange.get(snapshotPath) ?? null;
    const entry = {rel: f.rel, state: f.state, overlay: Boolean(f.overlay)};
    if (f.class) entry.class = f.class;
    if (translatedAt) entry.translatedAt = translatedAt;
    if (snapshotAt) entry.snapshotAt = snapshotAt;
    if (f.state === STATES.outdated || f.state === STATES.staleSnapshot) entry.outdatedDays = days(snapshotAt) ?? null;
    return entry;
  });

  const outdatedDays = files.map((f) => f.outdatedDays).filter((d) => typeof d === 'number').sort((a, b) => a - b);
  const freshness = {
    outdatedPages: outdatedDays.length,
    medianOutdatedDays: outdatedDays.length ? outdatedDays[Math.floor(outdatedDays.length / 2)] : 0,
    maxOutdatedDays: outdatedDays.length ? outdatedDays.at(-1) : 0,
    over30Days: outdatedDays.filter((d) => d > 30).length,
  };

  return {
    lang,
    origin: status.origin.sha,
    generatedAt: status.generatedAt,
    totals: status.totals,
    freshness,
    dictionaries: {
      navigation: {total: status.dictionaries.navigation.total, translated: status.dictionaries.navigation.translated},
      ui: {total: status.dictionaries.ui.total, translated: status.dictionaries.ui.translated},
      pipeline: {total: status.dictionaries.pipeline.total, translated: status.dictionaries.pipeline.translated},
    },
    files,
  };
}
