// (Ported verbatim from reach.tyo.com.au/lib/mdx.js)
export function rehypeSections() {
  return (tree) => {
    if (!tree.children) return;

    const wrapProvider = (depth, index, children) => ({
      type: 'mdxJsxFlowElement',
      name: 'SectionDepthProvider',
      attributes: [
        { type: 'mdxJsxAttribute', name: 'depth', value: String(depth) },
        { type: 'mdxJsxAttribute', name: 'index', value: String(index || 0) },
      ],
      children: children || [],
    });

    const nextSignificant = (children, start) => {
      let j = start;
      while (j < children.length && children[j].type === 'text' && /^\s*$/.test(children[j].value)) j++;
      return j;
    };

    const makeHeader = (h2, h3, subP) => {
      const children = [];
      if (h3) {
        children.push({
          type: 'element', tagName: 'div',
          properties: { className: ['lp-section-eyebrow'] },
          children: h2.children,
        });
        children.push({
          type: 'element', tagName: 'h2',
          properties: { className: ['lp-section-title'] },
          children: h3.children,
        });
      } else {
        children.push({
          type: 'element', tagName: 'h2',
          properties: { className: ['lp-section-title'] },
          children: h2.children,
        });
      }
      if (subP) {
        children.push({
          type: 'element', tagName: 'p',
          properties: { className: ['lp-section-sub'] },
          children: subP.children,
        });
      }
      return {
        type: 'element', tagName: 'div',
        properties: { className: ['lp-section-header'] },
        children,
      };
    };

    const wrappedChildren = [];
    let i = 0;
    let sectionIndex = 0;
    while (i < tree.children.length) {
      const child = tree.children[i];
      if (child.type === 'element' && child.tagName === 'h2') {
        sectionIndex++;
        const h2 = child;
        let h3 = null;
        let subP = null;
        let j = nextSignificant(tree.children, i + 1);
        if (j < tree.children.length && tree.children[j].type === 'element' && tree.children[j].tagName === 'h3') {
          h3 = tree.children[j];
          j = nextSignificant(tree.children, j + 1);
        }
        if (j < tree.children.length && tree.children[j].type === 'element' && tree.children[j].tagName === 'p') {
          subP = tree.children[j];
          j = nextSignificant(tree.children, j + 1);
        }
        const body = [];
        while (j < tree.children.length) {
          const sibling = tree.children[j];
          if (sibling.type === 'element' && sibling.tagName === 'h2') break;
          body.push(sibling);
          j++;
        }
        wrappedChildren.push(wrapProvider(1, sectionIndex, [makeHeader(h2, h3, subP), ...body]));
        i = j;
      } else {
        wrappedChildren.push(child);
        i++;
      }
    }

    tree.children = [wrapProvider(0, 0, wrappedChildren)];
  };
}
