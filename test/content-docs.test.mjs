import assert from 'node:assert';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { getDocSlugs, getDocsNav, getFaqItems } from '../src/content/docs.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-d-'));
const contentDir = path.join(tmp, 'content');
fs.mkdirSync(path.join(contentDir, 'en/docs'), { recursive: true });
const w = (slug, body) => fs.writeFileSync(path.join(contentDir, 'en/docs', slug + '.mdx'), body);
w('index', '---\ntitle: Overview\n---\n# Docs');
w('setup', '---\ntitle: Setup\ncategory: Start\norder: 1\n---\n# Setup');
w('faq', '---\ntitle: FAQ\ncategory: Account\norder: 2\n---\n# FAQ\n\n### What is X?\n\nX is a thing.\n\n### Cost?\n\nFree.');
w('billing', '---\ntitle: Billing\ncategory: Account\norder: 3\n---\n# Billing');
const cfg = { contentDir, defaultLocale: 'en' };

assert.deepStrictEqual(getDocSlugs(cfg).sort(), ['billing', 'faq', 'setup']);
const nav = getDocsNav(cfg);
assert.strictEqual(nav[0].category, 'Start');
assert.strictEqual(nav[1].category, 'Account');
assert.deepStrictEqual(nav[1].items.map(i => i.slug), ['faq', 'billing']);
const faq = getFaqItems(cfg, { slug: 'faq' });
assert.deepStrictEqual(faq, [{ question: 'What is X?', answer: 'X is a thing.' }, { question: 'Cost?', answer: 'Free.' }]);
console.log('content-docs: passed');
