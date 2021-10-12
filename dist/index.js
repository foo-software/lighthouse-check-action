"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const lodash_get_1 = __importDefault(require("lodash.get"));
const github = __importStar(require("@actions/github"));
const lighthouse_check_1 = require("@foo-software/lighthouse-check");
const getUrlsFromJson_1 = __importDefault(require("./helpers/getUrlsFromJson"));
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
        const urlsSimple = formatInput(core.getInput('urls'));
        const urlsComplex = formatInput(core.getInput('urlsJson'));
        const urls = typeof urlsSimple === 'string'
            ? urlsSimple.split(',')
            : typeof urlsComplex === 'string'
                ? (0, getUrlsFromJson_1.default)(urlsComplex)
                : undefined;
        const extraHeaders = core.getInput('extraHeaders');
        const commentUrl = core.getInput('commentUrl');
        const prApiUrl = (0, lodash_get_1.default)(github, 'context.payload.pull_request.url');
        const results = await (0, lighthouse_check_1.lighthouseCheck)({
            author: formatInput(core.getInput('gitAuthor')),
            apiToken: formatInput(core.getInput('fooApiToken')),
            awsAccessKeyId: formatInput(core.getInput('awsAccessKeyId')),
            awsBucket: formatInput(core.getInput('awsBucket')),
            awsRegion: formatInput(core.getInput('awsRegion')),
            awsSecretAccessKey: formatInput(core.getInput('awsSecretAccessKey')),
            branch: formatInput(core.getInput('gitBranch')),
            configFile: formatInput(core.getInput('configFile')),
            device: formatInput(core.getInput('device')),
            extraHeaders: !extraHeaders ? undefined : JSON.parse(extraHeaders),
            locale: formatInput(core.getInput('locale')),
            help: formatInput(core.getInput('help')),
            outputDirectory: formatInput(core.getInput('outputDirectory')),
            overridesJsonFile: formatInput(core.getInput('overridesJsonFile')),
            pr: formatInput(core.getInput('pr')),
            prCommentAccessToken: formatInput(core.getInput('gitHubAccessToken')),
            prCommentEnabled: formatInput(core.getInput('prCommentEnabled')),
            prCommentSaveOld: formatInput(core.getInput('prCommentSaveOld')),
            prCommentUrl: commentUrl || (!prApiUrl ? undefined : `${prApiUrl}/reviews`),
            sha: formatInput(core.getInput('sha')),
            slackWebhookUrl: formatInput(core.getInput('slackWebhookUrl')),
            tag: formatInput(core.getInput('tag')),
            timeout: formatInput(core.getInput('timeout')),
            throttling: formatInput(core.getInput('throttling')),
            throttlingMethod: formatInput(core.getInput('throttlingMethod')),
            urls,
            verbose: formatInput(core.getInput('verbose')),
            wait: formatInput(core.getInput('wait')),
            isGitHubAction: true,
        });
        core.setOutput('lighthouseCheckResults', JSON.stringify(results));
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
})();
//# sourceMappingURL=index.js.map