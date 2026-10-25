/**
 * Small cross platform helper that runs the Angular CLI.
 *
 * It is used for `npm test`: on some Windows machines the Angular unit-test
 * builder cannot spawn its own worker thread (it fails with "EINVAL"), which
 * breaks the test run. Disabling the parallel TypeScript compilation avoids
 * that worker, the tests themselves are not affected by it.
 *
 * Usage: node scripts/ng-cli.cjs test [options]
 */
process.env.NG_BUILD_PARALLEL_TS ??= '0';

const { spawn } = require('node:child_process');
const path = require('node:path');

const ngBin = path.join(__dirname, '..', 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
const args = [ngBin, ...process.argv.slice(2)];

const child = spawn(process.execPath, args, { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
