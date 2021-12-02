"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 80;
app.get('/', (req, res) => res.send(`
<!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
  </head>
  <body>
    ${Object.keys(req.headers)
    .reduce((accumulator, current) => [
    ...accumulator,
    ...(!current.includes('x-test')
        ? []
        : [
            `
          <p style="font-size: 4rem">
            ${current} = ${req.headers[current]}
          </p>
        `
        ])
], [])
    .join('')}
  </body>
</html>
`));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//# sourceMappingURL=headerServer.js.map