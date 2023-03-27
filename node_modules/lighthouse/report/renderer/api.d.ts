/**
 * @param {LH.Result} lhr
 * @param {LH.Renderer.Options} opts
 * @return {HTMLElement}
 */
export function renderReport(lhr: LH.Result, opts?: LH.Renderer.Options): HTMLElement;
/**
 * @param {LH.ReportResult.Category} category
 * @param {Parameters<CategoryRenderer['renderCategoryScore']>[2]=} options
 * @return {DocumentFragment}
 */
export function renderCategoryScore(category: LH.ReportResult.Category, options?: [category: import("../types/report-result.js").default.Category, groupDefinitions: Record<string, import("../../types/lhr/lhr.js").default.ReportGroup>, options?: {
    gatherMode: import("../../types/lhr/lhr.js").default.GatherMode;
    omitLabel?: boolean | undefined;
    onPageAnchorRendered?: ((link: HTMLAnchorElement) => void) | undefined;
} | undefined][2] | undefined): DocumentFragment;
/**
 * @param {Blob} blob
 * @param {string} filename
 */
export function saveFile(blob: Blob, filename: string): void;
/**
 * @param {string} markdownText
 * @return {Element}
 */
export function convertMarkdownCodeSnippets(markdownText: string): Element;
/**
 * @return {DocumentFragment}
 */
export function createStylesElement(): DocumentFragment;
//# sourceMappingURL=api.d.ts.map