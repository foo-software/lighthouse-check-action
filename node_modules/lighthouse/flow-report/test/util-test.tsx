/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {jest} from '@jest/globals';
import {render} from '@testing-library/preact';
import {renderHook} from '@testing-library/preact-hooks';
import {FunctionComponent} from 'preact';
import {act} from 'preact/test-utils';

import {FlowResultContext, useExternalRenderer, useHashState} from '../src/util';
import {flowResult} from './sample-flow';

let wrapper: FunctionComponent;

beforeEach(() => {
  global.console.warn = jest.fn();
  wrapper = ({children}) => (
    <FlowResultContext.Provider value={flowResult}>{children}</FlowResultContext.Provider>
  );
});

describe('useHashState', () => {
  it('gets current lhr index from url hash', () => {
    global.location.hash = '#index=1';
    const {result} = renderHook(() => useHashState(), {wrapper});
    expect(console.warn).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      index: 1,
      currentLhr: flowResult.steps[1].lhr,
      anchor: null,
    });
  });

  it('gets anchor id from url hash', () => {
    global.location.hash = '#index=1&anchor=seo';
    const {result} = renderHook(() => useHashState(), {wrapper});
    expect(console.warn).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      index: 1,
      currentLhr: flowResult.steps[1].lhr,
      anchor: 'seo',
    });
  });

  it('changes on navigation', async () => {
    global.location.hash = '#index=1';
    const render = renderHook(() => useHashState(), {wrapper});

    expect(render.result.current).toEqual({
      index: 1,
      currentLhr: flowResult.steps[1].lhr,
      anchor: null,
    });

    await act(() => {
      global.location.hash = '#index=2&anchor=seo';
    });
    await render.waitForNextUpdate();

    expect(console.warn).not.toHaveBeenCalled();
    expect(render.result.current).toEqual({
      index: 2,
      currentLhr: flowResult.steps[2].lhr,
      anchor: 'seo',
    });
  });

  it('return null if lhr index is unset', () => {
    const {result} = renderHook(() => useHashState(), {wrapper});
    expect(console.warn).not.toHaveBeenCalled();
    expect(result.current).toBeNull();
  });

  it('return null if lhr index is out of bounds', () => {
    global.location.hash = '#index=5';
    const {result} = renderHook(() => useHashState(), {wrapper});
    expect(console.warn).toHaveBeenCalled();
    expect(result.current).toBeNull();
  });

  it('returns null for invalid value', () => {
    global.location.hash = '#index=OHNO';
    const {result} = renderHook(() => useHashState(), {wrapper});
    expect(console.warn).toHaveBeenCalled();
    expect(result.current).toBeNull();
  });

  it('returns null for invalid value with valid anchor', () => {
    global.location.hash = '#index=OHNO&anchor=seo';
    const {result} = renderHook(() => useHashState(), {wrapper});
    expect(console.warn).toHaveBeenCalled();
    expect(result.current).toBeNull();
  });
});

describe('useExternalRenderer', () => {
  it('attaches DOM subtree of render callback', () => {
    const Container: FunctionComponent = () => {
      const ref = useExternalRenderer<HTMLDivElement>(() => {
        const el = document.createElement('div');
        el.textContent = 'Some text';
        return el;
      });
      return <div ref={ref}/>;
    };

    const root = render(<Container/>);

    expect(root.getByText('Some text')).toBeTruthy();
  });

  it('re-renders DOM subtree when input changes', () => {
    const Container: FunctionComponent<{text: string}> = ({text}) => {
      const ref = useExternalRenderer<HTMLDivElement>(() => {
        const el = document.createElement('div');
        el.textContent = text;
        return el;
      }, [text]);
      return <div ref={ref}/>;
    };

    const root = render(<Container text="Some text"/>);

    expect(root.getByText('Some text')).toBeTruthy();

    root.rerender(<Container text="New text"/>);

    expect(root.getByText('New text')).toBeTruthy();
  });
});
