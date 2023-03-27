export { ImageRecordsComputed as ImageRecords };
declare const ImageRecordsComputed: typeof ImageRecords & {
    request: (dependencies: {
        ImageElements: LH.Artifacts['ImageElements'];
        networkRecords: LH.Artifacts.NetworkRequest[];
    }, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<import("../index.js").Artifacts.ImageElementRecord[]>;
};
declare class ImageRecords {
    /**
     * @param {LH.Artifacts.NetworkRequest[]} networkRecords
     */
    static indexNetworkRecords(networkRecords: LH.Artifacts.NetworkRequest[]): Record<string, import("../lib/network-request.js").NetworkRequest>;
    /**
     * @param {{ImageElements: LH.Artifacts['ImageElements'], networkRecords: LH.Artifacts.NetworkRequest[]}} data
     * @return {Promise<LH.Artifacts.ImageElementRecord[]>}
     */
    static compute_(data: {
        ImageElements: LH.Artifacts['ImageElements'];
        networkRecords: LH.Artifacts.NetworkRequest[];
    }): Promise<LH.Artifacts.ImageElementRecord[]>;
}
//# sourceMappingURL=image-records.d.ts.map