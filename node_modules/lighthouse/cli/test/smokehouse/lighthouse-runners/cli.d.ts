/**
 * Launch Chrome and do a full Lighthouse run via the Lighthouse CLI.
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
import log from 'lighthouse-logger';
//# sourceMappingURL=cli.d.ts.map