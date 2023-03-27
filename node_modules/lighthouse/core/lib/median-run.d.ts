/**
 * We want the run that's closest to the median of the FCP and the median of the TTI.
 * We're using the Euclidean distance for that (https://en.wikipedia.org/wiki/Euclidean_distance).
 * We use FCP and TTI because they represent the earliest and latest moments in the page lifecycle.
 * We avoid the median of single measures like the performance score because they can still exhibit
 * outlier behavior at the beginning or end of load.
 *
 * @param {Array<LH.Result>} runs
 * @return {LH.Result}
 */
export function computeMedianRun(runs: Array<LH.Result>): LH.Result;
/**
 * @param {Array<LH.Result>} runs
 * @return {Array<LH.Result>}
 */
export function filterToValidRuns(runs: Array<LH.Result>): Array<LH.Result>;
//# sourceMappingURL=median-run.d.ts.map