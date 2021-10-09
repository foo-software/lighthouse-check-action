/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import fs from 'fs';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

import {render} from '@testing-library/preact';
import {FunctionComponent} from 'preact';

import {SummaryHeader, SummaryFlowStep} from '../../src/summary/summary';
import {FlowResultContext} from '../../src/util';
import {ReportRendererProvider} from '../../src/wrappers/report-renderer';

const flowResult: LH.FlowResult = JSON.parse(
  fs.readFileSync(
    // eslint-disable-next-line max-len
    `${dirname(fileURLToPath(import.meta.url))}/../../../lighthouse-core/test/fixtures/fraggle-rock/reports/sample-lhrs.json`,
    'utf-8'
  )
);

let wrapper: FunctionComponent;

beforeEach(() => {
  wrapper = ({children}) => (
    <FlowResultContext.Provider value={flowResult}>
      <ReportRendererProvider>
        {children}
      </ReportRendererProvider>
    </FlowResultContext.Provider>
  );
});

describe('SummaryHeader', () => {
  it('renders header content', async () => {
    const root = render(<SummaryHeader/>, {wrapper});

    const lhrCounts = root.getByText(/·/);
    expect(root.getByText('Summary')).toBeTruthy();
    expect(lhrCounts.textContent).toEqual(
      '2 navigation reports · 1 timespan reports · 1 snapshot reports'
    );
  });
});

describe('SummaryFlowStep', () => {
  it('renders navigation step', async () => {
    const root = render(<SummaryFlowStep
      lhr={flowResult.steps[0].lhr}
      label="Navigation (1)"
      hashIndex={0}
    />, {wrapper});

    expect(root.getByTestId('SummaryNavigationHeader')).toBeTruthy();

    expect(root.getByText('Navigation (1)')).toBeTruthy();

    const screenshot = root.getByTestId('SummaryFlowStep__screenshot') as HTMLImageElement;
    expect(screenshot.src).toMatch(/data:image\/jpeg;base64/);

    const gauges = root.getAllByTestId('CategoryScore');
    expect(gauges).toHaveLength(4);

    const links = root.getAllByRole('link') as HTMLAnchorElement[];
    expect(links.map(a => a.href)).toEqual([
      'file:///Users/example/report.html/#index=0',
      'file:///Users/example/report.html/#index=0&anchor=performance',
      'file:///Users/example/report.html/#index=0&anchor=accessibility',
      'file:///Users/example/report.html/#index=0&anchor=best-practices',
      'file:///Users/example/report.html/#index=0&anchor=seo',
    ]);
  });

  it('renders timespan step', async () => {
    const root = render(<SummaryFlowStep
      lhr={flowResult.steps[1].lhr}
      label="Timespan (1)"
      hashIndex={1}
    />, {wrapper});

    expect(() => root.getByTestId('SummaryNavigationHeader')).toThrow();

    expect(root.getByText('Timespan (1)')).toBeTruthy();

    const screenshot = root.getByTestId('SummaryFlowStep__screenshot') as HTMLImageElement;
    expect(screenshot.src).toBeFalsy();

    // Accessibility and SEO are missing in timespan.
    const nullCategories = root.getAllByTestId('SummaryCategory__null');
    expect(nullCategories).toHaveLength(2);

    const gauges = root.getAllByTestId('CategoryScore');
    expect(gauges).toHaveLength(2);

    const links = root.getAllByRole('link') as HTMLAnchorElement[];
    expect(links.map(a => a.href)).toEqual([
      'file:///Users/example/report.html/#index=1',
      'file:///Users/example/report.html/#index=1&anchor=performance',
      'file:///Users/example/report.html/#index=1&anchor=best-practices',
    ]);
  });

  it('renders snapshot step', async () => {
    const root = render(<SummaryFlowStep
      lhr={flowResult.steps[2].lhr}
      label="Snapshot (1)"
      hashIndex={2}
    />, {wrapper});

    expect(() => root.getByTestId('SummaryNavigationHeader')).toThrow();

    expect(root.getByText('Snapshot (1)')).toBeTruthy();

    const screenshot = root.getByTestId('SummaryFlowStep__screenshot') as HTMLImageElement;
    expect(screenshot.src).toMatch(/data:image\/jpeg;base64/);

    const gauges = root.getAllByTestId('CategoryScore');
    expect(gauges).toHaveLength(4);

    const links = root.getAllByRole('link') as HTMLAnchorElement[];
    expect(links.map(a => a.href)).toEqual([
      'file:///Users/example/report.html/#index=2',
      'file:///Users/example/report.html/#index=2&anchor=performance',
      'file:///Users/example/report.html/#index=2&anchor=accessibility',
      'file:///Users/example/report.html/#index=2&anchor=best-practices',
      'file:///Users/example/report.html/#index=2&anchor=seo',
    ]);
  });
});
