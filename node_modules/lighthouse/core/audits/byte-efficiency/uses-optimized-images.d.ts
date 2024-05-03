export default UsesOptimizedImages;
declare class UsesOptimizedImages extends ByteEfficiencyAudit {
    /**
     * @param {{originalSize: number, jpegSize: number}} image
     * @return {{bytes: number, percent: number}}
     */
    static computeSavings(image: {
        originalSize: number;
        jpegSize: number;
    }): {
        bytes: number;
        percent: number;
    };
    /**
     * @param {{naturalWidth: number, naturalHeight: number}} imageElement
     * @return {number}
     */
    static estimateJPEGSizeFromDimensions(imageElement: {
        naturalWidth: number;
        naturalHeight: number;
    }): number;
    /**
     * @param {LH.Artifacts} artifacts
     * @return {import('./byte-efficiency-audit.js').ByteEfficiencyProduct}
     */
    static audit_(artifacts: LH.Artifacts): import('./byte-efficiency-audit.js').ByteEfficiencyProduct;
}
export namespace UIStrings {
    const title: string;
    const description: string;
}
import { ByteEfficiencyAudit } from './byte-efficiency-audit.js';
//# sourceMappingURL=uses-optimized-images.d.ts.map