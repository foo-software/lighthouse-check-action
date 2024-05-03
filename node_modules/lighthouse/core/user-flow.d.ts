export type GatherStepRunnerOptions = WeakMap<LH.UserFlow.GatherStep, LH.Gatherer.GatherResult['runnerOptions']>;
export class UserFlow {
    /**
     * @param {LH.Puppeteer.Page} page
     * @param {LH.UserFlow.Options} [options]
     */
    constructor(page: LH.Puppeteer.Page, options?: LH.UserFlow.Options | undefined);
    /** @type {LH.Puppeteer.Page} */
    _page: LH.Puppeteer.Page;
    /** @type {LH.UserFlow.Options|undefined} */
    _options: LH.UserFlow.Options | undefined;
    /** @type {LH.UserFlow.GatherStep[]} */
    _gatherSteps: LH.UserFlow.GatherStep[];
    /** @type {GatherStepRunnerOptions} */
    _gatherStepRunnerOptions: GatherStepRunnerOptions;
    /**
     * @param {LH.UserFlow.StepFlags|undefined} flags
     * @return {LH.UserFlow.StepFlags|undefined}
     */
    _getNextFlags(flags: LH.UserFlow.StepFlags | undefined): LH.UserFlow.StepFlags | undefined;
    /**
     * @param {LH.UserFlow.StepFlags|undefined} flags
     * @return {LH.UserFlow.StepFlags}
     */
    _getNextNavigationFlags(flags: LH.UserFlow.StepFlags | undefined): LH.UserFlow.StepFlags;
    /**
     * @param {LH.Gatherer.GatherResult} gatherResult
     * @param {LH.UserFlow.StepFlags} [flags]
     */
    _addGatherStep(gatherResult: LH.Gatherer.GatherResult, flags?: LH.UserFlow.StepFlags | undefined): void;
    /**
     * @param {LH.NavigationRequestor} requestor
     * @param {LH.UserFlow.StepFlags} [flags]
     */
    navigate(requestor: LH.NavigationRequestor, flags?: LH.UserFlow.StepFlags | undefined): Promise<void>;
    /**
     * This is an alternative to `navigate()` that can be used to analyze a navigation triggered by user interaction.
     * For more on user triggered navigations, see https://github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md#triggering-a-navigation-via-user-interactions.
     *
     * @param {LH.UserFlow.StepFlags} [stepOptions]
     */
    startNavigation(stepOptions?: LH.UserFlow.StepFlags | undefined): Promise<void>;
    currentNavigation: {
        continueAndAwaitResult: () => Promise<void>;
    } | undefined;
    endNavigation(): Promise<void>;
    /**
     * @param {LH.UserFlow.StepFlags} [flags]
     */
    startTimespan(flags?: LH.UserFlow.StepFlags | undefined): Promise<void>;
    currentTimespan: {
        timespan: {
            endTimespanGather(): Promise<LH.Gatherer.GatherResult>;
        };
        flags: LH.UserFlow.StepFlags | undefined;
    } | undefined;
    endTimespan(): Promise<void>;
    /**
     * @param {LH.UserFlow.StepFlags} [flags]
     */
    snapshot(flags?: LH.UserFlow.StepFlags | undefined): Promise<void>;
    /**
     * @returns {Promise<LH.FlowResult>}
     */
    createFlowResult(): Promise<LH.FlowResult>;
    /**
     * @return {Promise<string>}
     */
    generateReport(): Promise<string>;
    /**
     * @return {LH.UserFlow.FlowArtifacts}
     */
    createArtifactsJson(): LH.UserFlow.FlowArtifacts;
}
/**
 * @param {Array<LH.UserFlow.GatherStep>} gatherSteps
 * @param {{name?: string, config?: LH.Config, gatherStepRunnerOptions?: GatherStepRunnerOptions}} options
 */
export function auditGatherSteps(gatherSteps: Array<LH.UserFlow.GatherStep>, options: {
    name?: string;
    config?: LH.Config;
    gatherStepRunnerOptions?: GatherStepRunnerOptions;
}): Promise<{
    steps: LH.FlowResult.Step[];
    name: string;
}>;
/**
 * @param {LH.UserFlow.StepFlags|undefined} flags
 * @param {LH.Artifacts} artifacts
 * @return {string}
 */
export function getStepName(flags: LH.UserFlow.StepFlags | undefined, artifacts: LH.Artifacts): string;
/**
 * @param {string|undefined} name
 * @param {LH.UserFlow.GatherStep[]} gatherSteps
 * @return {string}
 */
export function getFlowName(name: string | undefined, gatherSteps: LH.UserFlow.GatherStep[]): string;
export namespace UIStrings {
    const defaultFlowName: string;
    const defaultNavigationName: string;
    const defaultTimespanName: string;
    const defaultSnapshotName: string;
}
import * as LH from '../types/lh.js';
//# sourceMappingURL=user-flow.d.ts.map