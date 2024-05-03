/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @param {LH.Artifacts.Rect} rect
 * @param {{x:number, y:number}} point
 */
export function rectContainsPoint(rect: LH.Artifacts.Rect, { x, y }: {
    x: number;
    y: number;
}): boolean;
/**
 * Returns whether rect2 is contained entirely within rect1;
 * @param {LH.Artifacts.Rect} rect1
 * @param {LH.Artifacts.Rect} rect2
 * @return {boolean}
 */
export function rectContains(rect1: LH.Artifacts.Rect, rect2: LH.Artifacts.Rect): boolean;
/**
 * @param {{left:number, top:number, right:number, bottom: number}} rect
 * @return {LH.Artifacts.Rect}
 */
export function addRectWidthAndHeight({ left, top, right, bottom }: {
    left: number;
    top: number;
    right: number;
    bottom: number;
}): LH.Artifacts.Rect;
/**
 * @param {{x:number, y:number, width:number, height: number}} rect
 * @return {LH.Artifacts.Rect}
 */
export function addRectTopAndBottom({ x, y, width, height }: {
    x: number;
    y: number;
    width: number;
    height: number;
}): LH.Artifacts.Rect;
/**
 * @param {LH.Artifacts.Rect} rect1
 * @param {LH.Artifacts.Rect} rect2
 */
export function getRectOverlapArea(rect1: LH.Artifacts.Rect, rect2: LH.Artifacts.Rect): number;
/**
 * @param {LH.Artifacts.Rect} rect
 * @param {number} centerRectSize
 */
export function getRectAtCenter(rect: LH.Artifacts.Rect, centerRectSize: number): import("../../types/lhr/audit-details").default.Rect;
/**
 * @param {LH.Artifacts.Rect[]} rects
 */
export function getLargestRect(rects: LH.Artifacts.Rect[]): import("../../types/lhr/audit-details").default.Rect;
/**
 * @param {LH.Artifacts.Rect} rect
 */
export function getRectArea(rect: LH.Artifacts.Rect): number;
/**
 * @param {LH.Artifacts.Rect} rect
 */
export function getRectCenterPoint(rect: LH.Artifacts.Rect): {
    x: number;
    y: number;
};
/**
 * @param {LH.Artifacts.Rect[]} rects
 */
export function getBoundingRect(rects: LH.Artifacts.Rect[]): import("../../types/lhr/audit-details").default.Rect;
/**
 * Returns a bounding rect for all the passed in rects, with padded with half of
 * `padding` on all sides.
 * @param {LH.Artifacts.Rect[]} rects
 * @param {number} padding
 * @return {LH.Artifacts.Rect}
 */
export function getBoundingRectWithPadding(rects: LH.Artifacts.Rect[], padding: number): LH.Artifacts.Rect;
/**
 * @param {LH.Artifacts.Rect} rectA
 * @param {LH.Artifacts.Rect} rectB
 * @return {boolean}
 */
export function rectsTouchOrOverlap(rectA: LH.Artifacts.Rect, rectB: LH.Artifacts.Rect): boolean;
/**
 *
 * @param {LH.Artifacts.Rect[]} rectListA
 * @param {LH.Artifacts.Rect[]} rectListB
 */
export function allRectsContainedWithinEachOther(rectListA: LH.Artifacts.Rect[], rectListB: LH.Artifacts.Rect[]): boolean;
/**
 * @param {LH.Artifacts.Rect[]} rects
 * @return {LH.Artifacts.Rect[]}
 */
export function filterOutRectsContainedByOthers(rects: LH.Artifacts.Rect[]): LH.Artifacts.Rect[];
/**
 * @param {LH.Artifacts.Rect[]} rects
 * @return {LH.Artifacts.Rect[]}
 */
export function filterOutTinyRects(rects: LH.Artifacts.Rect[]): LH.Artifacts.Rect[];
/**
 * @param {Array<number>} rect
 * @return {LH.Artifacts.Rect}
 */
export function traceRectToLHRect(rect: Array<number>): LH.Artifacts.Rect;
//# sourceMappingURL=rect-helpers.d.ts.map