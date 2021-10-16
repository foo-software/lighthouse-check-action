const getUrlsFromJson = (urls: string): string[] => {
  try {
    const urlsJson: string[] = JSON.parse(urls);
    const urlArray: string[] = [];
    if (!Array.isArray(urlsJson)) {
      throw new Error('Input is not an array.');
    }
    for (const urlItem of urlsJson) {
      if (Array.isArray(urlItem)) {
        if (urlItem.length > 2) {
          throw new Error(
            'If specifying a page token, URL item should be a tuple.',
          );
        }
        if (urlItem.length === 1) {
          urlArray.push(urlItem[0]);
        } else {
          const [pageToken, url] = urlItem;
          urlArray.push(`${pageToken}::${url}`);
        }
      } else if (typeof urlItem === 'string') {
        urlArray.push(urlItem);
      }
    }
    return urlArray;
  } catch (error) {
    const errorMessage =
      'Something was wrong with the "urlsJson" input format. Refer to our documentation and try testing your input by passing it to JSON.parse(input) JavaScript method as this is the method we use to parse this field. ';
    if (error instanceof Error) {
      throw new Error(errorMessage + error.message);
    } else {
      throw new Error(errorMessage);
    }
  }
};

export default getUrlsFromJson;
