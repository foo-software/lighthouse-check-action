export type DOM = import('./dom.js').DOM;
export type DetailsRenderer = import('./details-renderer.js').DetailsRenderer;
export type CRCSegment = {
    node: LH.Audit.Details.SimpleCriticalRequestNode[string];
    isLastChild: boolean;
    hasChildren: boolean;
    startTime: number;
    transferSize: number;
    treeMarkers: boolean[];
};
/** @typedef {import('./dom.js').DOM} DOM */
/** @typedef {import('./details-renderer.js').DetailsRenderer} DetailsRenderer */
/**
 * @typedef CRCSegment
 * @property {LH.Audit.Details.SimpleCriticalRequestNode[string]} node
 * @property {boolean} isLastChild
 * @property {boolean} hasChildren
 * @property {number} startTime
 * @property {number} transferSize
 * @property {boolean[]} treeMarkers
 */
export class CriticalRequestChainRenderer {
    /**
     * Create render context for critical-request-chain tree display.
     * @param {LH.Audit.Details.SimpleCriticalRequestNode} tree
     * @return {{tree: LH.Audit.Details.SimpleCriticalRequestNode, startTime: number, transferSize: number}}
     */
    static initTree(tree: LH.Audit.Details.SimpleCriticalRequestNode): {
        tree: LH.Audit.Details.SimpleCriticalRequestNode;
        startTime: number;
        transferSize: number;
    };
    /**
     * Helper to create context for each critical-request-chain node based on its
     * parent. Calculates if this node is the last child, whether it has any
     * children itself and what the tree looks like all the way back up to the root,
     * so the tree markers can be drawn correctly.
     * @param {LH.Audit.Details.SimpleCriticalRequestNode} parent
     * @param {string} id
     * @param {number} startTime
     * @param {number} transferSize
     * @param {Array<boolean>=} treeMarkers
     * @param {boolean=} parentIsLastChild
     * @return {CRCSegment}
     */
    static createSegment(parent: LH.Audit.Details.SimpleCriticalRequestNode, id: string, startTime: number, transferSize: number, treeMarkers?: Array<boolean> | undefined, parentIsLastChild?: boolean | undefined): CRCSegment;
    /**
     * Creates the DOM for a tree segment.
     * @param {DOM} dom
     * @param {CRCSegment} segment
     * @param {DetailsRenderer} detailsRenderer
     * @return {Node}
     */
    static createChainNode(dom: DOM, segment: CRCSegment, detailsRenderer: DetailsRenderer): Node;
    /**
     * Recursively builds a tree from segments.
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {CRCSegment} segment
     * @param {Element} elem Parent element.
     * @param {LH.Audit.Details.CriticalRequestChain} details
     * @param {DetailsRenderer} detailsRenderer
     */
    static buildTree(dom: DOM, tmpl: DocumentFragment, segment: CRCSegment, elem: Element, details: LH.Audit.Details.CriticalRequestChain, detailsRenderer: DetailsRenderer): void;
    /**
     * @param {DOM} dom
     * @param {LH.Audit.Details.CriticalRequestChain} details
     * @param {DetailsRenderer} detailsRenderer
     * @return {Element}
     */
    static render(dom: DOM, details: LH.Audit.Details.CriticalRequestChain, detailsRenderer: DetailsRenderer): Element;
}
//# sourceMappingURL=crc-details-renderer.d.ts.map