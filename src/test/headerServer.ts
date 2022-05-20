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
    <ul>
      ${Object.keys(req.headers)
        .map(
          current => `
          <li style="font-size: 1rem">
            ${current} = ${req.headers[current]}
          </li>
      `,
        )
        .join('')}
    </ul>
  </body>
</html>
`),
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
