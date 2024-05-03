export default EfficientAnimatedContent;
declare class EfficientAnimatedContent extends ByteEfficiencyAudit {
    /**
     * Calculate rough savings percentage based on 1000 real gifs transcoded to video
     * @param {number} bytes
     * @return {number} rough savings percentage
     * @see https://github.com/GoogleChrome/lighthouse/issues/4696#issuecomment-380296510 bytes
     */
    static getPercentSavings(bytes: number): number;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
     * @return {import('./byte-efficiency-audit.js').ByteEfficiencyProduct}
     */
    static audit_(artifacts: LH.Artifacts, networkRecords: Array<LH.Artifacts.NetworkRequest>): import('./byte-efficiency-audit.js').ByteEfficiencyProduct;
}
export namespace UIStrings {
    const title: string;
    const description: string;
}
import { ByteEfficiencyAudit } from './byte-efficiency-audit.js';
import { NetworkRequest } from '../../lib/network-request.js';
//# sourceMappingURL=efficient-animated-content.d.ts.map