export default ErrorLogs;
export type AuditOptions = {
    ignoredPatterns?: Array<RegExp | string>;
};
/** @typedef {{ignoredPatterns?: Array<RegExp|string>}} AuditOptions */
declare class ErrorLogs extends Audit {
    /** @return {AuditOptions} */
    static get defaultOptions(): AuditOptions;
    /**
     * @template {{description: string | undefined}} T
     * @param {Array<T>} items
     * @param {AuditOptions} options
     * @return {Array<T>}
     */
    static filterAccordingToOptions<T extends {
        description: string | undefined;
    }>(items: T[], options: AuditOptions): T[];
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
//# sourceMappingURL=errors-in-console.d.ts.map