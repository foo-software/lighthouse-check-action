const core = require('@actions/core');
const get = require('lodash.get');
const github = require('@actions/github');
const { lighthouseCheck } = require('@foo-software/lighthouse-check');

const formatInput = input => {
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
    const urls = formatInput(core.getInput('urls'));
    const apiPrUrl = get(github, 'context.payload.repository.pulls_url');

    console.log('hmmm', formatInput(core.getInput('prCommentAccessToken')));

    const results = await lighthouseCheck({
      author: formatInput(core.getInput('author')),
      apiToken: formatInput(core.getInput('apiToken')),
      awsAccessKeyId: formatInput(core.getInput('awsAccessKeyId')),
      awsBucket: formatInput(core.getInput('awsBucket')),
      awsRegion: formatInput(core.getInput('awsRegion')),
      awsSecretAccessKey: formatInput(core.getInput('awsSecretAccessKey')),
      branch: formatInput(core.getInput('branch')),
      configFile: formatInput(core.getInput('configFile')),
      emulatedFormFactor: formatInput(core.getInput('emulatedFormFactor')),
      locale: formatInput(core.getInput('locale')),
      help: formatInput(core.getInput('help')),
      outputDirectory: formatInput(core.getInput('outputDirectory')),
      pr: formatInput(core.getInput('pr')),
      // prCommentAccessToken: formatInput(core.getInput('prCommentAccessToken')),
      // prCommentUrl: !apiPrUrl ? undefined : `${apiPrUrl}/reviews`,
      sha: formatInput(core.getInput('sha')),
      slackWebhookUrl: formatInput(core.getInput('slackWebhookUrl')),
      tag: formatInput(core.getInput('tag')),
      timeout: formatInput(core.getInput('timeout')),
      throttling: formatInput(core.getInput('throttling')),
      throttlingMethod: formatInput(core.getInput('throttlingMethod')),
      urls: !urls ? undefined : urls.split(','),
      verbose: formatInput(core.getInput('verbose')),
      wait: formatInput(core.getInput('wait'))
    });

    // yikesers - only strings :(
    // https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#steps-context
    core.setOutput('lighthouseCheckResults', JSON.stringify(results));
  } catch (error) {
    core.setFailed(error.message);
  }
})();
