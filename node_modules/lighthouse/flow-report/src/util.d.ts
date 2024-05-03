/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { UIStringsType } from './i18n/ui-strings';
declare const FlowResultContext: import("preact").Context<import("../../types/lhr/flow-result").default | undefined>;
declare const OptionsContext: import("preact").Context<LH.FlowReportOptions>;
declare function classNames(...args: Array<string | undefined | Record<string, boolean>>): string;
declare function getScreenDimensions(reportResult: LH.Result): {
    width: number;
    height: number;
};
declare function getFilmstripFrames(reportResult: LH.Result): Array<{
    data: string;
}> | undefined;
declare function getModeDescription(mode: LH.Result.GatherMode, strings: UIStringsType): string;
declare function useFlowResult(): LH.FlowResult;
declare function useHashParams(...params: string[]): (string | null)[];
declare function useHashState(): LH.HashState | null;
/**
 * Creates a DOM subtree from non-preact code (e.g. LH report renderer).
 * @param renderCallback Callback that renders a DOM subtree.
 * @param inputs Changes to these values will trigger a re-render of the DOM subtree.
 * @return Reference to the element that will contain the DOM subtree.
 */
declare function useExternalRenderer<T extends Element>(renderCallback: () => Node, inputs?: ReadonlyArray<unknown>): import("preact/hooks").Ref<T>;
declare function useOptions(): LH.FlowReportOptions;
export { FlowResultContext, OptionsContext, classNames, getScreenDimensions, getFilmstripFrames, getModeDescription, useFlowResult, useHashParams, useHashState, useExternalRenderer, useOptions, };
//# sourceMappingURL=util.d.ts.map