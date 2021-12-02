import get from 'lodash.get';
import fetch from './fetch';
import LighthouseCheckError from './LighthouseCheckError';
import {
  API_LIGHTHOUSE_AUDIT_PATH,
  API_URL,
  SUCCESS_CODE_GENERIC
} from './constants';
import { ERROR_GENERIC, ERROR_NO_RESULTS } from './errorCodes';

export default async ({ apiToken, queueIds }) => {
  try {
    const lighthouseAuditsResponse = await fetch(
      `${API_URL}${API_LIGHTHOUSE_AUDIT_PATH}/${queueIds.join()}`,
      {
        method: 'get',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json'
        }
      }
    );
    const lighthouseAuditsJson = await lighthouseAuditsResponse.json();

    if (lighthouseAuditsJson.status >= 400) {
      throw new LighthouseCheckError('No results found.', {
        code: ERROR_NO_RESULTS
      });
    }

    const lighthouseResults = get(
      lighthouseAuditsJson,
      'data.lighthouseaudit',
      []
    );

    // success
    return {
      code: SUCCESS_CODE_GENERIC,
      data: lighthouseResults,
      message: 'Lighthouse results successfully fetched.'
    };
  } catch (error) {
    return {
      code: error.code || ERROR_GENERIC,
      error
    };
  }
};
