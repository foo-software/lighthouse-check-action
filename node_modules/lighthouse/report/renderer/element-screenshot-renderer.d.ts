export class ElementScreenshotRenderer {
    /**
     * Given the location of an element and the sizes of the preview and screenshot,
     * compute the absolute positions (in screenshot coordinate scale) of the screenshot content
     * and the highlighted rect around the element.
     * @param {Rect} elementRectSC
     * @param {Size} elementPreviewSizeSC
     * @param {Size} screenshotSize
     */
    static getScreenshotPositions(elementRectSC: Rect, elementPreviewSizeSC: Size, screenshotSize: Size): {
        screenshot: {
            left: number;
            top: number;
        };
        clip: {
            left: number;
            top: number;
        };
    };
    /**
     * Render a clipPath SVG element to assist marking the element's rect.
     * The elementRect and previewSize are in screenshot coordinate scale.
     * @param {DOM} dom
     * @param {HTMLElement} maskEl
     * @param {{left: number, top: number}} positionClip
     * @param {Rect} elementRect
     * @param {Size} elementPreviewSize
     */
    static renderClipPathInScreenshot(dom: DOM, maskEl: HTMLElement, positionClip: {
        left: number;
        top: number;
    }, elementRect: Rect, elementPreviewSize: Size): void;
    /**
     * Called by report renderer. Defines a css variable used by any element screenshots
     * in the provided report element.
     * Allows for multiple Lighthouse reports to be rendered on the page, each with their
     * own full page screenshot.
     * @param {HTMLElement} el
     * @param {LH.Result.FullPageScreenshot['screenshot']} screenshot
     */
    static installFullPageScreenshot(el: HTMLElement, screenshot: LH.Result.FullPageScreenshot['screenshot']): void;
    /**
     * Installs the lightbox elements and wires up click listeners to all .lh-element-screenshot elements.
     * @param {InstallOverlayFeatureParams} opts
     */
    static installOverlayFeature(opts: InstallOverlayFeatureParams): void;
    /**
     * Given the size of the element in the screenshot and the total available size of our preview container,
     * compute the factor by which we need to zoom out to view the entire element with context.
     * @param {Rect} elementRectSC
     * @param {Size} renderContainerSizeDC
     * @return {number}
     */
    static _computeZoomFactor(elementRectSC: Rect, renderContainerSizeDC: Size): number;
    /**
     * Renders an element with surrounding context from the full page screenshot.
     * Used to render both the thumbnail preview in details tables and the full-page screenshot in the lightbox.
     * Returns null if element rect is outside screenshot bounds.
     * @param {DOM} dom
     * @param {LH.Result.FullPageScreenshot['screenshot']} screenshot
     * @param {Rect} elementRectSC Region of screenshot to highlight.
     * @param {Size} maxRenderSizeDC e.g. maxThumbnailSize or maxLightboxSize.
     * @return {Element|null}
     */
    static render(dom: DOM, screenshot: LH.Result.FullPageScreenshot['screenshot'], elementRectSC: Rect, maxRenderSizeDC: Size): Element | null;
}
export type DOM = import('./dom.js').DOM;
export type Rect = LH.Audit.Details.Rect;
export type Size = {
    width: number;
    height: number;
};
export type InstallOverlayFeatureParams = {
    dom: DOM;
    rootEl: Element;
    overlayContainerEl: Element;
    fullPageScreenshot: LH.Result.FullPageScreenshot;
};
//# sourceMappingURL=element-screenshot-renderer.d.ts.map