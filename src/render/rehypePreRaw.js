import { visit } from 'unist-util-visit';

// Capture the raw source of each fenced code block onto pre.properties.raw,
// so the Pre component can offer a "copy" button. Safe to run after any
// syntax-highlight plugin.
export function rehypePreRaw() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'pre') return;
      const code = node.children?.find((c) => c.tagName === 'code');
      const raw = code?.children?.[0]?.value;
      if (typeof raw === 'string') {
        node.properties = node.properties || {};
        node.properties.raw = raw;
      }
    });
  };
}
