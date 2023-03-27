/**
 * Render snippet of text with line numbers and annotations.
 * By default we only show a few lines around each annotation and the user
 * can click "Expand snippet" to show more.
 * Content lines with annotations are highlighted.
 */
export class SnippetRenderer {
    /**
     * @param {DOM} dom
     * @param {LH.Audit.Details.SnippetValue} details
     * @param {DetailsRenderer} detailsRenderer
     * @param {function} toggleExpandedFn
     * @return {DocumentFragment}
     */
    static renderHeader(dom: DOM, details: LH.Audit.Details.SnippetValue, detailsRenderer: DetailsRenderer, toggleExpandedFn: Function): DocumentFragment;
    /**
     * Renders a line (text content, message, or placeholder) as a DOM element.
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {LineDetails} lineDetails
     * @return {Element}
     */
    static renderSnippetLine(dom: DOM, tmpl: DocumentFragment, { content, lineNumber, truncated, contentType, visibility }: LineDetails): Element;
    /**
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {{message: string}} message
     * @return {Element}
     */
    static renderMessage(dom: DOM, tmpl: DocumentFragment, message: {
        message: string;
    }): Element;
    /**
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {LineVisibility} visibility
     * @return {Element}
     */
    static renderOmittedLinesPlaceholder(dom: DOM, tmpl: DocumentFragment, visibility: LineVisibility): Element;
    /**
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {LH.Audit.Details.SnippetValue} details
     * @return {DocumentFragment}
     */
    static renderSnippetContent(dom: DOM, tmpl: DocumentFragment, details: LH.Audit.Details.SnippetValue): DocumentFragment;
    /**
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {LH.Audit.Details.SnippetValue} details
     * @return {DocumentFragment}
     */
    static renderSnippetLines(dom: DOM, tmpl: DocumentFragment, details: LH.Audit.Details.SnippetValue): DocumentFragment;
    /**
     * @param {DOM} dom
     * @param {LH.Audit.Details.SnippetValue} details
     * @param {DetailsRenderer} detailsRenderer
     * @return {!Element}
     */
    static render(dom: DOM, details: LH.Audit.Details.SnippetValue, detailsRenderer: DetailsRenderer): Element;
}
export type DetailsRenderer = import('./details-renderer').DetailsRenderer;
export type DOM = import('./dom').DOM;
export type LineDetails = {
    content: string;
    lineNumber: string | number;
    contentType: LineContentType;
    truncated?: boolean;
    visibility?: LineVisibility;
};
type LineVisibility = number;
declare namespace LineVisibility {
    const ALWAYS: number;
    const WHEN_COLLAPSED: number;
    const WHEN_EXPANDED: number;
}
type LineContentType = number;
declare namespace LineContentType {
    const CONTENT_NORMAL: number;
    const CONTENT_HIGHLIGHTED: number;
    const PLACEHOLDER: number;
    const MESSAGE: number;
}
export {};
//# sourceMappingURL=snippet-renderer.d.ts.map