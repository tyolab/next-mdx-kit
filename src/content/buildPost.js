import { serialize } from 'next-mdx-remote/serialize';
import { rehypePreRaw } from '../render/rehypePreRaw.js';

// fs-free: serialize a raw MDX string (for CMS-sourced bodies). App may add
// plugins via mdxOptions. Kept in its own module (no node:fs/path imports) so
// consumers can import it — via the `@tyolab/next-mdx-kit/build` subpath —
// without dragging the file-system loaders into their bundle.
//
// blockJS defaults to FALSE: next-mdx-remote's serialize strips JS expressions
// by default, which silently drops MDX component *expression props* (e.g.
// `<Donut data={[...]} />` → data becomes undefined). Component MDX needs them,
// so we opt out by default. Pass blockJS: true to sandbox untrusted content.
export async function buildPost(source, { mdxOptions = {}, blockJS = false } = {}) {
  return serialize(source, {
    blockJS,
    mdxOptions: {
      remarkPlugins: mdxOptions.remarkPlugins || [],
      rehypePlugins: [rehypePreRaw, ...(mdxOptions.rehypePlugins || [])],
    },
  });
}
