export default FontDisplay;
declare class FontDisplay extends Audit {
    /**
     * @param {LH.Artifacts} artifacts
     * @param {RegExp} passingFontDisplayRegex
     * @return {{passingURLs: Set<string>, failingURLs: Set<string>}}
     */
    static findFontDisplayDeclarations(artifacts: LH.Artifacts, passingFontDisplayRegex: RegExp): {
        passingURLs: Set<string>;
        failingURLs: Set<string>;
    };
    /**
     * Some pages load many fonts we can't check, so dedupe on origin.
     * @param {Array<string>} warningUrls
     * @return {Array<LH.IcuMessage>}
     */
    static getWarningsForFontUrls(warningUrls: Array<string>): Array<LH.IcuMessage>;
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
    const undeclaredFontOriginWarning: string;
}
import { Audit } from './audit.js';
//# sourceMappingURL=font-display.d.ts.map