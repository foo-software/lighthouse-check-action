export class CategoryRenderer {
    /**
     * @param {DOM} dom
     * @param {DetailsRenderer} detailsRenderer
     */
    constructor(dom: DOM, detailsRenderer: DetailsRenderer);
    /** @type {DOM} */
    dom: DOM;
    /** @type {DetailsRenderer} */
    detailsRenderer: DetailsRenderer;
    /**
     * Display info per top-level clump. Define on class to avoid race with Util init.
     */
    get _clumpTitles(): {
        warning: string;
        manual: string;
        passed: string;
        notApplicable: string;
    };
    /**
     * @param {LH.ReportResult.AuditRef} audit
     * @return {HTMLElement}
     */
    renderAudit(audit: LH.ReportResult.AuditRef): HTMLElement;
    /**
     * Inject the final screenshot next to the score gauge of the first category (likely Performance)
     * @param {HTMLElement} categoriesEl
     * @param {LH.ReportResult['audits']} audits
     * @param {Element} scoreScaleEl
     */
    injectFinalScreenshot(categoriesEl: HTMLElement, audits: LH.ReportResult['audits'], scoreScaleEl: Element): null | undefined;
    /**
     * @return {Element}
     */
    _createChevron(): Element;
    /**
     * @param {Element} element DOM node to populate with values.
     * @param {number|null} score
     * @param {string} scoreDisplayMode
     * @return {!Element}
     */
    _setRatingClass(element: Element, score: number | null, scoreDisplayMode: string): Element;
    /**
     * @param {LH.ReportResult.Category} category
     * @param {Record<string, LH.Result.ReportGroup>} groupDefinitions
     * @param {{gatherMode: LH.Result.GatherMode}=} options
     * @return {DocumentFragment}
     */
    renderCategoryHeader(category: LH.ReportResult.Category, groupDefinitions: Record<string, LH.Result.ReportGroup>, options?: {
        gatherMode: LH.Result.GatherMode;
    } | undefined): DocumentFragment;
    /**
     * Renders the group container for a group of audits. Individual audit elements can be added
     * directly to the returned element.
     * @param {LH.Result.ReportGroup} group
     * @return {[Element, Element | null]}
     */
    renderAuditGroup(group: LH.Result.ReportGroup): [Element, Element | null];
    /**
     * Takes an array of auditRefs, groups them if requested, then returns an
     * array of audit and audit-group elements.
     * @param {Array<LH.ReportResult.AuditRef>} auditRefs
     * @param {Object<string, LH.Result.ReportGroup>} groupDefinitions
     * @return {Array<Element>}
     */
    _renderGroupedAudits(auditRefs: Array<LH.ReportResult.AuditRef>, groupDefinitions: {
        [x: string]: LH.Result.ReportGroup;
    }): Array<Element>;
    /**
     * Take a set of audits, group them if they have groups, then render in a top-level
     * clump that can't be expanded/collapsed.
     * @param {Array<LH.ReportResult.AuditRef>} auditRefs
     * @param {Object<string, LH.Result.ReportGroup>} groupDefinitions
     * @return {Element}
     */
    renderUnexpandableClump(auditRefs: Array<LH.ReportResult.AuditRef>, groupDefinitions: {
        [x: string]: LH.Result.ReportGroup;
    }): Element;
    /**
     * Take a set of audits and render in a top-level, expandable clump that starts
     * in a collapsed state.
     * @param {Exclude<TopLevelClumpId, 'failed'>} clumpId
     * @param {{auditRefsOrEls: Array<LH.ReportResult.AuditRef | HTMLElement>, description?: string, openByDefault?: boolean}} clumpOpts
     * @return {!Element}
     */
    renderClump(clumpId: Exclude<TopLevelClumpId, 'failed'>, { auditRefsOrEls, description, openByDefault }: {
        auditRefsOrEls: Array<LH.ReportResult.AuditRef | HTMLElement>;
        description?: string;
        openByDefault?: boolean;
    }): Element;
    /**
     * @param {LH.ReportResult.Category} category
     * @param {Record<string, LH.Result.ReportGroup>} groupDefinitions
     * @param {{gatherMode: LH.Result.GatherMode, omitLabel?: boolean, onPageAnchorRendered?: (link: HTMLAnchorElement) => void}=} options
     * @return {DocumentFragment}
     */
    renderCategoryScore(category: LH.ReportResult.Category, groupDefinitions: Record<string, LH.Result.ReportGroup>, options?: {
        gatherMode: LH.Result.GatherMode;
        omitLabel?: boolean | undefined;
        onPageAnchorRendered?: ((link: HTMLAnchorElement) => void) | undefined;
    } | undefined): DocumentFragment;
    /**
     * @param {LH.ReportResult.Category} category
     * @param {Record<string, LH.Result.ReportGroup>} groupDefinitions
     * @return {DocumentFragment}
     */
    renderScoreGauge(category: LH.ReportResult.Category, groupDefinitions: Record<string, LH.Result.ReportGroup>): DocumentFragment;
    /**
     * @param {LH.ReportResult.Category} category
     * @return {DocumentFragment}
     */
    renderCategoryFraction(category: LH.ReportResult.Category): DocumentFragment;
    /**
     * Returns true if an LH category has any non-"notApplicable" audits.
     * @param {LH.ReportResult.Category} category
     * @return {boolean}
     */
    hasApplicableAudits(category: LH.ReportResult.Category): boolean;
    /**
     * Define the score arc of the gauge
     * Credit to xgad for the original technique: https://codepen.io/xgad/post/svg-radial-progress-meters
     * @param {SVGCircleElement} arcElem
     * @param {number} percent
     */
    _setGaugeArc(arcElem: SVGCircleElement, percent: number): void;
    /**
     * @param {LH.ReportResult.AuditRef} audit
     * @return {boolean}
     */
    _auditHasWarning(audit: LH.ReportResult.AuditRef): boolean;
    /**
     * Returns the id of the top-level clump to put this audit in.
     * @param {LH.ReportResult.AuditRef} auditRef
     * @return {TopLevelClumpId}
     */
    _getClumpIdForAuditRef(auditRef: LH.ReportResult.AuditRef): TopLevelClumpId;
    /**
     * Renders a set of top level sections (clumps), under a status of failed, warning,
     * manual, passed, or notApplicable. The result ends up something like:
     *
     * failed clump
     *   ├── audit 1 (w/o group)
     *   ├── audit 2 (w/o group)
     *   ├── audit group
     *   |  ├── audit 3
     *   |  └── audit 4
     *   └── audit group
     *      ├── audit 5
     *      └── audit 6
     * other clump (e.g. 'manual')
     *   ├── audit 1
     *   ├── audit 2
     *   ├── …
     *   ⋮
     * @param {LH.ReportResult.Category} category
     * @param {Object<string, LH.Result.ReportGroup>=} groupDefinitions
     * @param {{gatherMode: LH.Result.GatherMode}=} options
     * @return {Element}
     */
    render(category: LH.ReportResult.Category, groupDefinitions?: {
        [x: string]: LH.Result.ReportGroup;
    } | undefined, options?: {
        gatherMode: LH.Result.GatherMode;
    } | undefined): Element;
}
export type DOM = import('./dom.js').DOM;
export type ReportRenderer = import('./report-renderer.js').ReportRenderer;
export type DetailsRenderer = import('./details-renderer.js').DetailsRenderer;
export type TopLevelClumpId = 'failed' | 'warning' | 'manual' | 'passed' | 'notApplicable';
//# sourceMappingURL=category-renderer.d.ts.map