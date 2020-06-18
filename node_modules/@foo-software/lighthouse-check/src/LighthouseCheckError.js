export default class LighthouseCheckError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, LighthouseCheckError);

    const [, options] = args;
    this.code = options.code;
    this.data = options.data;
  }
}
