import get from 'lodash.get';
import fetch from './fetch';
import LighthouseCheckError from './LighthouseCheckError';
import {
  API_PAGES_PATH,
  API_QUEUE_ITEMS_PATH,
  API_URL,
  DEFAULT_TAG,
  NAME,
  SOURCE_GITHUB_ACTION,
  SOURCE_CIRCLECI_ORB,
  SUCCESS_CODE_GENERIC,
  TRIGGER_TYPE
} from './constants';
import {
  ERROR_GENERIC,
  ERROR_NO_RESULTS,
  ERROR_NO_URLS,
  ERROR_UNAUTHORIZED,
  ERROR_QUEUE_MAX_USED_DAY
} from './errorCodes';

export default async ({
  apiToken,
  isGitHubAction,
  isOrb,
  tag,
  urls = [],
  verbose = true
}) => {
  try {
    let apiTokens = urls;

    // if urls was not provided - run on all pages
    if (!Array.isArray(urls) || !urls.length) {
      if (verbose) {
        console.log(`${NAME}:`, 'Fetching URLs from account.');
      }

      const pagesResponse = await fetch(`${API_URL}${API_PAGES_PATH}`, {
        method: 'get',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json'
        }
      });
      const pagesJson = await pagesResponse.json();

      if (pagesJson.status >= 400) {
        const errorMessage = `Account wasn't found for the provided API token.`;
        if (verbose) {
          console.log(`${NAME}:`, errorMessage);
        }

        throw new LighthouseCheckError(errorMessage, {
          code: ERROR_UNAUTHORIZED
        });
      }

      const pages = get(pagesJson, 'data.page', []);
      if (!pages.length) {
        const errorMessage = 'No URLs were found for this account.';

        if (verbose) {
          console.log(`${NAME}:`, errorMessage);
        }

        throw new LighthouseCheckError(errorMessage, {
          code: ERROR_NO_URLS
        });
      }

      apiTokens = pages.map(current => current.apiToken);
    }

    if (verbose) {
      console.log(`${NAME}:`, 'Enqueueing Lighthouse audits.');
    }

    // pass in the source of the queued item for tracking
    let source = 'api';
    if (isGitHubAction) {
      source = SOURCE_GITHUB_ACTION;
    } else if (isOrb) {
      source = SOURCE_CIRCLECI_ORB;
    }

    // enqueue urls for Lighthouse audits
    const queueItemsResponse = await fetch(
      `${API_URL}${API_QUEUE_ITEMS_PATH}`,
      {
        method: 'post',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tag: tag || DEFAULT_TAG,
          pages: apiTokens.join(),
          source,
          type: TRIGGER_TYPE
        })
      }
    );
    const queueItemsJson = await queueItemsResponse.json();
    const queue = get(queueItemsJson, 'data.queue');

    // if no results
    if (!queue.results.length) {
      const errorMessage = 'No results.';
      if (verbose) {
        console.log(`${NAME}:`, errorMessage);
      }

      throw new LighthouseCheckError(errorMessage, {
        code: ERROR_NO_RESULTS
      });
    }

    // if the API responded with error/s, set a message to be used later
    let apiErrorMessage;
    if (queue.errors) {
      apiErrorMessage = `${NAME}: Below is the API response for attempted URLs as an array.`;
    }

    // if all urls failed to be enqueued...
    if (queue.errors === queue.results.length) {
      const errorCode = queue.results[0].code;
      const errorMessage =
        errorCode === ERROR_QUEUE_MAX_USED_DAY
          ? queue.results[0].message
          : 'All URLs failed to be enqueued.';

      if (verbose) {
        console.log(`${NAME}:`, errorMessage);

        if (apiErrorMessage) {
          console.log(apiErrorMessage, queue.results);
        }
      }

      throw new LighthouseCheckError(errorMessage, {
        code: errorCode,
        data: queue.results
      });
    }

    // if only some urls succeeded to be enqueued...
    const successResultLength = queue.results.length - queue.errors;

    const message =
      successResultLength < queue.results.length
        ? `Only ${
            successResultLength > 1 ? 'some' : 'one'
          } of your account URLs were enqueued. Typically this occurs when daily limit has been met for a given URL. Check your account limits online.`
        : `${queue.results.length} ${
            queue.results.length > 1 ? 'URLs' : 'URL'
          } successfully enqueued for Lighthouse. Visit dashboard for results.`;

    if (verbose) {
      console.log(`${NAME}:`, message);

      if (apiErrorMessage) {
        console.log(apiErrorMessage, queue.results);
      }
    }

    // success
    return {
      code: SUCCESS_CODE_GENERIC,
      data: queue.results,
      message
    };
  } catch (error) {
    const result = {
      code: error.code || ERROR_GENERIC,
      error
    };

    // if an error occurred but we still have data (typically if only some URLs failed)
    if (error.data) {
      result.data = error.data;
    }

    return result;
  }
};
