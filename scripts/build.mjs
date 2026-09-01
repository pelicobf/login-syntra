import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(packageRoot, 'dist');

if (dirname(outputDirectory) !== packageRoot) {
  throw new Error('Directorio de salida inválido.');
}

rmSync(outputDirectory, { recursive: true, force: true });

const compiler = spawnSync('npx', ['tsc', '-p', 'tsconfig.build.json'], {
  cwd: packageRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (compiler.status !== 0) process.exit(compiler.status ?? 1);

mkdirSync(resolve(outputDirectory, 'web'), { recursive: true });
cpSync(resolve(packageRoot, 'src/web/login.css'), resolve(outputDirectory, 'web/login.css'));
