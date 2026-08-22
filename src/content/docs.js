import fs from 'fs';
import matter from 'gray-matter';
import { listLocalizedSlugs, resolveContentFile } from '@tyolab/next-mdx-i18n';
import { loadMdx } from './loadMdx.js';

/** All doc slugs except the overview ('index'). */
export function getDocSlugs(cfg, locale = cfg.defaultLocale) {
  return listLocalizedSlugs(cfg, { locale, collection: 'docs' }).filter((s) => s !== 'index');
}

/** Grouped, ordered sidebar nav from each doc's frontmatter. */
export function getDocsNav(cfg, locale = cfg.defaultLocale) {
  const docs = getDocSlugs(cfg, locale).map((slug) => {
    const file = resolveContentFile(cfg, { locale, collection: 'docs', slug });
    const { data } = matter(fs.readFileSync(file, 'utf8'));
    return {
      slug,
      title: data.title || slug,
      category: data.category || 'Docs',
      order: typeof data.order === 'number' ? data.order : 9999,
    };
  });
  const groups = new Map();
  for (const doc of docs) {
    if (!groups.has(doc.category)) groups.set(doc.category, []);
    groups.get(doc.category).push(doc);
  }
  const nav = [...groups.entries()].map(([category, items]) => {
    items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    return { category, minOrder: items[0].order, items: items.map(({ slug, title }) => ({ slug, title })) };
  });
  nav.sort((a, b) => a.minOrder - b.minOrder || a.category.localeCompare(b.category));
  return nav.map(({ category, items }) => ({ category, items }));
}

/** Markdown/MDX → plain text (for FAQ schema answer text). */
export function mdToText(md) {
  return md
    .replace(/<Callout[\s\S]*?<\/Callout>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract { question, answer } pairs from an FAQ-style doc (### heading = question). */
export function getFaqItems(cfg, { slug, locale = cfg.defaultLocale }) {
  const file = resolveContentFile(cfg, { locale, collection: 'docs', slug });
  const { content } = matter(fs.readFileSync(file, 'utf8'));
  const items = [];
  let question = null;
  let buffer = [];
  const flush = () => {
    if (question) {
      const answer = mdToText(buffer.join('\n'));
      if (answer) items.push({ question, answer });
    }
    buffer = [];
  };
  for (const line of content.split('\n')) {
    const h3 = /^###\s+(.*)$/.exec(line);
    if (h3) { flush(); question = h3[1].trim(); }
    else if (/^#{1,2}\s+/.test(line)) { flush(); question = null; }
    else if (question) { buffer.push(line); }
  }
  flush();
  return items;
}

/** Load a single doc page. */
export function getDoc(cfg, { slug, locale = cfg.defaultLocale }) {
  return loadMdx(cfg, { collection: 'docs', slug, locale, sections: false });
}

/** Load the docs overview ('index') page. */
export function getDocsOverview(cfg, { locale = cfg.defaultLocale } = {}) {
  return loadMdx(cfg, { collection: 'docs', slug: 'index', locale });
}
