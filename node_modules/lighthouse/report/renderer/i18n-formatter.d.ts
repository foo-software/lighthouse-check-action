export class I18nFormatter {
    /**
     * @param {LH.Locale} locale
     */
    constructor(locale: LH.Locale);
    _locale: "en-US" | "en" | "en-AU" | "en-GB" | "en-IE" | "en-SG" | "en-ZA" | "en-IN" | "ar-XB" | "ar" | "bg" | "ca" | "cs" | "da" | "de" | "el" | "en-XL" | "es" | "es-419" | "es-AR" | "es-BO" | "es-BR" | "es-BZ" | "es-CL" | "es-CO" | "es-CR" | "es-CU" | "es-DO" | "es-EC" | "es-GT" | "es-HN" | "es-MX" | "es-NI" | "es-PA" | "es-PE" | "es-PR" | "es-PY" | "es-SV" | "es-US" | "es-UY" | "es-VE" | "fi" | "fil" | "fr" | "he" | "hi" | "hr" | "hu" | "gsw" | "id" | "in" | "it" | "iw" | "ja" | "ko" | "lt" | "lv" | "mo" | "nl" | "nb" | "no" | "pl" | "pt" | "pt-PT" | "ro" | "ru" | "sk" | "sl" | "sr" | "sr-Latn" | "sv" | "ta" | "te" | "th" | "tl" | "tr" | "uk" | "vi" | "zh" | "zh-HK" | "zh-TW";
    _cachedNumberFormatters: Map<any, any>;
    /**
     * @param {number} number
     * @param {number|undefined} granularity
     * @param {Intl.NumberFormatOptions=} opts
     * @return {string}
     */
    _formatNumberWithGranularity(number: number, granularity: number | undefined, opts?: Intl.NumberFormatOptions | undefined): string;
    /**
     * Format number.
     * @param {number} number
     * @param {number=} granularity Controls how coarse the displayed value is.
     *                              If undefined, the number will be displayed as described
     *                              by the Intl defaults: tinyurl.com/7s67w5x7
     * @return {string}
     */
    formatNumber(number: number, granularity?: number | undefined): string;
    /**
     * Format integer.
     * Just like {@link formatNumber} but uses a granularity of 1, rounding to the nearest
     * whole number.
     * @param {number} number
     * @return {string}
     */
    formatInteger(number: number): string;
    /**
     * Format percent.
     * @param {number} number 0–1
     * @return {string}
     */
    formatPercent(number: number): string;
    /**
     * @param {number} size
     * @param {number=} granularity Controls how coarse the displayed value is.
     *                              If undefined, the number will be displayed in full.
     * @return {string}
     */
    formatBytesToKiB(size: number, granularity?: number | undefined): string;
    /**
     * @param {number} size
     * @param {number=} granularity Controls how coarse the displayed value is.
     *                              If undefined, the number will be displayed in full.
     * @return {string}
     */
    formatBytesToMiB(size: number, granularity?: number | undefined): string;
    /**
     * @param {number} size
     * @param {number=} granularity Controls how coarse the displayed value is.
     *                              If undefined, the number will be displayed in full.
     * @return {string}
     */
    formatBytes(size: number, granularity?: number | undefined): string;
    /**
     * @param {number} size
     * @param {number=} granularity Controls how coarse the displayed value is.
     *                              If undefined, the number will be displayed in full.
     * @return {string}
     */
    formatBytesWithBestUnit(size: number, granularity?: number | undefined): string;
    /**
     * @param {number} size
     * @param {number=} granularity Controls how coarse the displayed value is.
     *                              If undefined, the number will be displayed in full.
     * @return {string}
     */
    formatKbps(size: number, granularity?: number | undefined): string;
    /**
     * @param {number} ms
     * @param {number=} granularity Controls how coarse the displayed value is.
     *                              If undefined, the number will be displayed in full.
     * @return {string}
     */
    formatMilliseconds(ms: number, granularity?: number | undefined): string;
    /**
     * @param {number} ms
     * @param {number=} granularity Controls how coarse the displayed value is.
     *                              If undefined, the number will be displayed in full.
     * @return {string}
     */
    formatSeconds(ms: number, granularity?: number | undefined): string;
    /**
     * Format time.
     * @param {string} date
     * @return {string}
     */
    formatDateTime(date: string): string;
    /**
     * Converts a time in milliseconds into a duration string, i.e. `1d 2h 13m 52s`
     * @param {number} timeInMilliseconds
     * @return {string}
     */
    formatDuration(timeInMilliseconds: number): string;
}
//# sourceMappingURL=i18n-formatter.d.ts.map