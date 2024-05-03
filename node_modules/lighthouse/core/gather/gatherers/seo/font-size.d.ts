export default FontSize;
export type NodeFontData = LH.Artifacts.FontSize['analyzedFailingNodesData'][0];
export type BackendIdsToFontData = Map<number, {
    fontSize: number;
    textLength: number;
}>;
declare class FontSize extends BaseGatherer {
    /**
     * @param {LH.Gatherer.ProtocolSession} session
     * @param {Array<NodeFontData>} failingNodes
     */
    static fetchFailingNodeSourceRules(session: LH.Gatherer.ProtocolSession, failingNodes: Array<NodeFontData>): Promise<{
        analyzedFailingNodesData: {
            nodeId: number;
            fontSize: number;
            textLength: number;
            parentNode: {
                backendNodeId: number;
                attributes: string[];
                nodeName: string;
                parentNode?: {
                    backendNodeId: number;
                    attributes: string[];
                    nodeName: string;
                } | undefined;
            };
            cssRule?: {
                type: "Inline" | "Regular" | "Attributes";
                range?: {
                    startLine: number;
                    startColumn: number;
                } | undefined;
                parentRule?: {
                    origin: import("devtools-protocol").Protocol.CSS.StyleSheetOrigin;
                    selectors: {
                        text: string;
                    }[];
                } | undefined;
                styleSheetId?: string | undefined;
                stylesheet?: import("devtools-protocol").Protocol.CSS.CSSStyleSheetHeader | undefined;
                cssProperties?: import("devtools-protocol").Protocol.CSS.CSSProperty[] | undefined;
            } | undefined;
        }[];
        analyzedFailingTextLength: number;
    }>;
    /**
     * Returns the TextNodes in a DOM Snapshot.
     * Every entry is associated with a TextNode in the layout tree (not display: none).
     * @param {LH.Crdp.DOMSnapshot.CaptureSnapshotResponse} snapshot
     */
    getTextNodesInLayoutFromSnapshot(snapshot: LH.Crdp.DOMSnapshot.CaptureSnapshotResponse): {
        nodeIndex: number;
        backendNodeId: number;
        fontSize: number;
        textLength: number;
        parentNode: {
            parentNode: {
                backendNodeId: number;
                attributes: string[];
                nodeName: string;
            } | undefined;
            backendNodeId: number;
            attributes: string[];
            nodeName: string;
        };
    }[];
    /**
     * Get all the failing text nodes that don't meet the legible text threshold.
     * @param {LH.Crdp.DOMSnapshot.CaptureSnapshotResponse} snapshot
     */
    findFailingNodes(snapshot: LH.Crdp.DOMSnapshot.CaptureSnapshotResponse): {
        totalTextLength: number;
        failingTextLength: number;
        failingNodes: {
            nodeId: number;
            fontSize: number;
            textLength: number;
            parentNode: {
                backendNodeId: number;
                attributes: string[];
                nodeName: string;
                parentNode?: {
                    backendNodeId: number;
                    attributes: string[];
                    nodeName: string;
                } | undefined;
            };
            cssRule?: {
                type: "Inline" | "Regular" | "Attributes";
                range?: {
                    startLine: number;
                    startColumn: number;
                } | undefined;
                parentRule?: {
                    origin: import("devtools-protocol").Protocol.CSS.StyleSheetOrigin;
                    selectors: {
                        text: string;
                    }[];
                } | undefined;
                styleSheetId?: string | undefined;
                stylesheet?: import("devtools-protocol").Protocol.CSS.CSSStyleSheetHeader | undefined;
                cssProperties?: import("devtools-protocol").Protocol.CSS.CSSProperty[] | undefined;
            } | undefined;
        }[];
    };
    /**
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<LH.Artifacts.FontSize>} font-size analysis
     */
    getArtifact(passContext: LH.Gatherer.Context): Promise<LH.Artifacts.FontSize>;
}
/**
 * Returns the governing/winning CSS font-size rule for the set of styles given.
 * This is roughly a stripped down version of the CSSMatchedStyle class in DevTools.
 *
 * @see https://cs.chromium.org/chromium/src/third_party/blink/renderer/devtools/front_end/sdk/CSSMatchedStyles.js?q=CSSMatchedStyles+f:devtools+-f:out&sq=package:chromium&dr=C&l=59-134
 * @param {LH.Crdp.CSS.GetMatchedStylesForNodeResponse} matched CSS rules
 * @return {NodeFontData['cssRule']|undefined}
 */
export function getEffectiveFontRule({ attributesStyle, inlineStyle, matchedCSSRules, inherited }: LH.Crdp.CSS.GetMatchedStylesForNodeResponse): NodeFontData['cssRule'] | undefined;
/**
 * Finds the most specific directly matched CSS font-size rule from the list.
 *
 * @param {Array<LH.Crdp.CSS.RuleMatch>} matchedCSSRules
 * @param {function(LH.Crdp.CSS.CSSStyle):boolean|string|undefined} isDeclarationOfInterest
 * @return {NodeFontData['cssRule']|undefined}
 */
export function findMostSpecificMatchedCSSRule(matchedCSSRules: import("devtools-protocol").Protocol.CSS.RuleMatch[] | undefined, isDeclarationOfInterest: (arg0: LH.Crdp.CSS.CSSStyle) => boolean | string | undefined): NodeFontData['cssRule'] | undefined;
import BaseGatherer from '../../base-gatherer.js';
//# sourceMappingURL=font-size.d.ts.map