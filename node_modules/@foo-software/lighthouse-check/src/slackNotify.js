import { IncomingWebhook } from '@slack/webhook';
import getLighthouseScoreColor from './helpers/getLighthouseScoreColor';
import lighthouseAuditTitles from './lighthouseAuditTitles';
import { NAME } from './constants';

export default async ({
  author,
  branch,
  pr: prParam,
  results,
  sha,
  slackWebhookUrl,
  verbose
}) => {
  try {
    const webhook = new IncomingWebhook(slackWebhookUrl);

    // sometimes we get weird input
    const pr =
      typeof prParam !== 'string' || prParam === 'true' ? undefined : prParam;

    for (const result of results) {
      // link the report if we have it
      let text = !result.report
        ? 'Lighthouse audit'
        : `<${result.report}|Lighthouse audit>`;

      // if we have a branch
      if (branch) {
        const branchText = !pr ? branch : `<${pr}|${branch}>`;
        text = `${text} change made in \`${branchText}\`.`;
      }

      let footer;
      if (author) {
        footer = `by ${author}`;

        if (sha) {
          footer = `${footer} in ${sha.slice(0, 10)}`;
        }
      }

      await webhook.send({
        text: result.url,
        attachments: [
          {
            color: '#2091fa',
            text,
            thumb_url:
              'https://s3.amazonaws.com/foo.software/images/logos/lighthouse.png',
            ...(!footer
              ? {}
              : {
                  footer
                })
          },
          ...Object.keys(result.scores).map(current => ({
            color: getLighthouseScoreColor({
              isHex: true,
              score: result.scores[current]
            }),
            text: `*${lighthouseAuditTitles[current]}*: ${result.scores[current]}`,
            short: true
          }))
        ]
      });
    }
  } catch (error) {
    if (verbose) {
      console.log(`${NAME}:`, error);
    }

    // we still need to kill the process
    throw error;
  }
};
