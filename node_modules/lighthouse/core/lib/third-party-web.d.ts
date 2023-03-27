declare namespace _default {
    export { getEntity };
    export { getProduct };
    export { isThirdParty };
    export { isFirstParty };
}
export default _default;
export type ThirdPartyEntity = import("third-party-web").IEntity;
export type ThirdPartyProduct = import("third-party-web").IProduct;
/** @typedef {import("third-party-web").IEntity} ThirdPartyEntity */
/** @typedef {import("third-party-web").IProduct} ThirdPartyProduct */
/**
 * @param {string} url
 * @return {ThirdPartyEntity|undefined}
 */
declare function getEntity(url: string): ThirdPartyEntity | undefined;
/**
 * @param {string} url
 * @return {ThirdPartyProduct|undefined}
 */
declare function getProduct(url: string): ThirdPartyProduct | undefined;
/**
 * @param {string} url
 * @param {ThirdPartyEntity | undefined} mainDocumentEntity
 */
declare function isThirdParty(url: string, mainDocumentEntity: ThirdPartyEntity | undefined): boolean;
/**
 * @param {string} url
 * @param {ThirdPartyEntity | undefined} mainDocumentEntity
 */
declare function isFirstParty(url: string, mainDocumentEntity: ThirdPartyEntity | undefined): boolean;
//# sourceMappingURL=third-party-web.d.ts.map