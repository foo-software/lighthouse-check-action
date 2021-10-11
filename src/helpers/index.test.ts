import getUrlsFromJson from './getUrlsFromJson';

describe('getUrlsFromJson', () => {
  it('should return parsed JSON', () => {
    const urls = getUrlsFromJson('["https://www.foo.software", "https://www.foo.software/docs", "https://www.google.com"]');
    expect(urls).toEqual(['https://www.foo.software', 'https://www.foo.software/docs', 'https://www.google.com']);
  });

  it('should return parsed JSON correctly when tuples are defined', () => {
    const urls = getUrlsFromJson(
      '[["abc", "https://www.foo.software"], ["123", "https://www.google.com"]]',
    );
    expect(urls).toEqual([
      'abc::https://www.foo.software',
      '123::https://www.google.com',
    ]);
  });

  it('should return parsed JSON correctly when single arrays are defined', () => {
    const urls = getUrlsFromJson(
      '[["https://www.foo.software"], ["https://www.google.com"]]',
    );
    expect(urls).toEqual([
      'https://www.foo.software',
      'https://www.google.com',
    ]);
  });

  it('should throw an error if incorrect format', () => {
    expect(() => {
      getUrlsFromJson('https://www.foo.software,https://www.google.com');
    }).toThrow();
  });

  it('should throw an error if array item is larger than a tuple', () => {
    expect(() => {
      getUrlsFromJson(
        '[["abc", "https://www.foo.software", "oh no"], ["123", "https://www.google.com"]]',
      );
    }).toThrow();
  });
});
