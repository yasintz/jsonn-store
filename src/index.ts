/* eslint-disable no-console,global-require,@typescript-eslint/no-var-requires,new-cap,prefer-destructuring */
import * as http from 'http';
import createSocketServer from 'socket.io';
import express from 'express';

require('dotenv').config();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const expressApp = express();

const server = http.createServer(expressApp);

const socketServer = createSocketServer(server);

let app = require('@server').default;
let socketHandler = require('@server/socket').default;
let database = require('@server/database').default();

expressApp.use((req, res) => app.express.handle(req, res));

socketServer.on('connection', socket => socketHandler(socket));

server.listen(port, () => {
  console.log(`> Started on port ${port}`);
});

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept(
    ['./server/src/index.ts', './server/src/socket/index.ts', './server/src/database/index.ts'],
    async files => {
      console.log(files.join('\n'));
      console.log('🔁  HMR Reloading `./server`...');
      try {
        if (files.find(item => (item as string).includes('database'))) {
          const dbConnection = await database;
          console.log('Closing Database Connection');
          await dbConnection.close();
          console.log('Closed Database Connection');
          app = require('@server').default;
          socketHandler = require('@server/socket').default;
          database = require('@server/database').default();
        } else {
          app = require('@server').default;
          socketHandler = require('@server/socket').default;
        }
      } catch (error) {
        console.error(error);
      }
    },
  );

  console.info('✅  Server-side HMR Enabled!');
}
