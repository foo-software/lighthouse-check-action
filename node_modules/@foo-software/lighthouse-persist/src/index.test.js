import lighthousePersist from '.';

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
});
