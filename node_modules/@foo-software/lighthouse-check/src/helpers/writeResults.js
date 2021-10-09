import fs from 'fs';
import { NAME_RESULTS_JSON_FILE } from '../constants';

export default ({ outputDirectory, results }) => {
  const resultsJsonFile = `${outputDirectory}/${NAME_RESULTS_JSON_FILE}`;
  fs.writeFileSync(resultsJsonFile, JSON.stringify(results));
};
