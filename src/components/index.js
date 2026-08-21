export { SectionDepthContext } from './context.js';
export { SectionDepthProvider, Prose, SectionHeading, StatGrid, Stat, Callout, Figure } from './primitives.js';
export { Pre } from './Pre.js';

import { SectionDepthProvider, Prose, SectionHeading, StatGrid, Stat, Callout, Figure } from './primitives.js';
import { Pre } from './Pre.js';

// Base component map to spread into MDXRemote (merge with app overrides via createComponentMap).
export const baseComponents = {
  pre: Pre,
  SectionDepthProvider, Prose, SectionHeading, StatGrid, Stat, Callout, Figure,
};
