/**
 * Launch Chrome and do a full Lighthouse run via the Lighthouse DevTools bundle.
 * @param {string} url
 * @param {LH.Config=} config
 * @param {Smokehouse.SmokehouseOptions['testRunnerOptions']=} testRunnerOptions
 * @return {Promise<{lhr: LH.Result, artifacts: LH.Artifacts, log: string}>}
 */
export function runLighthouse(url: string, config?: LH.Config | undefined, testRunnerOptions?: Smokehouse.SmokehouseOptions['testRunnerOptions'] | undefined): Promise<{
    lhr: LH.Result;
    artifacts: LH.Artifacts;
    log: string;
}>;
//# sourceMappingURL=bundle.d.ts.map