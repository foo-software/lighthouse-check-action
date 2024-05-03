/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Generates a chromium trace file from user timing measures
 * `threadId` can be provided to separate a series of trace events into another thread, useful
 * if timings do not share the same timeOrigin, but should both be "left-aligned".
 * Adapted from https://github.com/tdresser/performance-observer-tracing
 * @param {LH.Artifacts.MeasureEntry[]} entries user timing entries
 * @param {number=} threadId
 */
export function generateTraceEvents(entries: LH.Artifacts.MeasureEntry[], threadId?: number | undefined): import("..").TraceEvent[];
/**
 * Writes a trace file to disk
 * @param {LH.Result} lhr
 * @return {string}
 */
export function createTraceString(lhr: LH.Result): string;
//# sourceMappingURL=timing-trace-saver.d.ts.map