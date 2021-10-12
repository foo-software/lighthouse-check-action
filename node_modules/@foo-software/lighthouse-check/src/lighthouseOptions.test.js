import options from './lighthouseOptions';

describe('options', () => {
  it('should match snapshot', () => {
    expect(options).toMatchSnapshot();
  });
});
