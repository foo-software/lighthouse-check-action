export { TimeToFirstByteComputed as TimeToFirstByte };
declare const TimeToFirstByteComputed: typeof TimeToFirstByte & {
    request: (dependencies: import("../../index.js").Artifacts.MetricComputationDataInput, context: import("../../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<import("../../index.js").Artifacts.Metric | import("../../index.js").Artifacts.LanternMetric>;
};
declare class TimeToFirstByte extends NavigationMetric {
    /**
     * @param {LH.Artifacts.NavigationMetricComputationData} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.Metric>}
     */
    static computeSimulatedMetric(data: LH.Artifacts.NavigationMetricComputationData, context: LH.Artifacts.ComputedContext): Promise<LH.Artifacts.Metric>;
}
import { NavigationMetric } from './navigation-metric.js';
//# sourceMappingURL=time-to-first-byte.d.ts.map