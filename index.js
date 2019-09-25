const core = require('@actions/core');
const github = require('@actions/github');
const { lighthouseCheck } = require('@foo-software/lighthouse-check');

const normalizeInput = input => {
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
    const urls = normalizeInput(core.getInput('urls'));

    console.log('github', github.context);

    await lighthouseCheck({
      author: normalizeInput(core.getInput('author')),
      apiToken: normalizeInput(core.getInput('apiToken')),
      awsAccessKeyId: normalizeInput(core.getInput('awsAccessKeyId')),
      awsBucket: normalizeInput(core.getInput('awsBucket')),
      awsRegion: normalizeInput(core.getInput('awsRegion')),
      awsSecretAccessKey: normalizeInput(core.getInput('awsSecretAccessKey')),
      branch: normalizeInput(core.getInput('branch')),
      configFile: normalizeInput(core.getInput('configFile')),
      emulatedFormFactor: normalizeInput(core.getInput('emulatedFormFactor')),
      locale: normalizeInput(core.getInput('locale')),
      help: normalizeInput(core.getInput('help')),
      outputDirectory: normalizeInput(core.getInput('outputDirectory')),
      pr: normalizeInput(core.getInput('pr')),
      sha: normalizeInput(core.getInput('sha')),
      slackWebhookUrl: normalizeInput(core.getInput('slackWebhookUrl')),
      tag: normalizeInput(core.getInput('tag')),
      timeout: normalizeInput(core.getInput('timeout')),
      throttling: normalizeInput(core.getInput('throttling')),
      throttlingMethod: normalizeInput(core.getInput('throttlingMethod')),
      urls: !urls ? undefined : urls.split(','),
      verbose: normalizeInput(core.getInput('verbose')),
      wait: normalizeInput(core.getInput('wait'))
    });
  } catch (error) {
    core.setFailed(error.message);
  }
})();

