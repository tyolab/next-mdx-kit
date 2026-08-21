import assert from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Hero, FeatureGrid, Feature, Button, CTASection } from '../src/marketing/layout.js';

const html = (el) => renderToStaticMarkup(el);
assert.match(html(React.createElement(Hero, { title: 'T', subtitle: 'S' })), /T.*S/s);
assert.match(html(React.createElement(Feature, { title: 'F' }, 'body')), /F.*body/s);
assert.match(html(React.createElement(FeatureGrid, null, 'x')), /lp-features/);
assert.match(html(React.createElement(Button, { href: '/x' }, 'Go')), /lp-btn/);
assert.match(html(React.createElement(CTASection, { title: 'C' }, 'k')), /lp-cta/);
console.log('marketing: passed');
