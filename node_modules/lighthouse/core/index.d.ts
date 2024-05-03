export default lighthouse;
export { Audit } from "./audits/audit.js";
export { default as Gatherer } from "./gather/base-gatherer.js";
export { NetworkRecords } from "./computed/network-records.js";
export { default as defaultConfig } from "./config/default-config.js";
export { default as desktopConfig } from "./config/desktop-config.js";
export * from "../types/lh.js";
/**
 * Run Lighthouse.
 * @param {string=} url The URL to test. Optional if running in auditMode.
 * @param {LH.Flags=} flags Optional settings for the Lighthouse run. If present,
 *   they will override any settings in the config.
 * @param {LH.Config=} config Configuration for the Lighthouse run. If
 *   not present, the default config is used.
 * @param {LH.Puppeteer.Page=} page
 * @return {Promise<LH.RunnerResult|undefined>}
 */
declare function lighthouse(url?: string | undefined, flags?: LH.Flags | undefined, config?: LH.Config | undefined, page?: LH.Puppeteer.Page | undefined): Promise<LH.RunnerResult | undefined>;
/**
 * @param {LH.Puppeteer.Page} page
 * @param {LH.UserFlow.Options} [options]
 */
export function startFlow(page: LH.Puppeteer.Page, options?: LH.UserFlow.Options | undefined): Promise<UserFlow>;
/**
 * @param {LH.Puppeteer.Page|undefined} page
 * @param {LH.NavigationRequestor|undefined} requestor
 * @param {{config?: LH.Config, flags?: LH.Flags}} [options]
 * @return {Promise<LH.RunnerResult|undefined>}
 */
export function navigation(page: LH.Puppeteer.Page | undefined, requestor: LH.NavigationRequestor | undefined, options?: {
    config?: LH.Config | undefined;
    flags?: LH.Flags | undefined;
} | undefined): Promise<LH.RunnerResult | undefined>;
/**
 * @param {LH.Puppeteer.Page} page
 * @param {{config?: LH.Config, flags?: LH.Flags}} [options]
 * @return {Promise<{endTimespan: () => Promise<LH.RunnerResult|undefined>}>}
 */
export function startTimespan(page: LH.Puppeteer.Page, options?: {
    config?: LH.Config | undefined;
    flags?: LH.Flags | undefined;
} | undefined): Promise<{
    endTimespan: () => Promise<LH.RunnerResult | undefined>;
}>;
/**
 * @param {LH.Puppeteer.Page} page
 * @param {{config?: LH.Config, flags?: LH.Flags}} [options]
 * @return {Promise<LH.RunnerResult|undefined>}
 */
export function snapshot(page: LH.Puppeteer.Page, options?: {
    config?: LH.Config | undefined;
    flags?: LH.Flags | undefined;
} | undefined): Promise<LH.RunnerResult | undefined>;
/**
 * @template {LH.Result|LH.FlowResult} R
 * @param {R} result
 * @param {[R] extends [LH.Result] ? LH.OutputMode : Exclude<LH.OutputMode, 'csv'>} [format]
 * @return {string}
 */
export function generateReport<R extends LH.Result | LH.FlowResult>(result: R, format?: ([R] extends [LH.Result] ? LH.OutputMode : "json" | "html") | undefined): string;
/**
 * @param {LH.UserFlow.FlowArtifacts} flowArtifacts
 * @param {LH.Config} [config]
 */
export function auditFlowArtifacts(flowArtifacts: LH.UserFlow.FlowArtifacts, config?: LH.Config | undefined): Promise<{
    steps: LH.FlowResult.Step[];
    name: string;
}>;
export function getAuditList(): string[];
export const traceCategories: string[];
import * as LH from '../types/lh.js';
import { UserFlow } from './user-flow.js';
//# sourceMappingURL=index.d.ts.map