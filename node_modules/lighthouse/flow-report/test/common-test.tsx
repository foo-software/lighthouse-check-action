/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {jest} from '@jest/globals';
import {act, render} from '@testing-library/preact';

import {FlowStepThumbnail} from '../src/common';

let lhr: LH.Result;

jest.useFakeTimers();

describe('FlowStepThumbnail', () => {
  beforeEach(() => {
    global.console.warn = jest.fn();

    lhr = {
      gatherMode: 'navigation',
      configSettings: {screenEmulation: {width: 400, height: 600}},
      audits: {
        'full-page-screenshot': {
          details: {
            type: 'full-page-screenshot',
            screenshot: {data: 'FPS', width: 400, height: 600},
            nodes: {},
          },
        },
        'screenshot-thumbnails': {
          details: {
            type: 'filmstrip',
            items: [
              {data: 'frame1'},
              {data: 'frame2'},
            ],
          },
        },
      },
    } as any;
  });

  it('renders a thumbnail', () => {
    const root = render(<FlowStepThumbnail lhr={lhr} width={200} height={200} />);

    const thumbnail = root.getByAltText(/Screenshot/);
    expect(thumbnail.style.width).toEqual('200px');
    expect(thumbnail.style.height).toEqual('200px');
  });

  it('renders nothing without dimensions', () => {
    const root = render(<FlowStepThumbnail lhr={lhr} />);

    expect(() => root.getByAltText(/Screenshot/)).toThrow();
    expect(global.console.warn).toHaveBeenCalled();
  });

  it('interpolates height', () => {
    const root = render(<FlowStepThumbnail lhr={lhr} width={200} />);

    const thumbnail = root.getByAltText(/Screenshot/);
    expect(thumbnail.style.width).toEqual('200px');
    expect(thumbnail.style.height).toEqual('300px');
  });

  it('interpolates width', () => {
    const root = render(<FlowStepThumbnail lhr={lhr} height={150} />);

    const thumbnail = root.getByAltText(/Screenshot/);
    expect(thumbnail.style.width).toEqual('100px');
    expect(thumbnail.style.height).toEqual('150px');
  });

  it('uses last filmstrip thumbnail', () => {
    const root = render(<FlowStepThumbnail lhr={lhr} height={150} />);

    const thumbnail = root.getByAltText(/Screenshot/) as HTMLImageElement;
    expect(thumbnail.src).toContain('frame2');
  });

  it('uses full page screenshot if filmstrip unavailable', () => {
    delete lhr.audits['screenshot-thumbnails'];
    const root = render(<FlowStepThumbnail lhr={lhr} height={150} />);

    const thumbnail = root.getByAltText(/Screenshot/) as HTMLImageElement;
    expect(thumbnail.src).toContain('FPS');
  });

  it('renders animated thumbnail for timespan', async () => {
    lhr.gatherMode = 'timespan';
    const root = render(<FlowStepThumbnail lhr={lhr} height={150} />);

    const thumbnail = root.getByAltText(/Animated/) as HTMLImageElement;
    expect(thumbnail.style.width).toEqual('100px');
    expect(thumbnail.style.height).toEqual('150px');

    expect(thumbnail.src).toContain('frame1');
    await act(() => {
      jest.advanceTimersByTime(501);
    });
    expect(thumbnail.src).toContain('frame2');
  });
});
