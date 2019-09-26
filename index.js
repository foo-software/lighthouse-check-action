const core = require('@actions/core');
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

const getScoreFailMessage = ({
  name,
  url,
  minScore,
  score
}) => {
  // if inputs are not specified - assume we shouldn't fail
  if (!minScore || !score) {
    return [];
  }

  if (Number(score) < Number(minScore)) {
    return [`${url}: ${name}: minimum score: ${minScore}, actual score: ${score}`];
  }

  return [];
};

const getFailureMessages = ({
  minAccessibilityScore,
  minBestPracticesScore,
  minPerformanceScore,
  minProgressiveWebAppScore,
  minSeoScore,
  results
}) => {
  return results.data.reduce((accumulator, current) => ([
    ...accumulator,
    ...(getScoreFailMessage({
      name: 'Accessibility',
      minScore: minAccessibilityScore,
      score: current.scores.accessibility,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'Best Practices',
      minScore: minBestPracticesScore,
      score: current.scores.bestPractices,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'Performance',
      minScore: minPerformanceScore,
      score: current.scores.performance,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'Progressive Web App',
      minScore: minProgressiveWebAppScore,
      score: current.scores.progressiveWebApp,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'SEO',
      minScore: minSeoScore,
      score: current.scores.seo,
      ...current
    }))
  ]), []);
}

(async () => {
  try {
    const urls = normalizeInput(core.getInput('urls'));

    const results = await lighthouseCheck({
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

    core.setOutput('lighthouse-check-results', results);
  } catch (error) {
    core.setFailed(error.message);
  }
})();

