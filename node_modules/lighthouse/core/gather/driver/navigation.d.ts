export type NavigationOptions = {
    waitUntil: Array<'fcp' | 'load' | 'navigated'>;
} & Partial<LH.Config.Settings>;
/**
 * Navigates to the given URL, assuming that the page is not already on this URL.
 * Resolves on the url of the loaded page, taking into account any redirects.
 * Typical use of this method involves navigating to a neutral page such as `about:blank` in between
 * navigations.
 *
 * @param {LH.Gatherer.Driver} driver
 * @param {LH.NavigationRequestor} requestor
 * @param {NavigationOptions} options
 * @return {Promise<{requestedUrl: string, mainDocumentUrl: string, warnings: Array<LH.IcuMessage>}>}
 */
export function gotoURL(driver: LH.Gatherer.Driver, requestor: LH.NavigationRequestor, options: NavigationOptions): Promise<{
    requestedUrl: string;
    mainDocumentUrl: string;
    warnings: Array<LH.IcuMessage>;
}>;
/**
 * @param {{timedOut: boolean, requestedUrl: string, mainDocumentUrl: string; }} navigation
 * @return {Array<LH.IcuMessage>}
 */
export function getNavigationWarnings(navigation: {
    timedOut: boolean;
    requestedUrl: string;
    mainDocumentUrl: string;
}): Array<LH.IcuMessage>;
export namespace UIStrings {
    const warningRedirected: string;
    const warningTimeout: string;
}
//# sourceMappingURL=navigation.d.ts.map