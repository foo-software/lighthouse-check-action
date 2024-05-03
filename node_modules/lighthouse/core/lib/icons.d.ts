/**
 * @license
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @param {NonNullable<LH.Artifacts.Manifest['value']>} manifest
 * @return {boolean} Does the manifest have any icons?
 */
export function doExist(manifest: NonNullable<LH.Artifacts.Manifest['value']>): boolean;
/**
 * @param {number} sizeRequirement
 * @param {NonNullable<LH.Artifacts.Manifest['value']>} manifest
 * @return {Array<string>} Value of satisfactory sizes (eg. ['192x192', '256x256'])
 */
export function pngSizedAtLeast(sizeRequirement: number, manifest: NonNullable<LH.Artifacts.Manifest['value']>): Array<string>;
/**
 * @param {NonNullable<LH.Artifacts.Manifest['value']>} manifest
 * @return {boolean} Does the manifest icons value contain at least one icon with purpose including "maskable"
 */
export function containsMaskableIcon(manifest: NonNullable<LH.Artifacts.Manifest['value']>): boolean;
//# sourceMappingURL=icons.d.ts.map