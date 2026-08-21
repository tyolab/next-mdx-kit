import { createContext } from 'react';
// 0 = top level; >0 = inside a rehypeSections-wrapped section.
export const SectionDepthContext = createContext(0);
