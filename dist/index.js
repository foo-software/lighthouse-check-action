"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const lodash_get_1 = __importDefault(require("lodash.get"));
const github_1 = __importDefault(require("@actions/github"));
const lighthouse_check_1 = require("@foo-software/lighthouse-check");
const formatInput = (input) => {
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
        const urls = formatInput(core_1.default.getInput('urls'));
        const extraHeaders = core_1.default.getInput('extraHeaders');
        const commentUrl = core_1.default.getInput('commentUrl');
        const prApiUrl = (0, lodash_get_1.default)(github_1.default, 'context.payload.pull_request.url');
        const results = await (0, lighthouse_check_1.lighthouseCheck)({
            author: formatInput(core_1.default.getInput('author')),
            apiToken: formatInput(core_1.default.getInput('apiToken')),
            awsAccessKeyId: formatInput(core_1.default.getInput('awsAccessKeyId')),
            awsBucket: formatInput(core_1.default.getInput('awsBucket')),
            awsRegion: formatInput(core_1.default.getInput('awsRegion')),
            awsSecretAccessKey: formatInput(core_1.default.getInput('awsSecretAccessKey')),
            branch: formatInput(core_1.default.getInput('branch')),
            configFile: formatInput(core_1.default.getInput('configFile')),
            emulatedFormFactor: formatInput(core_1.default.getInput('emulatedFormFactor')),
            extraHeaders: !extraHeaders ? undefined : JSON.parse(extraHeaders),
            locale: formatInput(core_1.default.getInput('locale')),
            help: formatInput(core_1.default.getInput('help')),
            outputDirectory: formatInput(core_1.default.getInput('outputDirectory')),
            overridesJsonFile: formatInput(core_1.default.getInput('overridesJsonFile')),
            pr: formatInput(core_1.default.getInput('pr')),
            prCommentAccessToken: formatInput(core_1.default.getInput('accessToken')),
            prCommentEnabled: formatInput(core_1.default.getInput('prCommentEnabled')),
            prCommentSaveOld: formatInput(core_1.default.getInput('prCommentSaveOld')),
            prCommentUrl: commentUrl || (!prApiUrl ? undefined : `${prApiUrl}/reviews`),
            sha: formatInput(core_1.default.getInput('sha')),
            slackWebhookUrl: formatInput(core_1.default.getInput('slackWebhookUrl')),
            tag: formatInput(core_1.default.getInput('tag')),
            timeout: formatInput(core_1.default.getInput('timeout')),
            throttling: formatInput(core_1.default.getInput('throttling')),
            throttlingMethod: formatInput(core_1.default.getInput('throttlingMethod')),
            urls: typeof urls !== 'string' ? undefined : urls.split(','),
            verbose: formatInput(core_1.default.getInput('verbose')),
            wait: formatInput(core_1.default.getInput('wait')),
            isGitHubAction: true
        });
        core_1.default.setOutput('lighthouseCheckResults', JSON.stringify(results));
    }
    catch (error) {
        if (error instanceof Error) {
            core_1.default.setFailed(error.message);
        }
    }
})();
//# sourceMappingURL=index.js.map