export default UsesResponsiveImages;
declare class UsesResponsiveImages extends ByteEfficiencyAudit {
    /**
     * @param {LH.Artifacts.ImageElement & {naturalWidth: number, naturalHeight: number}} image
     * @param {LH.Artifacts.ViewportDimensions} ViewportDimensions
     * @return {{width: number, height: number}};
     */
    static getDisplayedDimensions(image: LH.Artifacts.ImageElement & {
        naturalWidth: number;
        naturalHeight: number;
    }, ViewportDimensions: LH.Artifacts.ViewportDimensions): {
        width: number;
        height: number;
    };
    /**
     * @param {LH.Artifacts.ImageElement & {naturalWidth: number, naturalHeight: number}} image
     * @param {LH.Artifacts.ViewportDimensions} ViewportDimensions
     * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
     * @return {null|LH.Audit.ByteEfficiencyItem};
     */
    static computeWaste(image: LH.Artifacts.ImageElement & {
        naturalWidth: number;
        naturalHeight: number;
    }, ViewportDimensions: LH.Artifacts.ViewportDimensions, networkRecords: Array<LH.Artifacts.NetworkRequest>): null | LH.Audit.ByteEfficiencyItem;
    /**
     * @param {LH.Artifacts.ImageElement} image
     * @return {number};
     */
    static determineAllowableWaste(image: LH.Artifacts.ImageElement): number;
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
export const str_: (message: string, values?: Record<string, string | number> | undefined) => import("../../index.js").IcuMessage;
import { ByteEfficiencyAudit } from './byte-efficiency-audit.js';
import { NetworkRequest } from '../../lib/network-request.js';
//# sourceMappingURL=uses-responsive-images.d.ts.map