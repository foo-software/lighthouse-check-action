export { MainThreadTasksComputed as MainThreadTasks };
declare const MainThreadTasksComputed: typeof MainThreadTasks & {
    request: (dependencies: import("../index.js").Trace, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<import("../lib/tracehouse/main-thread-tasks.js").TaskNode[]>;
};
declare class MainThreadTasks {
    /**
     * @param {LH.Trace} trace
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<Array<LH.Artifacts.TaskNode>>}
     */
    static compute_(trace: LH.Trace, context: LH.Artifacts.ComputedContext): Promise<Array<LH.Artifacts.TaskNode>>;
}
//# sourceMappingURL=main-thread-tasks.d.ts.map