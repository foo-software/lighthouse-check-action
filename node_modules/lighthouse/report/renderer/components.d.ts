/** @typedef {'3pFilter'|'audit'|'categoryHeader'|'chevron'|'clump'|'crc'|'crcChain'|'elementScreenshot'|'explodeyGauge'|'footer'|'fraction'|'gauge'|'heading'|'metric'|'scorescale'|'scoresWrapper'|'snippet'|'snippetContent'|'snippetHeader'|'snippetLine'|'styles'|'topbar'|'warningsToplevel'} ComponentName */
/**
 * @param {DOM} dom
 * @param {ComponentName} componentName
 * @return {DocumentFragment}
 */
export function createComponent(dom: DOM, componentName: ComponentName): DocumentFragment;
export type DOM = import('./dom.js').DOM;
export type ComponentName = '3pFilter' | 'audit' | 'categoryHeader' | 'chevron' | 'clump' | 'crc' | 'crcChain' | 'elementScreenshot' | 'explodeyGauge' | 'footer' | 'fraction' | 'gauge' | 'heading' | 'metric' | 'scorescale' | 'scoresWrapper' | 'snippet' | 'snippetContent' | 'snippetHeader' | 'snippetLine' | 'styles' | 'topbar' | 'warningsToplevel';
//# sourceMappingURL=components.d.ts.map