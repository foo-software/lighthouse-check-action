export type I18nFormatter = import('./i18n-formatter').I18nFormatter;
export class Globals {
    /** @type {I18nFormatter} */
    static i18n: I18nFormatter;
    /** @type {typeof UIStrings} */
    static strings: typeof UIStrings;
    /** @type {LH.ReportResult | null} */
    static reportJson: LH.ReportResult | null;
    /**
     * @param {{providedStrings: Record<string, string>; i18n: I18nFormatter; reportJson: LH.ReportResult | null}} options
     */
    static apply(options: {
        providedStrings: Record<string, string>;
        i18n: I18nFormatter;
        reportJson: LH.ReportResult | null;
    }): void;
    static getUniqueSuffix(): number;
    static resetUniqueSuffix(): void;
}
import { UIStrings } from './report-utils.js';
//# sourceMappingURL=report-globals.d.ts.map