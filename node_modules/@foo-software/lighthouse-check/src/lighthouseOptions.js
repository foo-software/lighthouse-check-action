export default {
  chromeFlags: [
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--headless',
    '--no-sandbox',
    '--ignore-certificate-errors'
  ],
  ...(!process.env.LOG_LEVEL
    ? {}
    : {
        logLevel: process.env.LOG_LEVEL
      })
};
