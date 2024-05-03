export default LargestContentfulPaintLazyLoaded;
declare class LargestContentfulPaintLazyLoaded extends Audit {
    /**
     * @param {LH.Artifacts.ImageElement} image
     * @param {LH.Artifacts.ViewportDimensions} viewportDimensions
     * @return {boolean}
     */
    static isImageInViewport(image: LH.Artifacts.ImageElement, viewportDimensions: LH.Artifacts.ViewportDimensions): boolean;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const title: string;
    const failureTitle: string;
    const description: string;
}
import { Audit } from './audit.js';
//# sourceMappingURL=lcp-lazy-loaded.d.ts.map