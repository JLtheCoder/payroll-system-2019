require('dotenv').config({ path: './env' });
const express = require('express');
const path = require('path');
const config = require('./config');
const routes = require('./routes');

function run() {
  const app = express();

  app.use(express.static(path.resolve(__dirname, './frontend')));
  routes.init(app);
  app.get('*', (req, res) => {
    return res.sendFile(path.resolve(__dirname, './frontend', 'index.html'));
  });

  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

run();
