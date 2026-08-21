import assert from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BarChart, DataTable } from '../src/charts/index.js';

// NOTE: prop shapes adjusted to match the ported src/charts/charts.js signatures:
// - BarChart: data = [{ label, value }], unit — matches the plan's original test as-is.
// - DataTable: columns is an array of header strings (not {key,label} objects),
//   and rows is an array of arrays (cells in column order), not row objects keyed
//   by column key. Adjusted from the plan's draft to the real signature.
assert.match(renderToStaticMarkup(React.createElement(BarChart, { data: [{ label: 'Banking', value: 28 }], unit: '%' })), /Banking/);
assert.match(renderToStaticMarkup(React.createElement(DataTable, { columns: ['A'], rows: [['x']] })), /x/);
console.log('charts: passed');
