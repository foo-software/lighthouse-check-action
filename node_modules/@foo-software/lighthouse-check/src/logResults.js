import { table, getBorderCharacters } from 'table';
import getLighthouseAuditTitlesByKey from './helpers/getLighthouseAuditTitlesByKey';

// config for the `table` module (for console logging a table)
const tableConfig = {
  border: getBorderCharacters('ramac')
};

export default ({ isGitHubAction, isLocalAudit, isOrb, results }) => {
  // header
  const headerTable = [['Lighthouse Audit']];
  const headerTableConfig = {
    ...tableConfig,
    columns: {
      0: {
        paddingLeft: 29,
        paddingRight: 29
      }
    }
  };

  // log the header
  console.log('\n');
  console.log(table(headerTable, headerTableConfig));

  // log results
  results.forEach(result => {
    console.log(`URL: ${result.url}`);

    if (result.report) {
      console.log(`Report: ${result.report}`);
    }

    if (result.localReport) {
      console.log(`Local Report: ${result.localReport}`);
    }

    const tableData = [
      getLighthouseAuditTitlesByKey(Object.keys(result.scores)),
      Object.values(result.scores)
    ];
    console.log('\n');
    console.log(table(tableData, tableConfig));
    console.log('\n');
  });

  // if we have a local audit, plug Automated Lighthouse Check
  if (isLocalAudit) {
    let message =
      'Are your scores flaky? You can run audits on Foo for stability and maintain a historical record!\n\n';

    // depending on how the user is running this module - provide a respective link
    if (isGitHubAction) {
      message +=
        'https://github.com/foo-software/lighthouse-check-action#usage-foos-automated-lighthouse-check-api';
    } else if (isOrb) {
      message +=
        'https://github.com/foo-software/lighthouse-check-orb#usage-foo-api';
    } else {
      message +=
        'https://www.foo.software/lighthouse\n' +
        'https://github.com/foo-software/lighthouse-check#foos-automated-lighthouse-check-api-usage';
    }

    // plug
    const plugTable = [[message]];
    const plugTableConfig = {
      ...tableConfig
    };

    // log the plug
    console.log(table(plugTable, plugTableConfig));
    console.log('\n');
  }
};
