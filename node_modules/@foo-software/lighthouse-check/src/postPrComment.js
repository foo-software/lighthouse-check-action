import fetch from './fetch';
import getLighthouseScoreColor from './helpers/getLighthouseScoreColor';
import lighthouseAuditTitles from './lighthouseAuditTitles';
import LighthouseCheckError from './LighthouseCheckError';
import { ERROR_UNEXPECTED_RESPONSE } from './errorCodes';
import { NAME } from './constants';

const getBadge = ({ title, score }) =>
  `![](https://img.shields.io/badge/${title}-${score}-${getLighthouseScoreColor(
    {
      isHex: false,
      score
    }
  )}?style=flat-square) `;

export default async ({
  prCommentAccessToken,
  prCommentUrl,
  results,
  verbose
}) => {
  try {
    let markdown = '';

    results.forEach((result, index) => {
      // badges
      Object.keys(result.scores).forEach(current => {
        markdown += getBadge({
          title: lighthouseAuditTitles[current].replace(/ /g, '%20'),
          score: result.scores[current]
        });
      });

      // the url
      markdown += `\n\n${result.url}`;

      // if we have a URL for the full report
      if (result.report) {
        markdown += `\n\n[Full report](${result.report})`;
      }

      // add a horizontal line
      if (index + 1 < results.length) {
        markdown += `\n\n<hr />\n\n`;
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
