export default NoDocWriteAudit;
declare class NoDocWriteAudit extends ViolationAudit {
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
import ViolationAudit from '../violation-audit.js';
//# sourceMappingURL=no-document-write.d.ts.map