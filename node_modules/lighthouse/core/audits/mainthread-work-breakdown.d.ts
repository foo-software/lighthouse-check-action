export default MainThreadWorkBreakdown;
export type TaskGroupIds = import('../lib/tracehouse/task-groups.js').TaskGroupIds;
/** @typedef {import('../lib/tracehouse/task-groups.js').TaskGroupIds} TaskGroupIds */
declare class MainThreadWorkBreakdown extends Audit {
    /**
     * @return {LH.Audit.ScoreOptions}
     */
    static get defaultOptions(): import("../../types/audit.js").default.ScoreOptions;
    /**
     * @param {LH.Artifacts.TaskNode[]} tasks
     * @return {Map<TaskGroupIds, number>}
     */
    static getExecutionTimingsByGroup(tasks: LH.Artifacts.TaskNode[]): Map<TaskGroupIds, number>;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const title: string;
    const failureTitle: string;
    const description: string;
    const columnCategory: string;
}
import { Audit } from './audit.js';
//# sourceMappingURL=mainthread-work-breakdown.d.ts.map