import config from './lighthouseConfig';

describe('config', () => {
  it('should match snapshot', () => {
    expect(config).toMatchSnapshot();
  });
});
