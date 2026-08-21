import assert from 'node:assert';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { loadMdx } from '../src/content/loadMdx.js';
import { listSlugs } from '../src/content/listSlugs.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-c-'));
const contentDir = path.join(tmp, 'content');
fs.mkdirSync(path.join(contentDir, 'en/docs'), { recursive: true });
fs.writeFileSync(path.join(contentDir, 'en/docs/a.mdx'), '---\ntitle: A\n---\n# A\n\nHello');
const cfg = { contentDir, defaultLocale: 'en' };

const r = await loadMdx(cfg, { collection: 'docs', slug: 'a', locale: 'en' });
assert.strictEqual(r.frontmatter.title, 'A');
assert.ok(r.mdxSource && r.mdxSource.compiledSource, 'serialized output present');
assert.deepStrictEqual(listSlugs(cfg, { collection: 'docs', locale: 'en' }), ['a']);
console.log('content-load: passed');
