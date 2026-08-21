import remarkGfm from 'remark-gfm';
import { getLocalizedMdx } from '@tyolab/next-mdx-i18n';
import { rehypeSections } from '../render/rehypeSections.js';

/**
 * Load + serialize a localized MDX page (English-fallback via next-mdx-i18n).
 * @param cfg i18nConfig ({ contentDir, defaultLocale, ... })
 * @param opts { collection?, slug, locale?, sections?, mdxOptions? }
 * @returns { frontmatter, mdxSource, resolvedLocale }
 */
export async function loadMdx(cfg, { collection = '', slug, locale = cfg.defaultLocale, sections = false, mdxOptions = {} }) {
  const result = await getLocalizedMdx(cfg, {
    locale,
    collection,
    slug,
    mdxOptions: {
      remarkPlugins: [remarkGfm, ...(mdxOptions.remarkPlugins || [])],
      rehypePlugins: [...(sections ? [rehypeSections] : []), ...(mdxOptions.rehypePlugins || [])],
    },
  });
  if (!result) throw new Error(`No MDX for ${collection || '.'}/${slug} (locale ${locale})`);
  return result;
}
