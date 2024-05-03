export type NavigationContext = {
    driver: Driver;
    page: LH.Puppeteer.Page;
    resolvedConfig: LH.Config.ResolvedConfig;
    requestor: LH.NavigationRequestor;
    baseArtifacts: LH.BaseArtifacts;
    computedCache: Map<string, LH.ArbitraryEqualityMap>;
};
export type PhaseState = Omit<Parameters<typeof collectPhaseArtifacts>[0], 'phase'>;
/**
 * @param {LH.Puppeteer.Page|undefined} page
 * @param {LH.NavigationRequestor|undefined} requestor
 * @param {{config?: LH.Config, flags?: LH.Flags}} [options]
 * @return {Promise<LH.Gatherer.GatherResult>}
 */
export function navigationGather(page: LH.Puppeteer.Page | undefined, requestor: LH.NavigationRequestor | undefined, options?: {
    config?: import("../../types/config.js").default | undefined;
    flags?: import("../index.js").Flags | undefined;
} | undefined): Promise<LH.Gatherer.GatherResult>;
/**
 * @param {{driver: Driver, resolvedConfig: LH.Config.ResolvedConfig, requestor: LH.NavigationRequestor}} args
 * @return {Promise<{baseArtifacts: LH.BaseArtifacts}>}
 */
export function _setup({ driver, resolvedConfig, requestor }: {
    driver: Driver;
    resolvedConfig: LH.Config.ResolvedConfig;
    requestor: LH.NavigationRequestor;
}): Promise<{
    baseArtifacts: LH.BaseArtifacts;
}>;
/**
 * @param {NavigationContext} navigationContext
 * @return {Promise<{requestedUrl: string, mainDocumentUrl: string, navigationError: LH.LighthouseError | undefined}>}
 */
export function _navigate(navigationContext: NavigationContext): Promise<{
    requestedUrl: string;
    mainDocumentUrl: string;
    navigationError: LH.LighthouseError | undefined;
}>;
/**
 * @param {NavigationContext} navigationContext
 * @return {ReturnType<typeof _computeNavigationResult>}
 */
export function _navigation(navigationContext: NavigationContext): ReturnType<typeof _computeNavigationResult>;
/**
 * @param {{requestedUrl?: string, driver: Driver, resolvedConfig: LH.Config.ResolvedConfig, lhBrowser?: LH.Puppeteer.Browser, lhPage?: LH.Puppeteer.Page}} args
 */
export function _cleanup({ requestedUrl, driver, resolvedConfig, lhBrowser, lhPage }: {
    requestedUrl?: string;
    driver: Driver;
    resolvedConfig: LH.Config.ResolvedConfig;
    lhBrowser?: LH.Puppeteer.Browser;
    lhPage?: LH.Puppeteer.Page;
}): Promise<void>;
import { Driver } from './driver.js';
import { collectPhaseArtifacts } from './runner-helpers.js';
import { LighthouseError } from '../lib/lh-error.js';
/**
 * @param {NavigationContext} navigationContext
 * @param {PhaseState} phaseState
 * @param {Awaited<ReturnType<typeof _navigate>>} navigateResult
 * @return {Promise<Partial<LH.GathererArtifacts>>}
 */
declare function _computeNavigationResult(navigationContext: NavigationContext, phaseState: PhaseState, navigateResult: Awaited<ReturnType<typeof _navigate>>): Promise<Partial<LH.GathererArtifacts>>;
export {};
//# sourceMappingURL=navigation-runner.d.ts.map