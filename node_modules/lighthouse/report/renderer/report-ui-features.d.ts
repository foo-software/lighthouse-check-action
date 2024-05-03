export class ReportUIFeatures {
    /**
     * @param {DOM} dom
     * @param {LH.Renderer.Options} opts
     */
    constructor(dom: DOM, opts?: LH.Renderer.Options);
    /** @type {LH.Result} */
    json: LH.Result;
    /** @type {DOM} */
    _dom: DOM;
    _opts: import("../types/report-renderer.js").default.Options;
    _topbar: TopbarFeatures | null;
    /**
     * Handle media query change events.
     * @param {MediaQueryList|MediaQueryListEvent} mql
     */
    onMediaQueryChange(mql: MediaQueryList | MediaQueryListEvent): void;
    /**
     * Adds tools button, print, and other functionality to the report. The method
     * should be called whenever the report needs to be re-rendered.
     * @param {LH.Result} lhr
     */
    initFeatures(lhr: LH.Result): void;
    _fullPageScreenshot: import("../../types/lhr/lhr.js").default.FullPageScreenshot | undefined;
    /**
     * @param {{text: string, icon?: string, onClick: () => void}} opts
     */
    addButton(opts: {
        text: string;
        icon?: string;
        onClick: () => void;
    }): HTMLButtonElement | undefined;
    resetUIState(): void;
    /**
     * Returns the html that recreates this report.
     * @return {string}
     */
    getReportHtml(): string;
    /**
     * Save json as a gist. Unimplemented in base UI features.
     */
    saveAsGist(): void;
    _enableFireworks(): void;
    _setupMediaQueryListeners(): void;
    /**
     * Resets the state of page before capturing the page for export.
     * When the user opens the exported HTML page, certain UI elements should
     * be in their closed state (not opened) and the templates should be unstamped.
     */
    _resetUIState(): void;
    _setupThirdPartyFilter(): void;
    /**
     * @param {Element} rootEl
     */
    _setupElementScreenshotOverlay(rootEl: Element): void;
    /**
     * From a table with URL entries, finds the rows containing third-party URLs
     * and returns them.
     * @param {HTMLElement[]} rowEls
     * @param {string} finalDisplayedUrl
     * @return {Array<HTMLElement>}
     */
    _getThirdPartyRows(rowEls: HTMLElement[], finalDisplayedUrl: string): Array<HTMLElement>;
    /**
     * @param {Blob|File} blob
     */
    _saveFile(blob: Blob | File): void;
}
export type DOM = import('./dom').DOM;
import { TopbarFeatures } from './topbar-features.js';
//# sourceMappingURL=report-ui-features.d.ts.map