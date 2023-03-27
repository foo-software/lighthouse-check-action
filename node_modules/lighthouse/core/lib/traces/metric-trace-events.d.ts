export class MetricTraceEvents {
    /**
     * Returns simplified representation of all metrics
     * @return {Array<{id: string, name: string, tsKey: keyof LH.Artifacts.TimingSummary}>} metrics to consider
     */
    static get metricsDefinitions(): {
        id: string;
        name: string;
        tsKey: keyof LH.Artifacts.TimingSummary;
    }[];
    /**
     * @param {Array<LH.TraceEvent>} traceEvents
     * @param {LH.Result['audits']} auditResults
     */
    constructor(traceEvents: Array<LH.TraceEvent>, auditResults: LH.Result['audits']);
    _traceEvents: import("../../index.js").TraceEvent[];
    _auditResults: Record<string, import("../../../types/lhr/audit-result.js").Result>;
    /**
     * Returns simplified representation of all metrics' timestamps from monotonic clock
     * @return {Array<{ts: number, id: string, name: string}>} metrics to consider
     */
    gatherMetrics(): Array<{
        ts: number;
        id: string;
        name: string;
    }>;
    /**
     * Get the trace event data for our timeOrigin
     * @param {Array<{ts: number, id: string, name: string}>} metrics
     * @return {{pid: number, tid: number, ts: number} | {errorMessage: string}}
     */
    getTimeOriginEvt(metrics: Array<{
        ts: number;
        id: string;
        name: string;
    }>): {
        pid: number;
        tid: number;
        ts: number;
    } | {
        errorMessage: string;
    };
    /**
     * Constructs performance.measure trace events, which have start/end events as follows:
     *     { "pid": 89922,"tid":1295,"ts":77176783452,"ph":"b","cat":"blink.user_timing","name":"innermeasure","args":{},"tts":1257886,"id":"0xe66c67"}
     *     { "pid": 89922,"tid":1295,"ts":77176882592,"ph":"e","cat":"blink.user_timing","name":"innermeasure","args":{},"tts":1257898,"id":"0xe66c67"}
     * @param {{ts: number, id: string, name: string}} metric
     * @param {{pid: number, tid: number, ts: number}} timeOriginEvt
     * @return {Array<LH.TraceEvent>} Pair of trace events (start/end)
     */
    synthesizeEventPair(metric: {
        ts: number;
        id: string;
        name: string;
    }, timeOriginEvt: {
        pid: number;
        tid: number;
        ts: number;
    }): Array<LH.TraceEvent>;
    /**
     * @return {Array<LH.TraceEvent>} User timing raw trace event pairs
     */
    generateFakeEvents(): Array<LH.TraceEvent>;
}
//# sourceMappingURL=metric-trace-events.d.ts.map