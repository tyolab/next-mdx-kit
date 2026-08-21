import assert from 'node:assert';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { getPosts, getPostById } from '../src/content/posts.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-p-'));
fs.writeFileSync(path.join(tmp, 'old.mdx'), '---\ntitle: Old\ndate: 2020-01-01\n---\n# Old');
fs.writeFileSync(path.join(tmp, 'new.mdx'), '---\ntitle: New\ndate: 2024-01-01\n---\n# New');
const posts = getPosts(tmp);
assert.deepStrictEqual(posts.map(p => p.slug), ['new', 'old']);
const one = await getPostById('new', tmp);
assert.strictEqual(one.frontmatter.title, 'New');
assert.ok(one.mdxSource.compiledSource, 'serialized');
console.log('content-posts: passed');
