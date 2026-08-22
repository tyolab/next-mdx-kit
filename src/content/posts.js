import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { buildPost } from './buildPost.js';

export { buildPost };

/** List posts in a directory (flat), newest first, with frontmatter (date from frontmatter or mtime). */
export function getPosts(postsDir) {
  const dir = path.resolve(postsDir);
  const items = [];
  for (const fileName of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(fileName)) continue;
    if (fileName === 'index.mdx') continue;
    const id = fileName.replace(/\.mdx?$/, '');
    const full = path.join(dir, fileName);
    const { data } = matter(fs.readFileSync(full, 'utf8'));
    let date = data.date ? new Date(data.date) : fs.statSync(full).mtime;
    items.push({ id, slug: id, ...data, date: date.toISOString() });
  }
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Load one post by slug from a directory; returns { mdxSource, frontmatter }. */
export async function getPostById(slug, postsDir, { mdxOptions = {} } = {}) {
  const dir = path.resolve(postsDir);
  const full = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(full)) throw new Error(`Post not found: ${full}`);
  const { content, data } = matter(fs.readFileSync(full, 'utf8'));
  const mdxSource = await buildPost(content, { mdxOptions });
  return { mdxSource, frontmatter: { slug, ...data } };
}
