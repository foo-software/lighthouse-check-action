import fetchLighthouseAudits from './fetchLighthouseAudits';
import LighthouseCheckError from './LighthouseCheckError';
import {
  DEFAULT_FETCH_AND_WAIT_TIMEOUT_MINUTES,
  FETCH_POLL_INTERVAL,
  FETCH_POLL_INTERVAL_SECONDS,
  NAME
} from './constants';
import { ERROR_NO_RESULTS, ERROR_TIMEOUT } from './errorCodes';

export default ({
  apiToken,
  queueIds,
  timeout = DEFAULT_FETCH_AND_WAIT_TIMEOUT_MINUTES,
  verbose = true
}) =>
  new Promise((resolve, reject) => {
    const timeoutMilliseconds = 60000 * timeout;
    const startTime = Date.now();
    let fetchIndex = 0;

    const fetchData = interval =>
      setTimeout(async () => {
        fetchIndex++;

        if (verbose) {
          console.log(
            `${NAME}:`,
            `Starting Lighthouse fetch attempt ${fetchIndex}.`
          );
        }

        const result = await fetchLighthouseAudits({
          apiToken,
          queueIds
        });

        // do we have the expected number of results
        const areResultsExpected =
          result.data && result.data.length === queueIds.length;

        // have we exceeded the timeout
        const now = Date.now();
        const hasExceededTimeout = now - startTime > timeoutMilliseconds;

        // has unexpected error
        const isErrorUnexpected =
          result.error &&
          (!result.error.code || result.error.code !== ERROR_NO_RESULTS);

        const resultLength = !Array.isArray(result.data)
          ? 0
          : result.data.length;

        if (isErrorUnexpected) {
          if (verbose) {
            console.log(
              `${NAME}:`,
              'An unexpected error occurred:\n',
              result.error
            );
          }
          reject(result.error);
          return;
        } else if (areResultsExpected) {
          const audits = result.data.map(current => ({
            name: current.name,
            report: current.report,
            url: current.url,
            tag: current.tag,
            scores: {
              accessibility: current.scoreAccessibility,
              bestPractices: current.scoreBestPractices,
              performance: current.scorePerformance,
              progressiveWebApp: current.scoreProgressiveWebApp,
              seo: current.scoreSeo
            }
          }));

          resolve(audits);
          return;
        } else if (hasExceededTimeout) {
          const errorMessage = `Received ${resultLength} out of ${queueIds.length} results. ${timeout} minute timeout reached.`;
          if (verbose) {
            console.log(`${NAME}:`, errorMessage);
          }

          reject(
            new LighthouseCheckError(errorMessage, {
              code: ERROR_TIMEOUT
            })
          );
          return;
        } else {
          if (verbose) {
            console.log(
              `${NAME}:`,
              `Received ${resultLength} out of ${queueIds.length} results. Trying again in ${FETCH_POLL_INTERVAL_SECONDS} seconds.`
            );
          }

          fetchData(FETCH_POLL_INTERVAL);
        }
      }, interval);

    // we pass in 0 as the interval because we don't need to
    // wait the first time.
    fetchData(0);
  });
