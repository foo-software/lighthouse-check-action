export default ModernImageFormats;
declare class ModernImageFormats extends ByteEfficiencyAudit {
    /**
     * @param {{naturalWidth: number, naturalHeight: number}} imageElement
     * @return {number}
     */
    static estimateWebPSizeFromDimensions(imageElement: {
        naturalWidth: number;
        naturalHeight: number;
    }): number;
    /**
     * @param {{naturalWidth: number, naturalHeight: number}} imageElement
     * @return {number}
     */
    static estimateAvifSizeFromDimensions(imageElement: {
        naturalWidth: number;
        naturalHeight: number;
    }): number;
    /**
     * @param {{jpegSize: number | undefined, webpSize: number | undefined}} otherFormatSizes
     * @return {number|undefined}
     */
    static estimateAvifSizeFromWebPAndJpegEstimates(otherFormatSizes: {
        jpegSize: number | undefined;
        webpSize: number | undefined;
    }): number | undefined;
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
//# sourceMappingURL=modern-image-formats.d.ts.map