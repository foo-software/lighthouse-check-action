import fetch from './fetch';
import lighthouseAuditTitles from './lighthouseAuditTitles';
import LighthouseCheckError from './LighthouseCheckError';
import { ERROR_UNEXPECTED_RESPONSE } from './errorCodes';
import { NAME } from './constants';

const resultTableHeader = `
| Audit | Score |
| ----- | ----- |
`;

export default async ({
  prCommentAccessToken,
  prCommentUrl,
  results,
  verbose
}) => {
  try {
    let markdown = `## Lighthouse Audits`;

    results.forEach((result, index) => {
      // the url
      markdown += `\n\n${result.url}`;

      // the table header
      markdown += `\n\n${resultTableHeader}`;

      // populate the table
      Object.keys(result.scores).forEach(current => {
        markdown += `| ${lighthouseAuditTitles[current]} | ${result.scores[current]} |\n`;
      });

      // if we have a URL for the full report
      if (result.report) {
        markdown += `\n\n${result.report}`;
      }

      // add a horizontal line
      if (index + 1 < results.length) {
        markdown += `\n\n<hr />`;
      }
    });

    const result = await fetch(prCommentUrl, {
      method: 'post',
      body: JSON.stringify({
        event: 'COMMENT',
        body: markdown
      }),
      headers: {
        'content-type': 'application/json',
        authorization: `token ${prCommentAccessToken}`
      }
    });
    const jsonResult = await result.json();

    if (!jsonResult.id) {
      throw new LighthouseCheckError(
        jsonResult.message || 'something went wrong',
        {
          code: ERROR_UNEXPECTED_RESPONSE,
          data: jsonResult
        }
      );
    }
  } catch (error) {
    if (verbose) {
      console.log(`${NAME}:`, error);
    }

    // we still need to kill the process
    throw error;
  }
};
