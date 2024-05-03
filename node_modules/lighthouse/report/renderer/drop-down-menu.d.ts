/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @typedef {import('./dom.js').DOM} DOM */
export class DropDownMenu {
    /**
     * @param {DOM} dom
     */
    constructor(dom: DOM);
    /** @type {DOM} */
    _dom: DOM;
    /** @type {HTMLElement} */
    _toggleEl: HTMLElement;
    /** @type {HTMLElement} */
    _menuEl: HTMLElement;
    /**
     * Keydown handler for the document.
     * @param {KeyboardEvent} e
     */
    onDocumentKeyDown(e: KeyboardEvent): void;
    /**
     * Click handler for tools button.
     * @param {Event} e
     */
    onToggleClick(e: Event): void;
    /**
     * Handler for tool button.
     * @param {KeyboardEvent} e
     */
    onToggleKeydown(e: KeyboardEvent): void;
    /**
     * Focus out handler for the drop down menu.
     * @param {FocusEvent} e
     */
    onMenuFocusOut(e: FocusEvent): void;
    /**
     * Handler for tool DropDown.
     * @param {KeyboardEvent} e
     */
    onMenuKeydown(e: KeyboardEvent): void;
    /**
     * @param {?HTMLElement=} startEl
     * @return {HTMLElement}
     */
    _getNextMenuItem(startEl?: (HTMLElement | null) | undefined): HTMLElement;
    /**
     * @param {Array<Node>} allNodes
     * @param {?HTMLElement=} startNode
     * @return {HTMLElement}
     */
    _getNextSelectableNode(allNodes: Array<Node>, startNode?: (HTMLElement | null) | undefined): HTMLElement;
    /**
     * @param {?HTMLElement=} startEl
     * @return {HTMLElement}
     */
    _getPreviousMenuItem(startEl?: (HTMLElement | null) | undefined): HTMLElement;
    /**
     * @param {function(MouseEvent): any} menuClickHandler
     */
    setup(menuClickHandler: (arg0: MouseEvent) => any): void;
    close(): void;
    /**
     * @param {HTMLElement} firstFocusElement
     */
    open(firstFocusElement: HTMLElement): void;
}
export type DOM = import('./dom.js').DOM;
//# sourceMappingURL=drop-down-menu.d.ts.map