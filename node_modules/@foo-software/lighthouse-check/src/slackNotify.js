import { IncomingWebhook } from '@slack/webhook';
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
      // get the average of all socres
      const values = Object.values(result.scores);
      const sum = values.reduce(
        (accumulator, current) => current + accumulator,
        0
      );
      const average = Math.floor(sum / values.length);

      // link the report if we have it
      let text = !result.report
        ? 'Lighthouse Audit.'
        : `<${result.report}|Lighthouse Audit>.`;

      // if we have a branch
      if (branch) {
        const branchText = !pr ? branch : `<${pr}|${branch}>`;
        text = `${text} Change made in \`${branchText}\`.`;
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
            fields: [
              {
                title: 'Average',
                value: average,
                short: true
              },
              ...Object.keys(result.scores).map(current => ({
                title: lighthouseAuditTitles[current],
                value: result.scores[current],
                short: true
              }))
            ],
            text,
            thumb_url:
              'https://s3.amazonaws.com/foo.software/images/logos/lighthouse.png',
            ...(!footer
              ? {}
              : {
                  footer
                })
          }
        ]
      });
    }
  } catch (error) {
    if (verbose) {
      console.log(`${NAME}:`, error);
    }
  }
};
