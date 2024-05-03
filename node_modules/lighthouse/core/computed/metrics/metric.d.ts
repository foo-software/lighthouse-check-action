export default Metric;
/**
 * @fileOverview Encapsulates logic for choosing the correct metric computation method based on the
 * specified throttling settings, supporting simulated and observed metric types.
 *
 * To implement a fully supported metric:
 *     - Override the computeObservedMetric method with the observed-mode implementation.
 *     - Override the computeSimulatedMetric method with the simulated-mode implementation (which
 *       may call another computed artifact with the name LanternMyMetricName).
 */
declare class Metric {
    /**
     * Narrows the metric computation data to the input so child metric requests can be cached.
     *
     * @param {LH.Artifacts.MetricComputationData} data
     * @return {LH.Artifacts.MetricComputationDataInput}
     */
    static getMetricComputationInput(data: LH.Artifacts.MetricComputationData): LH.Artifacts.MetricComputationDataInput;
    /**
     * @param {LH.Artifacts.MetricComputationData} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.LanternMetric|LH.Artifacts.Metric>}
     */
    static computeSimulatedMetric(data: LH.Artifacts.MetricComputationData, context: LH.Artifacts.ComputedContext): Promise<LH.Artifacts.LanternMetric | LH.Artifacts.Metric>;
    /**
     * @param {LH.Artifacts.MetricComputationData} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.Metric>}
     */
    static computeObservedMetric(data: LH.Artifacts.MetricComputationData, context: LH.Artifacts.ComputedContext): Promise<LH.Artifacts.Metric>;
    /**
     * @param {LH.Artifacts.MetricComputationDataInput} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.LanternMetric|LH.Artifacts.Metric>}
     */
    static compute_(data: LH.Artifacts.MetricComputationDataInput, context: LH.Artifacts.ComputedContext): Promise<LH.Artifacts.LanternMetric | LH.Artifacts.Metric>;
}
//# sourceMappingURL=metric.d.ts.map