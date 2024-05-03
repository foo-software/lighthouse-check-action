export { TBTImpactTasksComputed as TBTImpactTasks };
declare const TBTImpactTasksComputed: typeof TBTImpactTasks & {
    request: (dependencies: import("../index.js").Artifacts.MetricComputationDataInput, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<import("../index.js").Artifacts.TBTImpactTask[]>;
};
declare class TBTImpactTasks {
    /**
     * @param {LH.Artifacts.TaskNode} task
     * @return {LH.Artifacts.TaskNode}
     */
    static getTopLevelTask(task: LH.Artifacts.TaskNode): LH.Artifacts.TaskNode;
    /**
     * @param {LH.Artifacts.MetricComputationDataInput} metricComputationData
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<{startTimeMs: number, endTimeMs: number}>}
     */
    static getTbtBounds(metricComputationData: LH.Artifacts.MetricComputationDataInput, context: LH.Artifacts.ComputedContext): Promise<{
        startTimeMs: number;
        endTimeMs: number;
    }>;
    /**
     * @param {LH.Artifacts.TaskNode[]} tasks
     * @param {Map<LH.Artifacts.TaskNode, number>} taskToImpact
     */
    static createImpactTasks(tasks: LH.Artifacts.TaskNode[], taskToImpact: Map<LH.Artifacts.TaskNode, number>): import("../index.js").Artifacts.TBTImpactTask[];
    /**
     * @param {LH.Artifacts.TaskNode[]} tasks
     * @param {number} startTimeMs
     * @param {number} endTimeMs
     * @return {LH.Artifacts.TBTImpactTask[]}
     */
    static computeImpactsFromObservedTasks(tasks: LH.Artifacts.TaskNode[], startTimeMs: number, endTimeMs: number): LH.Artifacts.TBTImpactTask[];
    /**
     * @param {LH.Artifacts.TaskNode[]} tasks
     * @param {LH.Gatherer.Simulation.Result['nodeTimings']} tbtNodeTimings
     * @param {number} startTimeMs
     * @param {number} endTimeMs
     * @return {LH.Artifacts.TBTImpactTask[]}
     */
    static computeImpactsFromLantern(tasks: LH.Artifacts.TaskNode[], tbtNodeTimings: LH.Gatherer.Simulation.Result['nodeTimings'], startTimeMs: number, endTimeMs: number): LH.Artifacts.TBTImpactTask[];
    /**
     * @param {LH.Artifacts.MetricComputationDataInput} metricComputationData
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.TBTImpactTask[]>}
     */
    static compute_(metricComputationData: LH.Artifacts.MetricComputationDataInput, context: LH.Artifacts.ComputedContext): Promise<LH.Artifacts.TBTImpactTask[]>;
}
//# sourceMappingURL=tbt-impact-tasks.d.ts.map