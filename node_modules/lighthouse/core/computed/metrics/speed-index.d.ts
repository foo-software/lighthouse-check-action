export { SpeedIndexComputed as SpeedIndex };
declare const SpeedIndexComputed: typeof SpeedIndex & {
    request: (dependencies: import("../../index.js").Artifacts.MetricComputationDataInput, context: import("../../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<import("../../index.js").Artifacts.Metric | import("../../index.js").Artifacts.LanternMetric>;
};
declare class SpeedIndex extends NavigationMetric {
    /**
     * @param {LH.Artifacts.NavigationMetricComputationData} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.LanternMetric>}
     */
    static computeSimulatedMetric(data: LH.Artifacts.NavigationMetricComputationData, context: LH.Artifacts.ComputedContext): Promise<LH.Artifacts.LanternMetric>;
}
import { NavigationMetric } from './navigation-metric.js';
//# sourceMappingURL=speed-index.d.ts.map