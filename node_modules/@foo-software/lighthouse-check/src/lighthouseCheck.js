import path from 'path';
import fetchAndWaitForLighthouseAudits from './fetchAndWaitForLighthouseAudits';
import LighthouseCheckError from './LighthouseCheckError';
import triggerLighthouse from './triggerLighthouse';
import localLighthouse from './localLighthouse';
import postPrComment from './postPrComment';
import slackNotify from './slackNotify';
import writeResults from './helpers/writeResults';
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
  emulatedFormFactor = 'mobile',
  extraHeaders,
  branch,
  isGitHubAction,
  isOrb,
  locale,
  maxWaitForLoad,
  outputDirectory,
  overridesJsonFile,
  pr,
  prCommentAccessToken,
  prCommentEnabled = true,
  prCommentSaveOld = false,
  prCommentUrl,
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
      const outputDirectoryPath = !outputDirectory
        ? outputDirectory
        : path.resolve(outputDirectory);

      // we either get the result from the API or directly from
      // running a lighthouse audit locally.
      const isLocalAudit = !apiToken;

      // if we're auditing through the foo.software API,
      // otherwise we're using Lighthouse directly, locally
      if (!isLocalAudit) {
        const triggerResult = await triggerLighthouse({
          apiToken,
          isGitHubAction,
          isOrb,
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
            if (!verbose) {
              console.log('\n');
            }

            const auditResults = await fetchAndWaitForLighthouseAudits({
              apiToken,
              queueIds,
              timeout,
              verbose
            });

            // if output directory is specified write the results to disk
            if (outputDirectoryPath) {
              writeResults({
                outputDirectory: outputDirectoryPath,
                results: auditResults
              });
            }

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

            if (prCommentEnabled && prCommentUrl && prCommentAccessToken) {
              await postPrComment({
                isGitHubAction,
                isLocalAudit,
                isOrb,
                prCommentAccessToken,
                prCommentSaveOld,
                prCommentUrl,
                results: auditResults,
                verbose
              });
            }

            logResults({
              isGitHubAction,
              isLocalAudit,
              isOrb,
              results: auditResults
            });

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
          extraHeaders,
          locale,
          outputDirectory: outputDirectoryPath,
          overridesJsonFile:
            overridesJsonFile && path.resolve(overridesJsonFile),
          maxWaitForLoad,
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

          if (prCommentEnabled && prCommentUrl && prCommentAccessToken) {
            await postPrComment({
              isGitHubAction,
              isLocalAudit,
              isOrb,
              prCommentAccessToken,
              prCommentSaveOld,
              prCommentUrl,
              results: lighthouseAudits,
              verbose
            });
          }

          logResults({
            isGitHubAction,
            isLocalAudit,
            isOrb,
            results: lighthouseAudits
          });

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
