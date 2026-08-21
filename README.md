# @tyolab/next-mdx-kit

Shared MDX rendering kit for TYO's Next.js **pages-router** sites — the content
loader, render plumbing, base components, a data-viz charts kit, and the
first-party analytics beacon, in one config-driven module.

It's a sibling to (and depends on) [`@tyolab/next-mdx-i18n`](https://github.com/tyolab/next-mdx-i18n).
**The kit ships no content** — each app owns its content files, locale config, and backend.

## Install

```jsonc
// package.json
{
  "dependencies": {
    "@tyolab/next-mdx-kit": "github:tyolab/next-mdx-kit#v0.1.0"
  }
}
```

> **⚠️ Required Next.js config.** The kit ships its React components as source `.js`
> files containing JSX (no build step). Next.js does **not** transpile `node_modules`
> by default, so you MUST add the package to `transpilePackages` or `next build` fails
> with `SyntaxError: Unexpected token '<'`:
>
> ```js
> // next.config.js  (or next.config.mjs)
> export default {
>   transpilePackages: ['@tyolab/next-mdx-kit'],
> };
> ```

Peer deps your app already has: `next`, `react`, `react-dom`, `gray-matter`, `next-mdx-remote`.

## Entry points

| Import | Contains |
| --- | --- |
| `@tyolab/next-mdx-kit` | content loader (`loadMdx`, `listSlugs`, docs helpers, `getPosts`/`getPostById`/`buildPost`), render plumbing (`rehypeSections`, `rehypePreRaw`, `createComponentMap`), base components (`Prose`, `Callout`, `StatGrid`, `Stat`, `SectionHeading`, `Figure`, `Pre`, `SectionDepthProvider`) + `baseComponents` map |
| `@tyolab/next-mdx-kit/charts` | `BarChart`, `StackedBar`, `Donut`, `DataTable`, `CardGrid`, `ArticleCard`, `Figure` |
| `@tyolab/next-mdx-kit/track` | `track` — cookieless page-view beacon (override endpoint via `NEXT_PUBLIC_TRACK_ENDPOINT`) |
| `@tyolab/next-mdx-kit/tokens.css` | default CSS custom properties (import once; override any var) |

## Usage

```jsx
// pages/_app.js — load default tokens once (override any --color-* in your own CSS)
import '@tyolab/next-mdx-kit/tokens.css';

// pages/[slug].js
import { MDXRemote } from 'next-mdx-remote';
import { loadMdx, baseComponents, createComponentMap } from '@tyolab/next-mdx-kit';
import * as charts from '@tyolab/next-mdx-kit/charts';
import { i18nConfig } from '@/lib/i18n';           // your app's config
import MyComponent from '@/components/MyComponent'; // app-specific components

const components = createComponentMap(baseComponents, { ...charts, MyComponent });

export default function Page({ mdxSource }) {
  return <MDXRemote {...mdxSource} components={components} />;
}

export async function getStaticProps({ params, locale }) {
  const { mdxSource, frontmatter } = await loadMdx(i18nConfig, {
    collection: '', slug: params.slug, locale, sections: true,
  });
  return { props: { mdxSource, frontmatter } };
}
```

`createComponentMap(base, overrides)` merges your app components over the kit's base
map (app keys win), so you can add or replace any component.

## Theming

Components are self-contained: every colour reads a CSS custom property with a hard-coded
fallback, so they render correctly with zero CSS wiring and re-theme when you set the vars.

| Token | Default |
| --- | --- |
| `--color-primary` | `#2563eb` |
| `--color-muted` | `#64748b` |
| `--color-border` | `#e2e8f0` |
| `--color-bg` | `#ffffff` |
| `--color-surface` | `#f8fafc` |
| `--color-text` | `#0f172a` |
| `--color-code-bg` | `#0f172a` |
| `--color-accent` | `#7c3aed` |
| `--nmk-chart-ai` / `-chat` / `-human` / `-none` | chart series colours |

## Content model

`loadMdx(cfg, { collection, slug, locale, sections, mdxOptions })` wraps
`@tyolab/next-mdx-i18n`'s localized resolution (English fallback). `sections: true`
enables `rehypeSections`, which wraps `##` headings into full-width sections. Docs helpers
(`getDocSlugs`, `getDocsNav`, `getFaqItems`) read per-file frontmatter (`category`, `order`).
File-based blogs use `getPosts` / `getPostById`; CMS-sourced bodies use `buildPost(source)`.

## Tests

```bash
npm test   # runs the framework-free Node suite through a JSX-aware loader
```

## Status

`v0.1.0` — foundation. The reach marketing component kit (`Hero`, `FeatureGrid`,
`UseCaseHero`, `FAQ`, `Compare*`, `CTASection`, …) lands as `@tyolab/next-mdx-kit/marketing`
in a later minor version.

MIT © TYO Lab
