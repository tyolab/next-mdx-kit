import { serialize } from 'next-mdx-remote/serialize';
import { rehypePreRaw } from '../render/rehypePreRaw.js';

// fs-free: serialize a raw MDX string (for CMS-sourced bodies). App may add
// plugins via mdxOptions. Kept in its own module (no node:fs/path imports) so
// consumers can import it — via the `@tyolab/next-mdx-kit/build` subpath —
// without dragging the file-system loaders into their bundle. This matters for
// webpack/static-export apps whose config doesn't handle server-only fs code.
export async function buildPost(source, { mdxOptions = {} } = {}) {
  return serialize(source, {
    mdxOptions: {
      remarkPlugins: mdxOptions.remarkPlugins || [],
      rehypePlugins: [rehypePreRaw, ...(mdxOptions.rehypePlugins || [])],
    },
  });
}
