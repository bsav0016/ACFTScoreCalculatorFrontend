import fs from 'fs';
import path from 'path';
import { EVENTS as APP_EVENTS, columnFor, rawNeeded } from '../components/Calculator/aftScoring';

const { AGE_GROUPS, STANDARDS, EVENTS, PASSING, minimumFor, buildAll, pageName } = require('../scripts/build-scoring-pages');
const { appStoreLink, playStoreLink } = require('../scripts/growthLinks');

const tables = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'aft_tables_250601.json'), 'utf8'));
const generated = buildAll(tables);

test('the committed pages are exactly what the generator produces from the shared tables', () => {
  for (const { file, html } of generated) {
    const committed = fs.readFileSync(path.join(__dirname, '..', 'site', file), 'utf8').replace(/\r\n/g, '\n');
    expect({ file, same: committed === html }).toEqual({ file, same: true });
  }
});

test('every event and standard has a page, plus the index, sitemap and robots.txt', () => {
  const files = generated.map((g) => g.file);
  expect(files).toHaveLength(EVENTS.length * STANDARDS.length + 3);
  for (const event of EVENTS) for (const standard of STANDARDS) expect(files).toContain(`scoring/${pageName(event, standard)}.html`);
  expect(files).toEqual(expect.arrayContaining(['scoring/index.html', 'sitemap.xml', 'robots.txt']));
});

// The "minimum for 60" shown on the pages must be what the app's goal planner says, for every event, age and standard.
test('the 60-point minimums match the app\'s own reverse lookup', () => {
  const ages = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65];
  for (const appEvent of APP_EVENTS) {
    const data = tables.events[appEvent.key];
    STANDARDS.forEach((standard, s) => {
      ages.forEach((age, i) => {
        const column = columnFor(age, s === 0);
        expect(column).toBe(standard.first + 2 * i);
        const page = minimumFor(data, standard.first + 2 * i, PASSING);
        const app = rawNeeded(appEvent, PASSING, column).raw;
        const appUnits = appEvent.kind === 'time' ? Math.round(app * 60) : app;
        expect({ event: appEvent.key, age, standard: standard.key, value: page }).toEqual({ event: appEvent.key, age, standard: standard.key, value: appUnits });
      });
    });
  }
});

test('every table cell is on its page, and nothing is invented', () => {
  for (const event of EVENTS) {
    const data = tables.events[event.key];
    for (const standard of STANDARDS) {
      const html = generated.find((g) => g.file === `scoring/${pageName(event, standard)}.html`).html;
      const body = html.slice(html.indexOf('<h2>Full'));
      const cells = [...body.matchAll(/<td>([^<]*)<\/td>/g)].length;
      expect(cells).toBe(data.rows.length * AGE_GROUPS.length);
    }
  }
});

test('pages carry the disclaimer, a canonical link and a tagged store link', () => {
  for (const { file, html } of generated.filter((g) => g.file.endsWith('.html'))) {
    expect(html).toContain('not affiliated with, endorsed by or sponsored by the U.S. Army');
    expect(html).toContain('rel="canonical"');
    expect(html).toMatch(/apps\.apple\.com[^"]*ct=web-/);
    expect(html).toMatch(/play\.google\.com[^"]*referrer=utm_source%3Dweb-/);
    expect(html).not.toMatch(/\[[A-Z]{3,}[^\]]*\]/);
    expect(file).toBeTruthy();
  }
});

test('campaign names are checked', () => {
  expect(appStoreLink('web-test')).toContain('ct=web-test');
  expect(playStoreLink('web-test')).toContain('utm_campaign%3Dweb-test');
  expect(() => appStoreLink('Bad Name')).toThrow();
  expect(() => playStoreLink('a'.repeat(41))).toThrow();
});
