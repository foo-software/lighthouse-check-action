export type ExitError = Error & {
    code: string;
    friendlyMessage?: string;
};
/**
 * exported for testing
 * @param {string|Array<string>} flags
 * @return {Array<string>}
 */
export function parseChromeFlags(flags?: string | Array<string>): Array<string>;
/**
 * @param {LH.RunnerResult} runnerResult
 * @param {LH.CliFlags} flags
 * @return {Promise<void>}
 */
export function saveResults(runnerResult: LH.RunnerResult, flags: LH.CliFlags): Promise<void>;
/**
 * @param {string} url
 * @param {LH.CliFlags} flags
 * @param {LH.Config|undefined} config
 * @return {Promise<LH.RunnerResult|undefined>}
 */
export function runLighthouse(url: string, flags: LH.CliFlags, config: LH.Config | undefined): Promise<LH.RunnerResult | undefined>;
//# sourceMappingURL=run.d.ts.map