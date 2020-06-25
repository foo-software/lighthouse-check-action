#! /usr/bin/env node
import get from 'lodash.get';
import github from '@actions/github';
import lighthouseCheck from '../lighthouseCheck';

(async () => {
  const prApiUrl = get(github, 'context.payload.pull_request.url');
  console.log('prApiUrl', prApiUrl);

  const results = await lighthouseCheck({
    prCommentAccessToken: process.env.prCommentAccessToken,
    prCommentEnabled: true,
    prCommentUrl: !prApiUrl ? undefined : `${prApiUrl}/reviews`,
    urls: ['https://www.foo.software'],
    verbose: true
  });
})();
