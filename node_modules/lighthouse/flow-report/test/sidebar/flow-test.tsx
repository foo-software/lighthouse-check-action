import fs from 'fs';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

import {render} from '@testing-library/preact';
import {FunctionComponent} from 'preact';

import {SidebarFlow} from '../../src/sidebar/flow';
import {FlowResultContext} from '../../src/util';


const flowResult = JSON.parse(
  fs.readFileSync(
    // eslint-disable-next-line max-len
    `${dirname(fileURLToPath(import.meta.url))}/../../../lighthouse-core/test/fixtures/fraggle-rock/reports/sample-lhrs.json`,
    'utf-8'
  )
);

let wrapper: FunctionComponent;

beforeEach(() => {
  wrapper = ({children}) => (
    <FlowResultContext.Provider value={flowResult}>{children}</FlowResultContext.Provider>
  );
});

describe('SidebarFlow', () => {
  it('renders flow steps', async () => {
    const root = render(<SidebarFlow/>, {wrapper});

    const navigation = root.getByText('Navigation report (www.mikescerealshack.co/)');
    const timespan = root.getByText('Search input');
    const snapshot = root.getByText('Search results');
    const navigation2 = root.getByText('Navigation report (www.mikescerealshack.co/corrections)');

    const links = root.getAllByRole('link') as HTMLAnchorElement[];
    expect(links.map(a => a.textContent)).toEqual([
      navigation.textContent,
      timespan.textContent,
      snapshot.textContent,
      navigation2.textContent,
    ]);
    expect(links.map(a => a.href)).toEqual([
      'file:///Users/example/report.html/#index=0',
      'file:///Users/example/report.html/#index=1',
      'file:///Users/example/report.html/#index=2',
      'file:///Users/example/report.html/#index=3',
    ]);
  });

  it('no steps highlighted on summary page', async () => {
    const root = render(<SidebarFlow/>, {wrapper});

    const links = root.getAllByRole('link');
    const highlighted = links.filter(h => h.classList.contains('Sidebar--current'));

    expect(highlighted).toHaveLength(0);
  });

  it('highlight current step', async () => {
    global.location.hash = '#index=1';
    const root = render(<SidebarFlow/>, {wrapper});

    const links = root.getAllByRole('link');
    const highlighted = links.filter(h => h.classList.contains('Sidebar--current'));

    expect(highlighted).toHaveLength(1);
    expect(links[1]).toEqual(highlighted[0]);
  });
});
