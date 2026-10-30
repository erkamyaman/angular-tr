import pc from 'picocolors';

export const log = {
  step: (msg) => console.log(pc.cyan(`\n== ${msg}`)),
  info: (msg) => console.log(msg),
  ok: (msg) => console.log(pc.green(msg)),
  warn: (msg) => console.log(pc.yellow(msg)),
  error: (msg) => console.error(pc.red(msg)),
  dim: (msg) => console.log(pc.dim(msg)),
};

/** An error whose message is shown to the user without a stack trace. */
export class CliError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.name = 'CliError';
    this.exitCode = exitCode;
  }
}

/** Abort the current command with a message (printed without a stack trace). */
export function fail(message, exitCode = 1) {
  throw new CliError(message, exitCode);
}
