export default IssuesPanelEntries;
export type IssueSubItem = {
    url: string;
};
export type IssueItem = {
    issueType: string | LH.IcuMessage;
    subItems: Array<IssueSubItem>;
};
declare class IssuesPanelEntries extends Audit {
    /**
     * @param {Array<LH.Crdp.Audits.MixedContentIssueDetails>} mixedContentIssues
     * @return {LH.Audit.Details.TableItem}
     */
    static getMixedContentRow(mixedContentIssues: Array<LH.Crdp.Audits.MixedContentIssueDetails>): LH.Audit.Details.TableItem;
    /**
     * @param {Array<LH.Crdp.Audits.CookieIssueDetails>} CookieIssues
     * @return {LH.Audit.Details.TableItem}
     */
    static getCookieRow(CookieIssues: Array<LH.Crdp.Audits.CookieIssueDetails>): LH.Audit.Details.TableItem;
    /**
     * @param {Array<LH.Crdp.Audits.BlockedByResponseIssueDetails>} blockedByResponseIssues
     * @return {LH.Audit.Details.TableItem}
     */
    static getBlockedByResponseRow(blockedByResponseIssues: Array<LH.Crdp.Audits.BlockedByResponseIssueDetails>): LH.Audit.Details.TableItem;
    /**
     * @param {Array<LH.Crdp.Audits.ContentSecurityPolicyIssueDetails>} cspIssues
     * @return {LH.Audit.Details.TableItem}
     */
    static getContentSecurityPolicyRow(cspIssues: Array<LH.Crdp.Audits.ContentSecurityPolicyIssueDetails>): LH.Audit.Details.TableItem;
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
    const columnIssueType: string;
    const issueTypeBlockedByResponse: string;
    const issueTypeHeavyAds: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=inspector-issues.d.ts.map