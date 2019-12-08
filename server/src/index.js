const app = require('./lib/app');

const port = app.get('port');
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
