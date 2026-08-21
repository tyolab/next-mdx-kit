import assert from 'node:assert';
import { rehypePreRaw, createComponentMap } from '../src/render/index.js';

// createComponentMap: overrides win
assert.deepStrictEqual(createComponentMap({ a: 1, b: 2 }, { b: 9, c: 3 }), { a: 1, b: 9, c: 3 });

// rehypePreRaw: copies code text onto pre.properties.raw
const tree = { type: 'root', children: [
  { type: 'element', tagName: 'pre', children: [
    { type: 'element', tagName: 'code', children: [{ type: 'text', value: 'echo hi' }] },
  ] },
]};
rehypePreRaw()(tree);
assert.strictEqual(tree.children[0].properties.raw, 'echo hi');
console.log('render: passed');
