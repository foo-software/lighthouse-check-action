export type CpuProfile = {
    id: string;
    pid: number;
    tid: number;
    startTime: number;
    nodes: Required<LH.TraceCpuProfile>['nodes'];
    samples: Array<number>;
    timeDeltas: Array<number>;
};
export type ProfilerRange = Required<Required<LH.TraceEvent['args']>['data']>['_syntheticProfilerRange'];
export type SynthethicEvent = LH.TraceEvent & {
    args: {
        data: {
            _syntheticProfilerRange: ProfilerRange;
        };
    };
};
export type SynthethicTaskNode = Omit<LH.Artifacts.TaskNode, 'event'> & {
    event: SynthethicEvent;
    endEvent: SynthethicEvent;
};
/**
 * @fileoverview
 *
 * This model converts the `Profile` and `ProfileChunk` mega trace events from the `disabled-by-default-v8.cpu_profiler`
 * category into B/E-style trace events that main-thread-tasks.js already knows how to parse into a task tree.
 *
 * The V8 CPU profiler measures where time is being spent by sampling the stack (See https://www.jetbrains.com/help/profiler/Profiling_Guidelines__Choosing_the_Right_Profiling_Mode.html
 * for a generic description of the differences between tracing and sampling).
 *
 * A `Profile` event is a record of the stack that was being executed at different sample points in time.
 * It has a structure like this:
 *
 *    nodes: [function A, function B, function C]
 *    samples: [node with id 2, node with id 1, ...]
 *    timeDeltas: [4125μs since last sample, 121μs since last sample, ...]
 *
 * Note that this is subtly different from the protocol-based Crdp.Profiler.Profile type.
 *
 * Helpful prior art:
 * @see https://cs.chromium.org/chromium/src/third_party/devtools-frontend/src/front_end/sdk/CPUProfileDataModel.js?sq=package:chromium&g=0&l=42
 * @see https://github.com/v8/v8/blob/99ca333b0efba3236954b823101315aefeac51ab/tools/profile.js
 * @see https://github.com/jlfwong/speedscope/blob/9ed1eb192cb7e9dac43a5f25bd101af169dc654a/src/import/chrome.ts#L200
 */
/**
 * @typedef CpuProfile
 * @property {string} id
 * @property {number} pid
 * @property {number} tid
 * @property {number} startTime
 * @property {Required<LH.TraceCpuProfile>['nodes']} nodes
 * @property {Array<number>} samples
 * @property {Array<number>} timeDeltas
 */
/** @typedef {Required<Required<LH.TraceEvent['args']>['data']>['_syntheticProfilerRange']} ProfilerRange */
/** @typedef {LH.TraceEvent & {args: {data: {_syntheticProfilerRange: ProfilerRange}}}} SynthethicEvent */
/** @typedef {Omit<LH.Artifacts.TaskNode, 'event'> & {event: SynthethicEvent, endEvent: SynthethicEvent}} SynthethicTaskNode */
export class CpuProfileModel {
    /**
     * @param {LH.TraceEvent | undefined} event
     * @return {event is SynthethicEvent}
     */
    static isSyntheticEvent(event: LH.TraceEvent | undefined): event is SynthethicEvent;
    /**
     * @param {LH.Artifacts.TaskNode} task
     * @return {task is SynthethicTaskNode}
     */
    static isSyntheticTask(task: LH.Artifacts.TaskNode): task is SynthethicTaskNode;
    /**
     * Finds all the tasks that started or ended (depending on `type`) within the provided time range.
     * Uses a memory index to remember the place in the array the last invocation left off to avoid
     * re-traversing the entire array, but note that this index might still be slightly off from the
     * true start position.
     *
     * @param {Array<{startTime: number, endTime: number}>} knownTasks
     * @param {{type: 'startTime'|'endTime', initialIndex: number, earliestPossibleTimestamp: number, latestPossibleTimestamp: number}} options
     */
    static _getTasksInRange(knownTasks: Array<{
        startTime: number;
        endTime: number;
    }>, options: {
        type: 'startTime' | 'endTime';
        initialIndex: number;
        earliestPossibleTimestamp: number;
        latestPossibleTimestamp: number;
    }): {
        tasks: {
            startTime: number;
            endTime: number;
        }[];
        lastIndex: number;
    };
    /**
     * Given a particular time range and a set of known true tasks, find the correct timestamp to use
     * for a transition between tasks.
     *
     * Because the sampling profiler only provides a *range* of start/stop function boundaries, this
     * method uses knowledge of a known set of tasks to find the most accurate timestamp for a particular
     * range. For example, if we know that a function ended between 800ms and 810ms, we can use the
     * knowledge that a toplevel task ended at 807ms to use 807ms as the correct endtime for this function.
     *
     * @param {{syntheticTask: SynthethicTaskNode, eventType: 'start'|'end', allEventsAtTs: {naive: Array<SynthethicEvent>, refined: Array<SynthethicEvent>}, knownTaskStartTimeIndex: number, knownTaskEndTimeIndex: number, knownTasksByStartTime: Array<{startTime: number, endTime: number}>, knownTasksByEndTime: Array<{startTime: number, endTime: number}>}} data
     * @return {{timestamp: number, lastStartTimeIndex: number, lastEndTimeIndex: number}}
     */
    static _findEffectiveTimestamp(data: {
        syntheticTask: SynthethicTaskNode;
        eventType: 'start' | 'end';
        allEventsAtTs: {
            naive: Array<SynthethicEvent>;
            refined: Array<SynthethicEvent>;
        };
        knownTaskStartTimeIndex: number;
        knownTaskEndTimeIndex: number;
        knownTasksByStartTime: Array<{
            startTime: number;
            endTime: number;
        }>;
        knownTasksByEndTime: Array<{
            startTime: number;
            endTime: number;
        }>;
    }): {
        timestamp: number;
        lastStartTimeIndex: number;
        lastEndTimeIndex: number;
    };
    /**
     * Creates B/E-style trace events from a CpuProfile object created by `collectProfileEvents()`
     *
     * @param {CpuProfile} profile
     * @param {Array<LH.Artifacts.TaskNode>} tasks
     * @return {Array<LH.TraceEvent>}
     */
    static synthesizeTraceEvents(profile: CpuProfile, tasks: Array<LH.Artifacts.TaskNode>): Array<LH.TraceEvent>;
    /**
     * Merges the data of all the `ProfileChunk` trace events into a single CpuProfile object for consumption
     * by `synthesizeTraceEvents()`.
     *
     * @param {Array<LH.TraceEvent>} traceEvents
     * @return {Array<CpuProfile>}
     */
    static collectProfileEvents(traceEvents: Array<LH.TraceEvent>): Array<CpuProfile>;
    /**
     * @param {CpuProfile} profile
     */
    constructor(profile: CpuProfile);
    _profile: CpuProfile;
    _nodesById: Map<number, {
        id: number;
        callFrame: {
            functionName: string;
            url?: string | undefined;
        };
        parent?: number | undefined;
    }>;
    _activeNodeArraysById: Map<number, number[]>;
    /**
     * Initialization function to enable O(1) access to nodes by node ID.
     * @return {Map<number, CpuProfile['nodes'][0]>}
     */
    _createNodeMap(): Map<number, CpuProfile['nodes'][0]>;
    /**
     * Initialization function to enable O(1) access to the set of active nodes in the stack by node ID.
     * @return {Map<number, Array<number>>}
     */
    _createActiveNodeArrays(): Map<number, Array<number>>;
    /**
     * Returns all the node IDs in a stack when a specific nodeId is at the top of the stack
     * (i.e. a stack's node ID and the node ID of all of its parents).
     *
     * @param {number} nodeId
     * @return {Array<number>}
     */
    _getActiveNodeIds(nodeId: number): Array<number>;
    /**
     * Generates the necessary B/E-style trace events for a single transition from stack A to stack B
     * at the given latest timestamp (includes possible range in event.args.data).
     *
     * Example:
     *
     *    latestPossibleTimestamp 1234
     *    previousNodeIds 1,2,3
     *    currentNodeIds 1,2,4
     *
     *    yields [end 3 at ts 1234, begin 4 at ts 1234]
     *
     * @param {number} earliestPossibleTimestamp
     * @param {number} latestPossibleTimestamp
     * @param {Array<number>} previousNodeIds
     * @param {Array<number>} currentNodeIds
     * @return {Array<SynthethicEvent>}
     */
    _synthesizeTraceEventsForTransition(earliestPossibleTimestamp: number, latestPossibleTimestamp: number, previousNodeIds: Array<number>, currentNodeIds: Array<number>): Array<SynthethicEvent>;
    /**
     * Creates the B/E-style trace events using only data from the profile itself. Each B/E event will
     * include the actual _range_ the timestamp could have been in its metadata that is used for
     * refinement later.
     *
     * @return {Array<SynthethicEvent>}
     */
    _synthesizeNaiveTraceEvents(): Array<SynthethicEvent>;
    /**
     * Creates a copy of B/E-style trace events with refined timestamps using knowledge from the
     * tasks that have definitive timestamps.
     *
     * With the sampling profiler we know that a function started/ended _sometime between_ two points,
     * but not exactly when. Using the information from other tasks gives us more information to be
     * more precise with timings and allows us to create a valid task tree later on.
     *
     * @param {Array<{startTime: number, endTime: number}>} knownTasks
     * @param {Array<SynthethicTaskNode>} syntheticTasks
     * @param {Array<SynthethicEvent>} syntheticEvents
     * @return {Array<SynthethicEvent>}
     */
    _refineTraceEventsWithTasks(knownTasks: Array<{
        startTime: number;
        endTime: number;
    }>, syntheticTasks: Array<SynthethicTaskNode>, syntheticEvents: Array<SynthethicEvent>): Array<SynthethicEvent>;
    /**
     * Creates B/E-style trace events from a CpuProfile object created by `collectProfileEvents()`.
     * An optional set of tasks can be passed in to refine the start/end times.
     *
     * @param {Array<LH.Artifacts.TaskNode>} [knownTaskNodes]
     * @return {Array<LH.TraceEvent>}
     */
    synthesizeTraceEvents(knownTaskNodes?: import("./main-thread-tasks.js").TaskNode[] | undefined): Array<LH.TraceEvent>;
}
//# sourceMappingURL=cpu-profile-model.d.ts.map