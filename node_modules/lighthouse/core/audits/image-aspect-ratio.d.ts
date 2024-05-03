export default ImageAspectRatio;
export type WellDefinedImage = Required<LH.Artifacts.ImageElement>;
/** @typedef {Required<LH.Artifacts.ImageElement>} WellDefinedImage */
declare class ImageAspectRatio extends Audit {
    /**
     * @param {WellDefinedImage} image
     * @return {{url: string, node: LH.Audit.Details.NodeValue, displayedAspectRatio: string, actualAspectRatio: string, doRatiosMatch: boolean}}
     */
    static computeAspectRatios(image: WellDefinedImage): {
        url: string;
        node: LH.Audit.Details.NodeValue;
        displayedAspectRatio: string;
        actualAspectRatio: string;
        doRatiosMatch: boolean;
    };
    /**
     * @param {LH.Artifacts} artifacts
     * @return {LH.Audit.Product}
     */
    static audit(artifacts: LH.Artifacts): LH.Audit.Product;
}
export namespace UIStrings {
    const title: string;
    const failureTitle: string;
    const description: string;
    const columnDisplayed: string;
    const columnActual: string;
}
import { Audit } from './audit.js';
//# sourceMappingURL=image-aspect-ratio.d.ts.map