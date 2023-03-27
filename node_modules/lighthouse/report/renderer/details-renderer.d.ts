export class DetailsRenderer {
    /**
     * @param {DOM} dom
     * @param {{fullPageScreenshot?: LH.Result.FullPageScreenshot, entities?: LH.Result.Entities}} [options]
     */
    constructor(dom: DOM, options?: {
        fullPageScreenshot?: import("../../types/lhr/lhr.js").default.FullPageScreenshot | undefined;
        entities?: import("../../types/lhr/lhr.js").default.Entities | undefined;
    } | undefined);
    _dom: import("./dom.js").DOM;
    _fullPageScreenshot: import("../../types/lhr/lhr.js").default.FullPageScreenshot | undefined;
    _entities: import("../../types/lhr/lhr.js").default.Entities | undefined;
    /**
     * @param {AuditDetails} details
     * @return {Element|null}
     */
    render(details: AuditDetails): Element | null;
    /**
     * @param {{value: number, granularity?: number}} details
     * @return {Element}
     */
    _renderBytes(details: {
        value: number;
        granularity?: number | undefined;
    }): Element;
    /**
     * @param {{value: number, granularity?: number, displayUnit?: string}} details
     * @return {Element}
     */
    _renderMilliseconds(details: {
        value: number;
        granularity?: number | undefined;
        displayUnit?: string | undefined;
    }): Element;
    /**
     * @param {string} text
     * @return {HTMLElement}
     */
    renderTextURL(text: string): HTMLElement;
    /**
     * @param {{text: string, url: string}} details
     * @return {HTMLElement}
     */
    _renderLink(details: {
        text: string;
        url: string;
    }): HTMLElement;
    /**
     * @param {string} text
     * @return {HTMLDivElement}
     */
    _renderText(text: string): HTMLDivElement;
    /**
     * @param {{value: number, granularity?: number}} details
     * @return {Element}
     */
    _renderNumeric(details: {
        value: number;
        granularity?: number | undefined;
    }): Element;
    /**
     * Create small thumbnail with scaled down image asset.
     * @param {string} details
     * @return {Element}
     */
    _renderThumbnail(details: string): Element;
    /**
     * @param {string} type
     * @param {*} value
     */
    _renderUnknown(type: string, value: any): HTMLDetailsElement;
    /**
     * Render a details item value for embedding in a table. Renders the value
     * based on the heading's valueType, unless the value itself has a `type`
     * property to override it.
     * @param {TableItemValue} value
     * @param {LH.Audit.Details.TableColumnHeading} heading
     * @return {Element|null}
     */
    _renderTableValue(value: TableItemValue, heading: LH.Audit.Details.TableColumnHeading): Element | null;
    /**
     * Returns a new heading where the values are defined first by `heading.subItemsHeading`,
     * and secondly by `heading`. If there is no subItemsHeading, returns null, which will
     * be rendered as an empty column.
     * @param {LH.Audit.Details.TableColumnHeading} heading
     * @return {LH.Audit.Details.TableColumnHeading | null}
     */
    _getDerivedSubItemsHeading(heading: LH.Audit.Details.TableColumnHeading): LH.Audit.Details.TableColumnHeading | null;
    /**
     * @param {TableItem} item
     * @param {(LH.Audit.Details.TableColumnHeading | null)[]} headings
     */
    _renderTableRow(item: TableItem, headings: (LH.Audit.Details.TableColumnHeading | null)[]): HTMLTableRowElement;
    /**
     * Renders one or more rows from a details table item. A single table item can
     * expand into multiple rows, if there is a subItemsHeading.
     * @param {TableItem} item
     * @param {LH.Audit.Details.TableColumnHeading[]} headings
     */
    _renderTableRowsFromItem(item: TableItem, headings: LH.Audit.Details.TableColumnHeading[]): DocumentFragment;
    /**
     * Adorn a table row element with entity chips based on [data-entity] attribute.
     * @param {HTMLTableRowElement} rowEl
     */
    _adornEntityGroupRow(rowEl: HTMLTableRowElement): void;
    /**
     * Renders an entity-grouped row.
     * @param {TableItem} item
     * @param {LH.Audit.Details.TableColumnHeading[]} headings
     */
    _renderEntityGroupRow(item: TableItem, headings: LH.Audit.Details.TableColumnHeading[]): DocumentFragment;
    /**
     * Returns an array of entity-grouped TableItems to use as the top-level rows in
     * an grouped table. Each table item returned represents a unique entity, with every
     * applicable key that can be grouped as a property. Optionally, supported columns are
     * summed by entity, and sorted by specified keys.
     * @param {TableLike} details
     * @return {TableItem[]}
     */
    _getEntityGroupItems(details: TableLike): TableItem[];
    /**
     * @param {TableLike} details
     * @return {Element}
     */
    _renderTable(details: TableLike): Element;
    /**
     * @param {LH.FormattedIcu<LH.Audit.Details.List>} details
     * @return {Element}
     */
    _renderList(details: LH.FormattedIcu<LH.Audit.Details.List>): Element;
    /**
     * @param {LH.Audit.Details.NodeValue} item
     * @return {Element}
     */
    renderNode(item: LH.Audit.Details.NodeValue): Element;
    /**
     * @param {LH.Audit.Details.SourceLocationValue} item
     * @return {Element|null}
     * @protected
     */
    protected renderSourceLocation(item: LH.Audit.Details.SourceLocationValue): Element | null;
    /**
     * @param {LH.Audit.Details.Filmstrip} details
     * @return {Element}
     */
    _renderFilmstrip(details: LH.Audit.Details.Filmstrip): Element;
    /**
     * @param {string} text
     * @return {Element}
     */
    _renderCode(text: string): Element;
}
export type DOM = import('./dom.js').DOM;
export type AuditDetails = LH.FormattedIcu<LH.Audit.Details>;
export type OpportunityTable = LH.FormattedIcu<LH.Audit.Details.Opportunity>;
export type Table = LH.FormattedIcu<LH.Audit.Details.Table>;
export type TableItem = LH.FormattedIcu<LH.Audit.Details.TableItem>;
export type TableItemValue = LH.FormattedIcu<LH.Audit.Details.ItemValue>;
export type TableColumnHeading = LH.FormattedIcu<LH.Audit.Details.TableColumnHeading>;
export type TableLike = LH.FormattedIcu<LH.Audit.Details.Table | LH.Audit.Details.Opportunity>;
//# sourceMappingURL=details-renderer.d.ts.map