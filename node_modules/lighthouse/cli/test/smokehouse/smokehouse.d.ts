export type Run = {
    networkRequests: string[] | undefined;
    lhr: LH.Result;
    artifacts: LH.Artifacts;
    lighthouseLog: string;
    assertionLog: string;
};
export type SmokehouseResult = {
    id: string;
    passed: number;
    failed: number;
    runs: Run[];
};
/**
 * Runs the selected smoke tests. Returns whether all assertions pass.
 * @param {Array<Smokehouse.TestDfn>} smokeTestDefns
 * @param {Partial<Smokehouse.SmokehouseOptions>} smokehouseOptions
 * @return {Promise<{success: boolean, testResults: SmokehouseResult[]}>}
 */
export function runSmokehouse(smokeTestDefns: Array<Smokehouse.TestDfn>, smokehouseOptions: Partial<Smokehouse.SmokehouseOptions>): Promise<{
    success: boolean;
    testResults: SmokehouseResult[];
}>;
/**
 * Parses the cli `shardArg` flag into `shardNumber/shardTotal`. Splits
 * `testDefns` into `shardTotal` shards and returns the `shardNumber`th shard.
 * Shards will differ in size by at most 1.
 * Shard params must be 1 ≤ shardNumber ≤ shardTotal.
 * @param {Array<Smokehouse.TestDfn>} testDefns
 * @param {string=} shardArg
 * @return {Array<Smokehouse.TestDfn>}
 */
export function getShardedDefinitions(testDefns: Array<Smokehouse.TestDfn>, shardArg?: string | undefined): Array<Smokehouse.TestDfn>;
export const DEFAULT_RETRIES: 0;
export const DEFAULT_CONCURRENT_RUNS: 5;
//# sourceMappingURL=smokehouse.d.ts.map