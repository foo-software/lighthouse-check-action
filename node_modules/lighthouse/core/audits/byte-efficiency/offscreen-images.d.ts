export default OffscreenImages;
export type WasteResult = {
    node: LH.Audit.Details.NodeValue;
    url: string;
    requestStartTime: number;
    totalBytes: number;
    wastedBytes: number;
    wastedPercent: number;
};
/** @typedef {{node: LH.Audit.Details.NodeValue, url: string, requestStartTime: number, totalBytes: number, wastedBytes: number, wastedPercent: number}} WasteResult */
declare class OffscreenImages extends ByteEfficiencyAudit {
    /**
     * @param {{top: number, bottom: number, left: number, right: number}} imageRect
     * @param {{innerWidth: number, innerHeight: number}} viewportDimensions
     * @return {number}
     */
    static computeVisiblePixels(imageRect: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }, viewportDimensions: {
        innerWidth: number;
        innerHeight: number;
    }): number;
    /**
     * @param {LH.Artifacts.ImageElement} image
     * @param {{innerWidth: number, innerHeight: number}} viewportDimensions
     * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
     * @return {null|Error|WasteResult}
     */
    static computeWaste(image: LH.Artifacts.ImageElement, viewportDimensions: {
        innerWidth: number;
        innerHeight: number;
    }, networkRecords: Array<LH.Artifacts.NetworkRequest>): null | Error | WasteResult;
    /**
     * Filters out image requests that were requested after the last long task based on lantern timings.
     *
     * @param {WasteResult[]} images
     * @param {LH.Artifacts.LanternMetric} lanternMetricData
     */
    static filterLanternResults(images: WasteResult[], lanternMetricData: LH.Artifacts.LanternMetric): WasteResult[];
    /**
     * Filters out image requests that were requested after TTI.
     *
     * @param {WasteResult[]} images
     * @param {number} interactiveTimestamp
     */
    static filterObservedResults(images: WasteResult[], interactiveTimestamp: number): WasteResult[];
    /**
     * @param {LH.Artifacts} artifacts
     * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
     * @param {LH.Audit.Context} context
     * @return {Promise<import('./byte-efficiency-audit.js').ByteEfficiencyProduct>}
     */
    static audit_(artifacts: LH.Artifacts, networkRecords: Array<LH.Artifacts.NetworkRequest>, context: LH.Audit.Context): Promise<import('./byte-efficiency-audit.js').ByteEfficiencyProduct>;
}
export namespace UIStrings {
    const title: string;
    const description: string;
}
import { ByteEfficiencyAudit } from './byte-efficiency-audit.js';
import { NetworkRequest } from '../../lib/network-request.js';
//# sourceMappingURL=offscreen-images.d.ts.map