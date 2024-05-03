/**
 * @param {LH.Crdp.Audits.DeprecationIssueDetails} issueDetails
 */
export function getIssueDetailDescription(issueDetails: LH.Crdp.Audits.DeprecationIssueDetails): {
    substitutions: Map<string, import("../index.js").IcuMessage | undefined>;
    links: {
        link: string;
        linkTitle: import("../index.js").IcuMessage;
    }[];
    message: import("../index.js").IcuMessage | undefined;
};
export namespace UIStrings {
    const feature: string;
    const milestone: string;
    const title: string;
}
//# sourceMappingURL=deprecation-description.d.ts.map