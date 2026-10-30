#!/usr/bin/env node
/**
 * `rosetta`: one CLI for the whole tooling (citty). The `pnpm <name>` scripts in package.json
 * are aliases of `rosetta <name>`; subcommands load lazily so `pnpm status` never pays for the
 * build tooling's imports.
 *
 *   node tools/cli.mjs --help
 *   node tools/cli.mjs status fr --md
 *   node tools/cli.mjs check --help
 */
import {defineCommand, runMain} from 'citty';

const main = defineCommand({
  meta: {
    name: 'rosetta',
    version: '0.1.0',
    description: 'Translate and publish angular.dev in your language.',
  },
  subCommands: {
    bootstrap: () => import('./commands/bootstrap.mjs').then((m) => m.default),
    'update-origin': () => import('./commands/update-origin.mjs').then((m) => m.default),
    status: () => import('./commands/status.mjs').then((m) => m.default),
    check: () => import('./commands/check.mjs').then((m) => m.default),
    dictionaries: () => import('./commands/dictionaries.mjs').then((m) => m.default),
    glossary: () => import('./commands/glossary.mjs').then((m) => m.default),
    'create-language': () => import('./commands/create-language.mjs').then((m) => m.default),
    build: () => import('./commands/build.mjs').then((m) => m.default),
    start: () => import('./commands/start.mjs').then((m) => m.default),
    report: () => import('./commands/report.mjs').then((m) => m.default),
    languages: () => import('./commands/languages.mjs').then((m) => m.default),
    'firebase-config': () => import('./commands/firebase-config.mjs').then((m) => m.default),
    'search-index': () => import('./commands/search-index.mjs').then((m) => m.default),
  },
});

const rawArgs = process.argv.slice(2);
// citty handles --help / --version and unknown commands; no arguments shows the usage.
await runMain(main, {rawArgs: rawArgs.length ? rawArgs : ['--help']});
