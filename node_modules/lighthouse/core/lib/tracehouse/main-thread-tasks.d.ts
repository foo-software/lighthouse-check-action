export type TaskGroup = import('./task-groups.js').TaskGroup;
export type TaskNode = {
    event: LH.TraceEvent;
    endEvent: LH.TraceEvent | undefined;
    children: TaskNode[];
    parent: TaskNode | undefined;
    /**
     * Indicates that the task had an endTime that was inferred rather than specified in the trace. i.e. in the source trace this task was unbounded.
     */
    unbounded: boolean;
    startTime: number;
    endTime: number;
    duration: number;
    selfTime: number;
    attributableURLs: string[];
    group: TaskGroup;
};
export type PriorTaskData = {
    timers: Map<string, TaskNode>;
    xhrs: Map<string, TaskNode>;
    frameURLsById: Map<string, string>;
    lastTaskURLs: string[];
};
/**
 * @fileoverview
 *
 * This artifact converts the array of raw trace events into an array of hierarchical
 * tasks for easier consumption and bottom-up analysis.
 *
 * Events are easily produced but difficult to consume. They're a mixture of start/end markers, "complete" events, etc.
 * @see https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview
 *
 * LH's TaskNode is an artifact that fills in the gaps a trace event leaves behind.
 * i.e. when did it end? which events are children/parents of this one?
 *
 * Each task will have its group/classification, start time, end time,
 * duration, and self time computed. Each task will potentially have a parent, children, and an
 * attributableURL for the script that was executing/forced this execution.
 */
/** @typedef {import('./task-groups.js').TaskGroup} TaskGroup */
/**
 * @typedef TaskNode
 * @prop {LH.TraceEvent} event
 * @prop {LH.TraceEvent|undefined} endEvent
 * @prop {TaskNode[]} children
 * @prop {TaskNode|undefined} parent
 * @prop {boolean} unbounded Indicates that the task had an endTime that was inferred rather than specified in the trace. i.e. in the source trace this task was unbounded.
 * @prop {number} startTime
 * @prop {number} endTime
 * @prop {number} duration
 * @prop {number} selfTime
 * @prop {string[]} attributableURLs
 * @prop {TaskGroup} group
 */
/** @typedef {{timers: Map<string, TaskNode>, xhrs: Map<string, TaskNode>, frameURLsById: Map<string, string>, lastTaskURLs: string[]}} PriorTaskData */
export class MainThreadTasks {
    /**
     * @param {LH.TraceEvent} event
     * @param {LH.TraceEvent} [endEvent]
     * @return {TaskNode}
     */
    static _createNewTaskNode(event: LH.TraceEvent, endEvent?: LH.TraceEvent | undefined): TaskNode;
    /**
     *
     * @param {TaskNode} currentTask
     * @param {number} stopTs
     * @param {PriorTaskData} priorTaskData
     * @param {Array<LH.TraceEvent>} reverseEventsQueue
     */
    static _assignAllTimersUntilTs(currentTask: TaskNode, stopTs: number, priorTaskData: PriorTaskData, reverseEventsQueue: Array<LH.TraceEvent>): void;
    /**
     * This function takes the start and end events from a thread and creates tasks from them.
     * We do this by iterating through the start and end event arrays simultaneously. For each start
     * event we attempt to find its end event.
     *
     * Because of this matching of start/end events and the need to be mutating our end events queue,
     * we reverse the array to more efficiently `.pop()` them off rather than `.shift()` them off.
     * While it's true the worst case runtime here is O(n^2), ~99.999% of the time the reverse loop is O(1)
     * because the overwhelmingly common case is that end event for a given start event is simply the very next event in our queue.
     *
     * @param {LH.TraceEvent[]} taskStartEvents
     * @param {LH.TraceEvent[]} taskEndEvents
     * @param {number} traceEndTs
     * @return {TaskNode[]}
     */
    static _createTasksFromStartAndEndEvents(taskStartEvents: LH.TraceEvent[], taskEndEvents: LH.TraceEvent[], traceEndTs: number): TaskNode[];
    /**
     * This function iterates through the tasks to set the `.parent`/`.children` properties of tasks
     * according to their implied nesting structure. If any of these relationships seem impossible based on
     * the timestamps, this method will throw.
     *
     * @param {TaskNode[]} sortedTasks
     * @param {LH.TraceEvent[]} timerInstallEvents
     * @param {PriorTaskData} priorTaskData
     */
    static _createTaskRelationships(sortedTasks: TaskNode[], timerInstallEvents: LH.TraceEvent[], priorTaskData: PriorTaskData): void;
    /**
     * This function takes the raw trace events sorted in increasing timestamp order and outputs connected task nodes.
     * To create the task heirarchy we make several passes over the events.
     *
     *    1. Create three arrays of X/B events, E events, and TimerInstall events.
     *    2. Create tasks for each X/B event, throwing if a matching E event cannot be found for a given B.
     *    3. Sort the tasks by ↑ startTime, ↓ duration.
     *    4. Match each task to its parent, throwing if there is any invalid overlap between tasks.
     *    5. Sort the tasks once more by ↑ startTime, ↓ duration in case they changed during relationship creation.
     *
     * @param {LH.TraceEvent[]} mainThreadEvents
     * @param {PriorTaskData} priorTaskData
     * @param {number} traceEndTs
     * @return {TaskNode[]}
     */
    static _createTasksFromEvents(mainThreadEvents: LH.TraceEvent[], priorTaskData: PriorTaskData, traceEndTs: number): TaskNode[];
    /**
     * @param {TaskNode} task
     * @param {TaskNode|undefined} parent
     * @return {number}
     */
    static _computeRecursiveSelfTime(task: TaskNode, parent: TaskNode | undefined): number;
    /**
     * @param {TaskNode} task
     * @param {string[]} parentURLs
     * @param {string[]} allURLsInTree
     * @param {PriorTaskData} priorTaskData
     */
    static _computeRecursiveAttributableURLs(task: TaskNode, parentURLs: string[], allURLsInTree: string[], priorTaskData: PriorTaskData): void;
    /**
     * @param {TaskNode} task
     * @param {Array<string>} urls
     */
    static _setRecursiveEmptyAttributableURLs(task: TaskNode, urls: Array<string>): void;
    /**
     * @param {TaskNode} task
     * @param {TaskGroup} [parentGroup]
     */
    static _computeRecursiveTaskGroup(task: TaskNode, parentGroup?: import("./task-groups.js").TaskGroup | undefined): void;
    /**
     * @param {LH.TraceEvent[]} mainThreadEvents
     * @param {Array<{id: string, url: string}>} frames
     * @param {number} traceEndTs
     * @param {number} [traceStartTs] Optional time-0 ts for tasks. Tasks before this point will have negative start/end times. Defaults to the first task found.
     * @return {TaskNode[]}
     */
    static getMainThreadTasks(mainThreadEvents: LH.TraceEvent[], frames: Array<{
        id: string;
        url: string;
    }>, traceEndTs: number, traceStartTs?: number | undefined): TaskNode[];
    /**
     * Prints an artistic rendering of the task tree for easier debugability.
     *
     * @param {TaskNode[]} tasks
     * @param {{printWidth?: number, startTime?: number, endTime?: number, taskLabelFn?: (node: TaskNode) => string}} options
     * @return {string}
     */
    static printTaskTreeToDebugString(tasks: TaskNode[], options?: {
        printWidth?: number | undefined;
        startTime?: number | undefined;
        endTime?: number | undefined;
        taskLabelFn?: ((node: TaskNode) => string) | undefined;
    }): string;
}
import * as LH from '../../../types/lh.js';
//# sourceMappingURL=main-thread-tasks.d.ts.map