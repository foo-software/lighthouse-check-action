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
    // undefined values come back as empty strings
    const author = normalizeInput(core.getInput('author'));
    const apiToken = normalizeInput(core.getInput('apiToken'));
    const awsAccessKeyId = normalizeInput(core.getInput('awsAccessKeyId'));
    const awsBucket = normalizeInput(core.getInput('awsBucket'));
    const awsRegion = normalizeInput(core.getInput('awsRegion'));
    const awsSecretAccessKey = normalizeInput(core.getInput('awsSecretAccessKey'));
    const branch = normalizeInput(core.getInput('branch'));
    const configFile = normalizeInput(core.getInput('configFile'));
    const emulatedFormFactor = normalizeInput(core.getInput('emulatedFormFactor'));
    const locale = normalizeInput(core.getInput('locale'));
    const help = normalizeInput(core.getInput('help'));
    const outputDirectory = normalizeInput(core.getInput('outputDirectory'));
    const pr = normalizeInput(core.getInput('pr'));
    const sha = normalizeInput(core.getInput('sha'));
    const slackWebhookUrl = normalizeInput(core.getInput('slackWebhookUrl'));
    const tag = normalizeInput(core.getInput('tag'));
    const timeout = normalizeInput(core.getInput('timeout'));
    const throttling = normalizeInput(core.getInput('throttling'));
    const throttlingMethod = normalizeInput(core.getInput('throttlingMethod'));
    const urls = normalizeInput(core.getInput('urls'));
    const verbose = normalizeInput(core.getInput('verbose'));
    const wait = normalizeInput(core.getInput('wait'));

    console.log('github', github.context);
    await lighthouseCheck({
      urls: !urls ? undefined : urls.split(',')
    });
  } catch (error) {
    core.setFailed(error.message);
  }
})();

