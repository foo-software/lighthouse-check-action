const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => res.send(`
<!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
  </head>
  <body>
    ${Object.keys(req.headers).reduce((accumulator, current) => ([
      ...accumulator,

      // if header begins with "x"
      ...(current[0] !== 'x' ? [] : [
        `
          <p style="font-size: 4rem">
            ${current} = ${req.headers[current]}
          </p>
        `,
      ]),
    ]), []).join('')}
  </body>
</html>
`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
