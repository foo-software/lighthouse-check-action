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

    for (const result of results) {
      markdown += `\n\n${result.url}\n\n${resultTableHeader}`;

      Object.keys(result.scores).forEach(current => {
        markdown += `| ${lighthouseAuditTitles[current]} | ${result.scores[current]} |\n`;
      });
    }

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
