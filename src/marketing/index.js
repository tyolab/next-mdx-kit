export * from './layout.js';
export * from './content.js';
export { SectionHeading } from '../components/primitives.js'; // canonical

import * as layout from './layout.js';
import * as content from './content.js';
import { SectionHeading } from '../components/primitives.js';

export const marketingComponents = { ...layout, ...content, SectionHeading };
