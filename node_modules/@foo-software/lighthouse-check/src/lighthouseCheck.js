import fetchAndWaitForLighthouseAudits from './fetchAndWaitForLighthouseAudits';
import LighthouseCheckError from './LighthouseCheckError';
import triggerLighthouse from './triggerLighthouse';
import localLighthouse from './localLighthouse';
import slackNotify from './slackNotify';
import { NAME, SUCCESS_CODE_GENERIC } from './constants';
import { ERROR_NO_RESULTS } from './errorCodes';
import logResults from './logResults';

export default ({
  apiToken,
  author,
  awsAccessKeyId,
  awsBucket,
  awsRegion,
  awsSecretAccessKey,
  emulatedFormFactor,
  branch,
  locale,
  outputDirectory,
  pr,
  sha,
  tag,
  throttling,
  throttlingMethod,
  timeout,
  urls,
  verbose = true,
  wait = true,
  slackWebhookUrl
}) =>
  new Promise(async (resolve, reject) => {
    try {
      // we either get the result from the API or directly from
      // running a lighthouse audit locally.
      const isLocalAudit = !apiToken;

      // if we're auditing through the lighthouse-check.com API,
      // otherwise we're using Lighthouse directly, locally
      if (!isLocalAudit) {
        const triggerResult = await triggerLighthouse({
          apiToken,
          tag,
          timeout,
          urls,
          verbose
        });

        if (triggerResult.error) {
          reject(triggerResult.error);
          return;
        }

        // if the user understandably doesn't want to wait for results, return right away
        if (!wait) {
          resolve(triggerResult);
          return;
        }

        // if this condition doesn't pass - we got a problem
        if (triggerResult.data) {
          // assemble an array of queueIds
          const queueIds = triggerResult.data.reduce(
            (accumulator, current) => [
              ...accumulator,
              ...(!current.id ? [] : [current.id])
            ],
            []
          );

          // if this condition doesn't pass - we got a problem
          if (queueIds.length) {
            if (!params.verbose) {
              console.log('\n');
            }

            const auditResults = await fetchAndWaitForLighthouseAudits({
              apiToken,
              queueIds,
              timeout,
              verbose
            });

            if (slackWebhookUrl) {
              await slackNotify({
                author,
                branch,
                pr,
                results: auditResults,
                sha,
                slackWebhookUrl,
                verbose
              });
            }

            logResults({ results: auditResults });

            // success
            resolve({
              code: SUCCESS_CODE_GENERIC,
              data: auditResults
            });
            return;
          }
        }

        const errorMessage = 'Failed to retrieve results.';
        if (verbose) {
          console.log(`${NAME}:`, errorMessage);
        }

        reject(
          new LighthouseCheckError(errorMessage, {
            code: ERROR_NO_RESULTS
          })
        );
      } else {
        const lighthouseAudits = await localLighthouse({
          awsAccessKeyId,
          awsBucket,
          awsRegion,
          awsSecretAccessKey,
          emulatedFormFactor,
          locale,
          outputDirectory,
          throttling,
          throttlingMethod,
          urls,
          verbose
        });

        if (!lighthouseAudits.length) {
          reject(
            new LighthouseCheckError('Something went wrong - no results.', {
              code: ERROR_NO_RESULTS
            })
          );
        } else {
          if (slackWebhookUrl) {
            await slackNotify({
              author,
              branch,
              pr,
              results: lighthouseAudits,
              sha,
              slackWebhookUrl,
              verbose
            });
          }

          logResults({ results: lighthouseAudits });

          // success
          resolve({
            code: SUCCESS_CODE_GENERIC,
            data: lighthouseAudits
          });
        }
      }
    } catch (error) {
      if (verbose) {
        console.log(`${NAME}:\n`, error);
      }

      reject(error);
    }
  });
