jest.mock('./helpers/getPageSpeedInsightsApiResult');

import lighthousePersist, { ReportGenerator } from '.';
import getPageSpeedInsightsApiResult from './helpers/getPageSpeedInsightsApiResult';

jest.mock('chrome-launcher', () => ({
  launch: jest.fn().mockReturnValue({
    kill: jest.fn()
  })
}));

jest.mock('lighthouse', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    lhr: {
      categories: { performance: {} },
      mock: true
    },
    report: '<h1>hello world</h1>'
  })
}));

jest.mock('./helpers/upload', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    Location:
      'https://s3.amazonaws.com/foo-software-html/lighthouse-report-example.html'
  })
}));

describe('@foo-software/lighthouse-persist', () => {
  it('should match snapshot', () => {
    expect(lighthousePersist).toMatchSnapshot();
  });

  it('should return an expected response payload', async () => {
    const response = await lighthousePersist({
      url: 'https://www.foo.software',
      awsAccessKeyId: 'abc123',
      awsBucket: 'myBucket',
      awsRegion: 'us-east-1',
      awsSecretAccessKey: 'def456'
    });

    expect(response).toMatchSnapshot();
  });

  it('should return an expected response payload when "psiKey" is provided', async () => {
    getPageSpeedInsightsApiResult.mockReturnValue({
      lighthouseResult: {
        mock: true
      },
      loadingExperience: {
        mock: true
      },
      originLoadingExperience: {
        mock: true
      }
    });

    const response = await lighthousePersist({
      url: 'https://www.foo.software',
      awsAccessKeyId: 'abc123',
      awsBucket: 'myBucket',
      awsRegion: 'us-east-1',
      awsSecretAccessKey: 'def456',
      psiKey: 'abc123'
    });

    expect(response).toMatchSnapshot();
  });
});

describe('ReportGenerator', () => {
  it('generateReportHtml should be a function', () => {
    expect(typeof ReportGenerator.generateReportHtml).toBe('function');
  });
});
