import { table, getBorderCharacters } from 'table';
import getLighthouseAuditTitlesByKey from './helpers/getLighthouseAuditTitlesByKey';

// config for the `table` module (for console logging a table)
const tableConfig = {
  border: getBorderCharacters('ramac')
};

export default ({ results }) => {
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
};
