/**
 * Generate the textlint rules of a language from its glossary.
 *
 *   pnpm glossary <lang>            write i18n/<lang>/prh.yml and .textlintrc.json from glossary.json
 *   pnpm glossary <lang> --check    fail when they are out of date (CI)
 *
 * `pnpm check` regenerates them too; this command exists for editors (textlint extensions pick
 * up .textlintrc.json) and for reviewing the rules a glossary produces.
 */
import {command, langArg, resolveLang} from '../lib/cli.mjs';
import {prhFromGlossary, writeGlossaryRules} from '../lib/glossary.mjs';
import {loadGlossary} from '../lib/languages.mjs';
import {fail, log} from '../lib/log.mjs';

export default command({
  meta: {name: 'glossary', description: 'Generate prh.yml and .textlintrc.json from glossary.json'},
  args: {
    lang: langArg,
    check: {type: 'boolean', description: 'Only verify that the generated files are current'},
    print: {type: 'boolean', description: 'Print the prh rules instead of writing them'},
  },
  async run({args}) {
    const lang = await resolveLang(args);
    const glossary = await loadGlossary(lang).catch((e) => fail(e.message));
    if (args.print) {
      process.stdout.write(prhFromGlossary(glossary));
      return;
    }
    if (args.check) {
      // Dry comparison: regenerate into memory and compare with what is on disk.
      const {written, rules} = await writeGlossaryRules(lang, {dryRun: true});
      if (written.length) fail(`${written.join(', ')} out of date; run: pnpm glossary ${lang}`);
      log.ok(`i18n/${lang}: textlint rules current (${rules} rule(s) from glossary.json)`);
      return;
    }
    const {written, rules} = await writeGlossaryRules(lang);
    const terms = glossary.length;
    const filled = glossary.filter((g) => g.translation || g.keep).length;
    log.info(`i18n/${lang}/glossary.json: ${terms} terms, ${filled} with a translation or keep, ${rules} with forbidden renderings`);
    if (written.length) log.ok(`wrote ${written.join(', ')}`);
    else log.ok('prh.yml and .textlintrc.json already current');
  },
});
