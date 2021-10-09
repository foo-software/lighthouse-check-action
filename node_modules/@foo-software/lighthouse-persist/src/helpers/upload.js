// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
export default ({ params, s3bucket }) =>
  new Promise((resolve, reject) => {
    s3bucket.upload(params, (error, data) => {
      if (!error) {
        resolve(data);
      } else {
        reject(error);
      }
    });
  });
