// non-alphabetical because some constants depend on others :(
export const API_LIGHTHOUSE_AUDIT_PATH = '/lighthouseAudits/queueIds';
export const API_PAGES_PATH = '/pages';
export const API_QUEUE_ITEMS_PATH = '/queue/items';

// 10 minutes
export const DEFAULT_FETCH_AND_WAIT_TIMEOUT_MINUTES = 10;

// 10 seconds
export const FETCH_POLL_INTERVAL_SECONDS = 10;
export const FETCH_POLL_INTERVAL = FETCH_POLL_INTERVAL_SECONDS * 1000;
export const LIGHTHOUSE_API_URL = 'https://www.foo.software/api/v1';
export const API_URL = process.env.API_URL || LIGHTHOUSE_API_URL;
export const NAME = 'lighthouse-check';
export const NAME_RESULTS_JSON_FILE = 'results.json';
export const NAME_STATUS = 'lighthouse-check-status';
export const DEFAULT_TAG = NAME;
export const SOURCE_GITHUB_ACTION = 'GitHub Action';
export const SOURCE_CIRCLECI_ORB = 'CircleCI Orb';
export const SUCCESS_CODE_GENERIC = 'SUCCESS';
export const TRIGGER_TYPE = 'lighthouseAudit';
