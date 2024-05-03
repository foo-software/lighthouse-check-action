export default UsesResponsiveImagesSnapshot;
declare class UsesResponsiveImagesSnapshot extends Audit {
    /**
     * @param {LH.Artifacts} artifacts
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const title: string;
    const failureTitle: string;
    const columnDisplayedDimensions: string;
    const columnActualDimensions: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=uses-responsive-images-snapshot.d.ts.map