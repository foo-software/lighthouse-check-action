/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { FunctionComponent, JSX } from 'preact';
declare function saveHtml(flowResult: LH.FlowResult, htmlStr: string): void;
declare namespace saveHtml {
    var saveFile: typeof import("../../report/renderer/api").saveFile;
}
declare const Topbar: FunctionComponent<{
    onMenuClick: JSX.MouseEventHandler<HTMLButtonElement>;
}>;
export { Topbar, saveHtml, };
//# sourceMappingURL=topbar.d.ts.map