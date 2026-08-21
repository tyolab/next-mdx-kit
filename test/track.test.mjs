import assert from 'node:assert';
const mod = await import('../src/track.js');
// track.js guards on typeof window; importing under Node must not throw.
assert.ok(mod, 'track module imports');
console.log('track: passed');
