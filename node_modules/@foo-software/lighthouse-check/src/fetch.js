// this should only be defined when working locally.
if (process.env.API_URL) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

// https://stackoverflow.com/a/69331469
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

export default fetch;
