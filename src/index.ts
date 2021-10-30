import * as core from '@actions/core';
import get from 'lodash.get';
import * as github from '@actions/github';
import { lighthouseCheck } from '@foo-software/lighthouse-check';
import getUrlsFromJson from './helpers/getUrlsFromJson';

const formatInput = (input: string) => {
  if (input === 'true') {
    return true;
  }

  if (input === 'false') {
    return false;
  }

  if (input === '') {
    return undefined;
  }

  return input;
};

(async () => {
  try {
    // legacy inputs
    const legacyGitHubAccessToken = core.getInput('accessToken');
    const legacyFooApiToken = core.getInput('apiToken');
    const legacyGitAuthor = core.getInput('author');
    const legacyGitBranch = core.getInput('branch');
    const legacyDevice = core.getInput('emulatedFormFactor');

    // new inputs
    const gitHubAccessToken = core.getInput('gitHubAccessToken');
    const fooApiToken = core.getInput('fooApiToken');
    const gitAuthor = core.getInput('gitAuthor');
    const gitBranch = core.getInput('gitBranch');
    const device = core.getInput('device');

    const commentUrl = core.getInput('commentUrl');
    const extraHeaders = core.getInput('extraHeaders');
    const maxRetries = core.getInput('maxRetries');
    const prApiUrl = get(github, 'context.payload.pull_request.url');
    const urlsSimple = formatInput(core.getInput('urls'));
    const urlsComplex = formatInput(core.getInput('urlsJson'));
    const urls =
      typeof urlsSimple === 'string'
        ? urlsSimple.split(',')
        : typeof urlsComplex === 'string'
        ? getUrlsFromJson(urlsComplex)
        : undefined;

    const results = await lighthouseCheck({
      author: gitAuthor || legacyGitAuthor,
      apiToken: fooApiToken || legacyFooApiToken,
      awsAccessKeyId: formatInput(core.getInput('awsAccessKeyId')),
      awsBucket: formatInput(core.getInput('awsBucket')),
      awsRegion: formatInput(core.getInput('awsRegion')),
      awsSecretAccessKey: formatInput(core.getInput('awsSecretAccessKey')),
      branch: gitBranch || legacyGitBranch,
      configFile: formatInput(core.getInput('configFile')),
      device: device || legacyDevice,
      extraHeaders: !extraHeaders ? undefined : JSON.parse(extraHeaders),
      locale: formatInput(core.getInput('locale')),
      help: formatInput(core.getInput('help')),
      maxRetries: !maxRetries ? 0 : Number(maxRetries),
      outputDirectory: formatInput(core.getInput('outputDirectory')),
      overridesJsonFile: formatInput(core.getInput('overridesJsonFile')),
      pr: formatInput(core.getInput('pr')),
      prCommentAccessToken: gitHubAccessToken || legacyGitHubAccessToken,
      prCommentEnabled: formatInput(core.getInput('prCommentEnabled')),
      prCommentSaveOld: formatInput(core.getInput('prCommentSaveOld')),
      prCommentUrl:
        commentUrl || (!prApiUrl ? undefined : `${prApiUrl}/reviews`),
      sha: formatInput(core.getInput('sha')),
      slackWebhookUrl: formatInput(core.getInput('slackWebhookUrl')),
      tag: formatInput(core.getInput('tag')),
      timeout: formatInput(core.getInput('timeout')),
      throttling: formatInput(core.getInput('throttling')),
      throttlingMethod: formatInput(core.getInput('throttlingMethod')),
      urls,
      verbose: formatInput(core.getInput('verbose')),
      wait: formatInput(core.getInput('wait')),

      // static
      isGitHubAction: true,
    });

    // yikesers - only strings :(
    // https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#steps-context
    core.setOutput('lighthouseCheckResults', JSON.stringify(results));
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
})();
