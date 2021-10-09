import express from 'express';
const app = express();
const port = 80;

app.get('/', (req, res) =>
  res.send(`
<!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
  </head>
  <body>
    ${Object.keys(req.headers)
      .reduce(
        (accumulator: string[], current) => [
          ...accumulator,

          // if header includes with "x-test"
          ...(!current.includes('x-test')
            ? []
            : [
                `
          <p style="font-size: 4rem">
            ${current} = ${req.headers[current]}
          </p>
        `
              ])
        ],
        []
      )
      .join('')}
  </body>
</html>
`)
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
