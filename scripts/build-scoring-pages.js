#!/usr/bin/env node
/**
 * Builds the public scoring-chart pages in site/scoring/ from the shared table file (data/aft_tables_250601.json),
 * the same file the app's tables are tested against. People search for "AFT deadlift scoring chart 27-31 male" and
 * land here; every page points to the app.
 *
 *   node scripts/build-scoring-pages.js           # write site/scoring/*, site/sitemap.xml, site/robots.txt
 *   node scripts/build-scoring-pages.js --check   # exit 1 if what is committed is out of date (CI runs this as a test)
 *
 * The pages are committed, so the Pages workflow only publishes site/ as it is.
 */
const fs = require('fs');
const path = require('path');
const { appStoreLink, playStoreLink } = require('../components/growthLinks');

const SITE_URL = 'https://bsav0016.github.io/ACFTScoreCalculatorFrontend';
const ROOT = path.join(__dirname, '..');
const TABLES = path.join(ROOT, 'data', 'aft_tables_250601.json');

// Age groups, in the order of the table columns: column 1 + 2*i is "male or combat MOS", column 2 + 2*i is "female".
const AGE_GROUPS = ['17-21', '22-26', '27-31', '32-36', '37-41', '42-46', '47-51', '52-56', '57-61', '62 and older'];

const STANDARDS = [
  { key: 'male-combat', label: 'Male or combat MOS', inline: 'male or combat MOS', first: 1 },
  { key: 'female', label: 'Female, non-combat MOS', inline: 'female, non-combat MOS', first: 2 },
];

const EVENTS = [
  { key: 'deadlift', slug: 'deadlift', name: 'Maximum Deadlift', short: 'MDL', note: 'three-repetition maximum deadlift, in pounds' },
  { key: 'pushups', slug: 'hand-release-pushup', name: 'Hand-Release Push-Up', short: 'HRP', note: 'repetitions in two minutes (the app calls this T-Push Ups)' },
  { key: 'sdc', slug: 'sprint-drag-carry', name: 'Sprint-Drag-Carry', short: 'SDC', note: 'time in minutes and seconds, lower is better' },
  { key: 'plank', slug: 'plank', name: 'Plank', short: 'PLK', note: 'hold time in minutes and seconds' },
  { key: 'tmr', slug: 'two-mile-run', name: 'Two-Mile Run', short: '2MR', note: 'time in minutes and seconds, lower is better' },
];

const PASSING = 60;

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** '2026-07-07' -> '7 July 2026', built from the parts so no time zone can shift it. */
function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function formatValue(eventKey, value, unitKind) {
  if (value === null || value === undefined) return '&ndash;';
  if (unitKind === 'seconds') return `${Math.floor(value / 60)}:${pad(value % 60)}`;
  return String(value);
}

/** The pages' file stem for one event and standard, e.g. "deadlift-male-combat". */
const pageName = (event, standard) => `${event.slug}-${standard.key}`;

/**
 * What it takes to earn at least `points` in one column: among the rows at or above `points`, the most lenient result
 * that exists (a few rows are not strictly ordered). Blank cells are skipped. null when no row qualifies.
 */
function minimumFor(data, column, points) {
  let best = null;
  for (const row of data.rows) {
    if (row[0] < points) break;
    const value = row[column];
    if (value === null || value === undefined) continue;
    if (best === null || (data.higher_is_better ? value < best : value > best)) best = value;
  }
  return best;
}

function layout({ title, description, canonical, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="stylesheet" href="../style.css">
</head>
<body>
<main>
<nav><a href="../index.html">AFT Score Calculator</a><a href="index.html">Scoring charts</a><a href="../privacy.html">Privacy Policy</a></nav>
<article>
${body}
</article>
<footer>AFT Score Calculator by Savidge Apps. An independent tool, not affiliated with, endorsed by or sponsored by the U.S. Army or the Department of Defense.</footer>
</main>
</body>
</html>
`;
}

function appBox(campaign) {
  return `<div class="cta">
<h2>Score all five events in the app</h2>
<p>The free AFT Score Calculator adds your event scores into a total, plans what each event needs to reach a goal, and shows how you compare with other soldiers. It works offline.</p>
<p><a class="button" href="${esc(appStoreLink(campaign))}">Get it on the App Store</a> <a class="button" href="${esc(playStoreLink(campaign))}">Get it on Google Play</a></p>
</div>`;
}

function eventPage(tables, event, standard) {
  const data = tables.events[event.key];
  const unitKind = data.unit === 'seconds' ? 'seconds' : 'number';
  const name = pageName(event, standard);

  const minimums = AGE_GROUPS.map((group, i) => {
    const value = minimumFor(data, standard.first + 2 * i, PASSING);
    return `<tr><th scope="row">${esc(group)}</th><td>${formatValue(event.key, value, unitKind)}${unitKind === 'number' ? ` ${esc(data.unit)}` : ''}</td></tr>`;
  }).join('\n');

  const header = `<tr><th scope="col">Points</th>${AGE_GROUPS.map((g) => `<th scope="col">${esc(g)}</th>`).join('')}</tr>`;
  const rows = data.rows.map((row) => {
    const cells = AGE_GROUPS.map((_, i) => `<td>${formatValue(event.key, row[standard.first + 2 * i], unitKind)}</td>`).join('');
    return `<tr><th scope="row">${row[0]}</th>${cells}</tr>`;
  }).join('\n');

  const others = EVENTS.filter((e) => e !== event).map((e) => `<a href="${pageName(e, standard)}.html">${esc(e.name)}</a>`).join(', ');
  const otherStandard = STANDARDS.find((s) => s !== standard);

  const title = `AFT ${event.name} Scoring Chart, ${standard.label} | AFT Score Calculator`;
  const description = `${event.name} (${event.short}) points by age group for the ${standard.inline} standard: the result needed for each score from 0 to 100, and the minimum for ${PASSING} points. Standards effective 1 June 2025.`;
  const body = `<h1>AFT ${esc(event.name)} scoring chart: ${esc(standard.label)}</h1>
<p>Points for the Army Fitness Test ${esc(event.name)} (${esc(event.short)}), by age group, for the <strong>${esc(standard.inline)}</strong> standard. The event is measured as ${esc(event.note)}. Standards effective 1 June 2025, last checked ${esc(formatDate(tables.standards_as_of))}.</p>

<h2>Minimum for ${PASSING} points</h2>
<p>The least that still earns ${PASSING} points in each age group.</p>
<table class="chart narrow">
<thead><tr><th scope="col">Age group</th><th scope="col">Minimum for ${PASSING}</th></tr></thead>
<tbody>
${minimums}
</tbody>
</table>

${appBox(`web-${name}`)}

<h2>Full ${esc(event.name)} chart</h2>
<p>Find your age group, then read down to the first row whose result you reached. A dash means no result earns exactly that score for that age group.</p>
<div class="scroll">
<table class="chart">
<thead>${header}</thead>
<tbody>
${rows}
</tbody>
</table>
</div>

<h2>Other charts</h2>
<p>Same standard: ${others}.<br>
<a href="${pageName(event, otherStandard)}.html">${esc(event.name)} for ${esc(otherStandard.label)}</a> &middot; <a href="index.html">All scoring charts</a></p>`;

  return {
    file: `scoring/${name}.html`,
    html: layout({ title, description, canonical: `${SITE_URL}/scoring/${name}.html`, body }),
  };
}

function indexPage(tables) {
  const sections = STANDARDS.map((standard) => {
    const links = EVENTS.map((event) => `<li><a href="${pageName(event, standard)}.html">${esc(event.name)} (${esc(event.short)})</a></li>`).join('\n');
    return `<h2>${esc(standard.label)}</h2>\n<ul>\n${links}\n</ul>`;
  }).join('\n');

  const body = `<h1>AFT scoring charts</h1>
<p>Event-by-event scoring charts for the U.S. Army Fitness Test (AFT, formerly the ACFT), by age group, for both standards. Effective 1 June 2025, last checked ${esc(formatDate(tables.standards_as_of))}. Each chart lists the result needed for every score from 0 to 100 and the minimum for ${PASSING} points.</p>
${sections}
${appBox('web-scoring-index')}`;

  return {
    file: 'scoring/index.html',
    html: layout({
      title: 'AFT Scoring Charts by Event and Age Group | AFT Score Calculator',
      description: 'Army Fitness Test scoring charts for all five events, by age group, for the male or combat MOS standard and the female non-combat standard.',
      canonical: `${SITE_URL}/scoring/`,
      body,
    }),
  };
}

function sitemap(files) {
  const urls = ['', ...files.map((f) => f.file)].map((p) => `  <url><loc>${SITE_URL}/${p}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Every generated file as { file, html }, paths relative to site/. */
function buildAll(tables) {
  const pages = [indexPage(tables)];
  for (const event of EVENTS) {
    for (const standard of STANDARDS) pages.push(eventPage(tables, event, standard));
  }
  return [
    ...pages,
    { file: 'sitemap.xml', html: sitemap(pages) },
    { file: 'robots.txt', html: `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n` },
  ];
}

function main() {
  const tables = JSON.parse(fs.readFileSync(TABLES, 'utf8'));
  const check = process.argv.includes('--check');
  const stale = [];
  for (const { file, html } of buildAll(tables)) {
    const target = path.join(ROOT, 'site', file);
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n') : null;
    if (current === html) continue;
    stale.push(file);
    if (!check) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, html);
    }
  }
  if (check && stale.length) {
    console.error(`Out of date, run: node scripts/build-scoring-pages.js\n${stale.join('\n')}`);
    process.exit(1);
  }
  console.log(check ? 'Pages are up to date.' : `Wrote ${stale.length} file(s).`);
}

if (require.main === module) main();

module.exports = { AGE_GROUPS, STANDARDS, EVENTS, PASSING, minimumFor, buildAll, pageName, SITE_URL };
