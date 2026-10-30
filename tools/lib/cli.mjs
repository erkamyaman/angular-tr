/**
 * Shared pieces of the `rosetta` subcommands (citty).
 */
import {defineCommand} from 'citty';
import {resolveLanguage} from './languages.mjs';
import {CliError, fail, log} from './log.mjs';

/** The `<lang>` positional most commands take. */
export const langArg = {
  type: 'positional',
  description: 'Language folder under i18n/ (optional when a single language is configured)',
  required: false,
};

/**
 * defineCommand plus error handling: a CliError (thrown by fail()) prints its message without a
 * stack trace and sets the exit code; anything else is a bug and keeps its stack.
 */
export function command(def) {
  return defineCommand({
    ...def,
    async run(ctx) {
      try {
        await def.run(ctx);
      } catch (e) {
        if (e instanceof CliError) {
          log.error(e.message);
          process.exit(e.exitCode);
        }
        throw e;
      }
    },
  });
}

/** The language from the positional, or the only configured one. */
export async function resolveLang(args) {
  return resolveLanguage(args.lang).catch((e) => fail(e.message));
}

/** Positionals after the first one (citty keeps every positional in `args._`). */
export function restPositionals(args) {
  return args._.slice(1);
}
