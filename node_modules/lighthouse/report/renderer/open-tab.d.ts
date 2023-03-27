/**
 * Opens a new tab to the online viewer and sends the local page's JSON results
 * to the online viewer using URL.fragment
 * @param {LH.Result} lhr
 * @protected
 */
export function openViewer(lhr: LH.Result): Promise<void>;
/**
 * Same as openViewer, but uses postMessage.
 * @param {LH.Result} lhr
 * @protected
 */
export function openViewerAndSendData(lhr: LH.Result): Promise<void>;
/**
 * Opens a new tab to the treemap app and sends the JSON results using URL.fragment
 * @param {LH.Result} json
 */
export function openTreemap(json: LH.Result): void;
//# sourceMappingURL=open-tab.d.ts.map