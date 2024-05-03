export type MessageFormatElement = import('@formatjs/icu-messageformat-parser').MessageFormatElement;
export const DEFAULT_LOCALE: "en-US";
/** @param {string[]} pathInLHR */
export function _formatPathAsString(pathInLHR: string[]): string;
/**
 * Function to retrieve all elements from an ICU message AST that are associated
 * with a named input, like '{varName}' or '{varName, number, bytes}'. This
 * differs from literal message types which are just arbitrary text.
 *
 * This function recursively inspects plural elements for nested elements,
 * but since the output is a Map they are deduplicated.
 * e.g. "=1{hello {icu}} =other{hello {icu}}" will produce one element in the output,
 * with "icu" as its key.
 *
 * TODO: don't do that deduplication because messages within a plural message could be number
 * messages with different styles.
 *
 * @param {Array<MessageFormatElement>} icuElements
 * @param {Map<string, MessageFormatElement>} [customElements]
 * @return {Map<string, MessageFormatElement>}
 */
export function collectAllCustomElementsFromICU(icuElements: Array<MessageFormatElement>, customElements?: Map<string, import("@formatjs/icu-messageformat-parser").MessageFormatElement> | undefined): Map<string, MessageFormatElement>;
/**
 * Returns whether `icuMessageOrNot`` is an `LH.IcuMessage` instance.
 * @param {unknown} icuMessageOrNot
 * @return {icuMessageOrNot is LH.IcuMessage}
 */
export function isIcuMessage(icuMessageOrNot: unknown): icuMessageOrNot is import("../../types/lhr/i18n.js").IcuMessage;
/**
 * Get the localized and formatted form of `icuMessageOrRawString` if it's an
 * LH.IcuMessage, or get it back directly if it's already a string.
 * Warning: this function throws if `icuMessageOrRawString` is not the expected
 * type (use function from `createIcuMessageFn` to create a valid LH.IcuMessage)
 * or `locale` isn't supported (use `lookupLocale` to find a valid locale).
 * @param {LH.IcuMessage | string} icuMessageOrRawString
 * @param {LH.Locale} locale
 * @return {string}
 */
export function getFormatted(icuMessageOrRawString: LH.IcuMessage | string, locale: LH.Locale): string;
/**
 * @param {LH.Locale} locale
 * @return {Record<string, string>}
 */
export function getRendererFormattedStrings(locale: LH.Locale): Record<string, string>;
/**
 * Recursively walk the input object, looking for property values that are
 * `LH.IcuMessage`s and replace them with their localized values. Primarily
 * used with the full LHR or a Config as input.
 * Returns a map of locations that were replaced to the `IcuMessage` that was at
 * that location.
 * @param {unknown} inputObject
 * @param {LH.Locale} locale
 * @return {LH.Result.IcuMessagePaths}
 */
export function replaceIcuMessages(inputObject: unknown, locale: LH.Locale): LH.Result.IcuMessagePaths;
/**
 * Returns whether the `requestedLocale` is registered and available for use
 * @param {LH.Locale} requestedLocale
 * @return {boolean}
 */
export function hasLocale(requestedLocale: LH.Locale): boolean;
/**
 * Populate the i18n string lookup dict with locale data
 * Used when the host environment selects the locale and serves lighthouse the intended locale file
 * @see https://docs.google.com/document/d/1jnt3BqKB-4q3AE94UWFA0Gqspx8Sd_jivlB7gQMlmfk/edit
 * @param {LH.Locale} locale
 * @param {import('./locales').LhlMessages} lhlMessages
 */
export function registerLocaleData(locale: LH.Locale, lhlMessages: import('./locales').LhlMessages): void;
/**
 * Format string `message` by localizing `values` and inserting them. `message`
 * is assumed to already be in the given locale.
 * If you need to localize a messagem `getFormatted` is probably what you want.
 * @param {string} message
 * @param {Record<string, string | number>|undefined} values
 * @param {LH.Locale} locale
 * @return {string}
 */
export function formatMessage(message: string, values: Record<string, string | number> | undefined, locale: LH.Locale): string;
/**
 * @param {string} i18nMessageId
 */
export function getIcuMessageIdParts(i18nMessageId: string): {
    filename: string;
    key: string;
};
/**
 * Returns a list of available locales.
 *  - if full build, this includes all canonical locales, aliases, and any locale added
 *      via `registerLocaleData`.
 *  - if bundled and locale messages have been stripped (locales.js shimmed), this includes
 *      only DEFAULT_LOCALE and any locales from `registerLocaleData`.
 * @return {Array<LH.Locale>}
 */
export function getAvailableLocales(): Array<LH.Locale>;
/**
 * Returns a list of canonical locales, as defined by the existent message files.
 * In practice, each of these may have aliases in the full list returned by
 * `getAvailableLocales()`.
 * TODO: create a CanonicalLocale type
 * @return {Array<string>}
 */
export function getCanonicalLocales(): Array<string>;
/**
 * Our strings were made when \ was the escape character, but now it is '. To avoid churn,
 * let's convert to the new style in memory.
 * @param {string} message
 * @return {string}
 */
export function escapeIcuMessage(message: string): string;
//# sourceMappingURL=format.d.ts.map