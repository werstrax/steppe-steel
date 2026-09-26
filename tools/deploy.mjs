/**
 * Публикация сайта на steppesteel.kz — ТОЛЬКО собранный dist/, без исходников.
 *
 * Зачем: до 26.09.2026 GitHub Pages раздавал весь репозиторий исходников,
 * и по домену открывались HANDOFF.md, docs/, src/data/*.json и сырые кадры.
 * Теперь сайт живёт в отдельном публичном dist-репозитории (по образцу
 * steppesteel-preview), а репозиторий исходников можно сделать приватным.
 *
 *   node tools/deploy.mjs --dry-run   собрать и проверить dist, ничего не копировать
 *   node tools/deploy.mjs             + копия в локальный клон dist-репозитория и коммит
 *   node tools/deploy.mjs --push      + git push (только после явного «да» заказчика)
 *
 * Клон dist-репозитория: DEPLOY_DIR=<путь> или --dir <путь>
 * (по умолчанию ../steppesteel-site рядом с папкой проекта).
 * Сборка: DIST_DIR=<путь> — собрать и проверить другую папку (по умолчанию dist/).
 *
 * Переключение Pages (делает владелец аккаунта, см. HANDOFF.md → «Деплой»):
 *  1) werstrax/steppe-steel: Settings → Pages — снять домен, отключить Pages;
 *  2) dist-репозиторий: Pages из main /, домен steppesteel.kz, Enforce HTTPS;
 *  3) Pages → Verified domains: подтвердить steppesteel.kz (TXT у hoster.kz);
 *     A-записи 185.199.108–111.153 не меняются;
 *  4) репозиторий исходников — приватный.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (k) => args.includes(k);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };

const DIST = process.env.DIST_DIR ? resolve(process.env.DIST_DIR) : join(ROOT, 'dist');
const TARGET = resolve(opt('--dir') || process.env.DEPLOY_DIR || join(ROOT, '..', 'steppesteel-site'));
const DOMAIN = 'steppesteel.kz';
const DRY = flag('--dry-run');
const PUSH = flag('--push');
const MAX_FILE_MB = 20;

const die = (msg) => { console.error(`\n  ✗ ${msg}\n`); process.exit(1); };
const step = (msg) => console.log(`  → ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

function git(cwd, ...a) {
  const r = spawnSync('git', a, { cwd, encoding: 'utf8' });
  if (r.status !== 0) die(`git ${a.join(' ')}: ${(r.stderr || r.stdout || '').trim()}`);
  return (r.stdout || '').trim();
}

/* 1. Боевая сборка: без превью-переменных, с доменом и CNAME ------------------ */

step('сборка (боевой режим, без PREVIEW)');
const env = { ...process.env, DIST_DIR: DIST };
for (const k of ['PREVIEW', 'SITE_URL', 'BASE_PATH', 'VARIANT']) delete env[k];
const b = spawnSync(process.execPath, [join(ROOT, 'build.mjs')], { cwd: ROOT, env, encoding: 'utf8' });
if (b.status !== 0) die(`сборка упала:\n${b.stderr || b.stdout}`);

/* 2. Проверка: в выдаче только сайт ----------------------------------------- */

step(`проверка ${relative(ROOT, DIST) || DIST}`);
if (!existsSync(join(DIST, 'index.html'))) die('нет dist/index.html');
if (!existsSync(join(DIST, '404.html'))) die('нет dist/404.html');

const files = walk(DIST).map((p) => relative(DIST, p).split(sep).join('/'));
const problems = [];
const FORBIDDEN_DIRS = ['src/', 'tools/', 'docs/', 'backups/', 'screenshots/', 'gpt-site/', 'node_modules/', '.git/'];
const FORBIDDEN_EXT = ['.md', '.mjs', '.py', '.sh', '.psd', '.pptx', '.docx', '.log'];
for (const f of files) {
  // корневые папки репозитория исходников (assets/docs/*.pdf — это сайт, их можно)
  if (FORBIDDEN_DIRS.some((d) => f.startsWith(d))) problems.push(`служебная папка: ${f}`);
  if (FORBIDDEN_EXT.includes(extname(f).toLowerCase())) problems.push(`служебный файл: ${f}`);
  if (/(^|\/)raw\//.test(f) || f.includes('viz-archive')) problems.push(`исходник картинки: ${f}`);
  const mb = statSync(join(DIST, f)).size / 1e6;
  if (mb > MAX_FILE_MB) problems.push(`файл ${mb.toFixed(1)} МБ > ${MAX_FILE_MB} МБ: ${f}`);
}

// Картинки: только слоты из манифеста (+ превью документов и знак)
const manifest = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'images.json'), 'utf8'));
delete manifest._readme;
for (const f of files.filter((x) => x.startsWith('assets/img/') && !x.startsWith('assets/img/documents/') && !x.startsWith('assets/img/ui/'))) {
  const slot = f.replace('assets/img/', '').replace(/-\d+\.(webp|jpg|png)$/, '');
  if (!manifest[slot]) problems.push(`картинка вне манифеста: ${f}`);
}

const home = readFileSync(join(DIST, 'index.html'), 'utf8');
if (/<meta name="robots" content="noindex/.test(home)) problems.push('главная собрана с noindex (превью-режим)');
if (!home.includes(`https://${DOMAIN}/`)) problems.push(`в главной нет канонического адреса https://${DOMAIN}/`);
const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
if (/^Disallow: \/\s*$/m.test(robots)) problems.push('robots.txt закрывает весь сайт (превью-режим)');

if (problems.length) die(`в выдаче лишнее или превью-режим:\n    ${problems.join('\n    ')}`);
console.log(`    файлов: ${files.length}, служебного и исходников нет`);

if (DRY) { console.log('\n  --dry-run: проверка пройдена, копирование пропущено.\n'); process.exit(0); }

/* 3. Копия в клон dist-репозитория ----------------------------------------- */

if (!existsSync(join(TARGET, '.git'))) {
  die(`нет клона dist-репозитория: ${TARGET}
    Создайте ПУБЛИЧНЫЙ репозиторий (например werstrax/steppesteel-site) и клонируйте его:
      git clone https://github.com/werstrax/steppesteel-site.git "${TARGET}"
    или укажите другой путь: --dir <путь> / DEPLOY_DIR=<путь>`);
}
if (resolve(TARGET) === resolve(ROOT)) die('клон dist-репозитория не может быть папкой исходников');

step(`копия в ${TARGET}`);
for (const name of readdirSync(TARGET)) {
  if (name === '.git') continue;
  rmSync(join(TARGET, name), { recursive: true, force: true });
}
for (const f of files) {
  const dst = join(TARGET, f);
  mkdirSync(dirname(dst), { recursive: true });
  copyFileSync(join(DIST, f), dst);
}
writeFileSync(join(TARGET, 'CNAME'), `${DOMAIN}\n`, 'utf8');
writeFileSync(join(TARGET, '.nojekyll'), '', 'utf8');

/* 4. Коммит и (по флагу) push ------------------------------------------------ */

git(TARGET, 'add', '-A');
const changed = git(TARGET, 'status', '--porcelain');
if (!changed) {
  console.log('\n  Изменений нет — коммит не нужен.\n');
} else {
  const src = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).stdout.trim();
  const date = new Date().toISOString().slice(0, 10);
  git(TARGET, 'commit', '-m', `Сайт STEPPESTEEL ${date} (исходники ${src || '—'})`);
  step('коммит в dist-репозитории создан');
}

if (PUSH) {
  step('push');
  git(TARGET, 'push', 'origin', 'HEAD');
  console.log(`\n  Опубликовано. Проверка через 1–2 мин: https://${DOMAIN}/ → 200, https://${DOMAIN}/HANDOFF.md → 404.\n`);
} else {
  console.log('\n  Готово локально. Публикация: node tools/deploy.mjs --push (после согласования).\n');
}
