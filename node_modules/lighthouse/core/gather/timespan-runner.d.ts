/**
 * @param {LH.Puppeteer.Page} page
 * @param {{config?: LH.Config, flags?: LH.Flags}} [options]
 * @return {Promise<{endTimespanGather(): Promise<LH.Gatherer.GatherResult>}>}
 */
export function startTimespanGather(page: LH.Puppeteer.Page, options?: {
    config?: import("../../types/config.js").default | undefined;
    flags?: import("../index.js").Flags | undefined;
} | undefined): Promise<{
    endTimespanGather(): Promise<LH.Gatherer.GatherResult>;
}>;
export namespace UIStrings {
    const warningNavigationDetected: string;
}
//# sourceMappingURL=timespan-runner.d.ts.map