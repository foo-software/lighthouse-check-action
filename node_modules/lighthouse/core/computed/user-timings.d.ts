export { UserTimingsComputed as UserTimings };
export type MarkEvent = {
    name: string;
    isMark: true;
    args: LH.TraceEvent['args'];
    startTime: number;
};
export type MeasureEvent = {
    name: string;
    isMark: false;
    args: LH.TraceEvent['args'];
    startTime: number;
    endTime: number;
    duration: number;
};
declare const UserTimingsComputed: typeof UserTimings & {
    request: (dependencies: import("../index.js").Trace, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<(MarkEvent | MeasureEvent)[]>;
};
/** @typedef {{name: string, isMark: true, args: LH.TraceEvent['args'], startTime: number}} MarkEvent */
/** @typedef {{name: string, isMark: false, args: LH.TraceEvent['args'], startTime: number, endTime: number, duration: number}} MeasureEvent */
declare class UserTimings {
    /**
     * @param {LH.Trace} trace
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<Array<MarkEvent|MeasureEvent>>}
     */
    static compute_(trace: LH.Trace, context: LH.Artifacts.ComputedContext): Promise<Array<MarkEvent | MeasureEvent>>;
}
//# sourceMappingURL=user-timings.d.ts.map