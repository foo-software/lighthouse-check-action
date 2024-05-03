export default RedirectsHTTP;
/**
 * An audit for checking if a site starting on http redirects to https. The audit
 * is marked not applicable if the requestedUrl is already https.
 */
declare class RedirectsHTTP extends Audit {
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
}
import { Audit } from './audit.js';
//# sourceMappingURL=redirects-http.d.ts.map