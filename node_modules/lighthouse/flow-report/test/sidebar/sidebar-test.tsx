/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {render} from '@testing-library/preact';
import {FunctionComponent} from 'preact';

import {I18nProvider} from '../../src/i18n/i18n';
import {SidebarHeader, SidebarRuntimeSettings, SidebarSummary} from '../../src/sidebar/sidebar';
import {FlowResultContext} from '../../src/util';
import {flowResult} from '../sample-flow';


let wrapper: FunctionComponent;

beforeEach(() => {
  wrapper = ({children}) => (
    <FlowResultContext.Provider value={flowResult}>
      <I18nProvider>
        {children}
      </I18nProvider>
    </FlowResultContext.Provider>
  );
});

describe('SidebarHeader', () => {
  it('renders title content', async () => {
    const title = 'Lighthouse flow report';
    const date = '2021-08-03T18:28:13.296Z';
    const root = render(<SidebarHeader title={title} date={date}/>, {wrapper});

    expect(root.getByText(title)).toBeTruthy();
    expect(root.getByText('Aug 3, 2021, 6:28 PM UTC')).toBeTruthy();
  });
});

describe('SidebarSummary', () => {
  it('highlighted by default', async () => {
    const root = render(<SidebarSummary/>, {wrapper});
    const link = root.getByRole('link') as HTMLAnchorElement;

    expect(link.href).toEqual('file:///Users/example/report.html/#');
    expect(link.classList).toContain('Sidebar--current');
  });
});

describe('SidebarRuntimeSettings', () => {
  it('displays default runtime settings', async () => {
    const settings = {
      formFactor: 'mobile',
      throttlingMethod: 'simulate',
      throttling: {
        cpuSlowdownMultiplier: 4,
        requestLatencyMs: 150 * 3.75,
        downloadThroughputKbps: 1.6 * 1024 * 0.9,
        uploadThroughputKbps: 750 * 0.9,
        throughputKbps: 1.6 * 1024,
        rttMs: 150,
      },
    } as any;
    const root = render(<SidebarRuntimeSettings settings={settings}/>, {wrapper});

    expect(root.getByText('Emulated Moto G4')).toBeTruthy();
    expect(root.getByText('Slow 4G throttling')).toBeTruthy();
    expect(root.getByText('4x slowdown'));
  });

  it('displays custom runtime settings', async () => {
    const settings = {
      formFactor: 'desktop',
      throttlingMethod: 'devtools',
      throttling: {
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 1,
        downloadThroughputKbps: 1,
        uploadThroughputKbps: 1,
        throughputKbps: 1,
        rttMs: 1,
      },
    } as any;
    const root = render(<SidebarRuntimeSettings settings={settings}/>, {wrapper});

    expect(root.getByText('Emulated Desktop')).toBeTruthy();
    expect(root.getByText('Custom throttling')).toBeTruthy();
    expect(root.getByText('1x slowdown'));
  });
});
