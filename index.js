const core = require('@actions/core');
const github = require('@actions/github');
const { lighthouseCheck } = require('@foo-software/lighthouse-check');

(async () => {
  try {
    const urls = core.getInput('urls');
    console.log('github', github.context);
    await lighthouseCheck({
      urls: urls.split(',')
    });
  } catch (error) {
    core.setFailed(error.message);
  }
})();

