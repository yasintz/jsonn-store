/* eslint-disable no-console,global-require */
import * as http from 'http';
import express from 'express';
import createSocketServer from 'socket.io';
import database from './server/database';

require('dotenv').config();

let app = require('./server').default;
let socketConnectionHandler = require('./server/sockets').default;

if (module.hot) {
  module.hot.accept(['./server', './server/sockets'], () => {
    console.log('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').default;
      socketConnectionHandler = require('./server/sockets').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const expressApp = express();
const server = http.createServer(expressApp);

database()
  .then(connection => {
    const socketServer = createSocketServer(server);
    socketServer.on('connection', socket => {
      socketConnectionHandler(socket, socketServer);
    });
    expressApp.use((req, res) => app(connection, socketServer).handle(req, res));
  })
  .catch(error => {
    expressApp.get('/', (req, res) => {
      res.send(`
      <h1 style="color:red;">
          Database Error 
      </h1> 
      `);
    });
  });
server.listen(port, () => {
  console.log(`> Started on port ${port}`);
});
