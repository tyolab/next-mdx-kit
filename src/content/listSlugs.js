import { listLocalizedSlugs } from '@tyolab/next-mdx-i18n';

/** Slugs available in a collection for a locale (locale ∪ default). */
export function listSlugs(cfg, { collection = '', locale = cfg.defaultLocale }) {
  return listLocalizedSlugs(cfg, { locale, collection });
}
