// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import {strict as assert} from 'assert';
import test from 'node:test';

import {analyzeTrace} from '../analyze-trace.mjs';

const filename = './test/invalid-animation-events.json.gz';
const data = await analyzeTrace(filename);

test('key values are populated', t => {
  assert.equal(data.Renderer.allTraceEntries.length > 90_000, true);
  assert.equal(data.Screenshots.length > 2, true);
  assert.equal(data.Meta.threadsInProcess.size > 2, true);
  assert.equal(data.Meta.mainFrameNavigations.length > 0, true);
});

test('numeric values are set and look legit', t => {
  const shouldBeNumbers = [
    data.Meta.traceBounds.min,
    data.Meta.traceBounds.max,
    data.Meta.traceBounds.range,
    data.Meta.browserProcessId,
    data.Meta.browserThreadId,
    data.Meta.gpuProcessId,
    data.Meta.gpuThreadId,
    Array.from(data.Meta.topLevelRendererIds.values()).at(0),
    Array.from(data.Meta.frameByProcessId.keys()).at(0),
  ];
  for (const datum of shouldBeNumbers) {
    assert.equal(isNaN(datum), false);
    assert.equal(typeof datum, 'number');
    assert.equal(datum > 10, true);
  }
});

test('string values are set and look legit', t => {
  const shouldBeStrings = [
    data.Meta.mainFrameId,
    data.Meta.mainFrameURL,
    Array.from(data.Meta.navigationsByFrameId.keys()).at(0),
    Array.from(data.Meta.navigationsByNavigationId.keys()).at(0),
    data.Meta.mainFrameId,
  ];

  for (const datum of shouldBeStrings) {
    assert.equal(typeof datum, 'string');
    assert.equal(datum.length > 10, true);
  }
});
