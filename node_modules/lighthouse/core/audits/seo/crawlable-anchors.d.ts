export default CrawlableAnchors;
declare class CrawlableAnchors extends Audit {
    /**
     * @param {LH.Artifacts} artifacts
     * @return {LH.Audit.Product}
     */
    static audit({ AnchorElements: anchorElements, URL: url }: LH.Artifacts): LH.Audit.Product;
}
export namespace UIStrings {
    const title: string;
    const failureTitle: string;
    const description: string;
    const columnFailingLink: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=crawlable-anchors.d.ts.map