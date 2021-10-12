import upload from './upload';

describe('upload', () => {
  const params = {
    hello: 'world'
  };

  it('should resolve when data exists', async () => {
    const data = { data: true };
    const response = await upload({
      params,
      s3bucket: {
        upload: (params, callback) => {
          callback(null, data);
        }
      }
    });

    expect(response).toEqual(data);
  });

  it('should reject when error exists', async () => {
    const rejectionError = Error('something went wrong');

    try {
      await upload({
        params,
        s3bucket: {
          upload: (params, callback) => {
            callback(rejectionError, null);
          }
        }
      });
    } catch (error) {
      expect(error).toEqual(rejectionError);
    }
  });
});
