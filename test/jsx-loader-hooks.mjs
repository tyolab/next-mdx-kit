// Custom ESM loader hook: transpiles JSX in plain .js files with esbuild.
// Needed because `tsx` maps the .js extension to esbuild's "js" loader
// (which rejects JSX syntax) and only treats .jsx/.tsx as JSX-capable —
// see investigation notes in the Task 7 report. This hook keeps the
// component source files as plain .js (as required) while still letting
// Node import and execute them for the test suite.
import { transform } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export async function load(url, context, nextLoad) {
  if (url.startsWith('file://') && url.endsWith('.js') && !url.includes('/node_modules/')) {
    const result = await nextLoad(url, context);
    const source = typeof result.source === 'string'
      ? result.source
      : result.source
        ? new TextDecoder().decode(result.source)
        : await readFile(fileURLToPath(url), 'utf8');
    const out = await transform(source, {
      loader: 'jsx',
      jsx: 'automatic',
      jsxImportSource: 'react',
      format: 'esm',
      sourcefile: url,
    });
    return { format: 'module', source: out.code, shortCircuit: true };
  }
  return nextLoad(url, context);
}
