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
    <h1>
      req.headers['x-hello-world'] = ${req.headers['x-hello-world'] || 'undefined'}
    </h1>
  </body>
</html>
`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
