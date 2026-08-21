import assert from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Prose, Callout, StatGrid, Stat, Figure, Pre, baseComponents } from '../src/components/index.js';

const html = (el) => renderToStaticMarkup(el);
assert.match(html(React.createElement(Prose, null, 'hi')), /hi/);
assert.match(html(React.createElement(Callout, { type: 'tip', title: 'T' }, 'body')), /T.*body/s);
assert.match(html(React.createElement(Stat, { value: '9', label: 'L' })), /9.*L/s);
assert.match(html(React.createElement(StatGrid, null, 'x')), /x/);
assert.match(html(React.createElement(Figure, { title: 'F' }, 'c')), /F.*c/s);
assert.match(html(React.createElement(Pre, { raw: 'echo' }, 'echo')), /Copy/);
assert.ok(baseComponents.pre && baseComponents.Callout, 'baseComponents populated');
console.log('components: passed');
