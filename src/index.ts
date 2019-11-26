/* eslint-disable no-console,global-require */
import * as http from 'http';
import express from 'express';
import createSocketServer from 'socket.io';

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

const server = http.createServer(express().use((req, res) => app.handle(req, res)));

createSocketServer(server).on('connection', socket => socketConnectionHandler(socket));

export default server.listen(port, () => {
  console.log(`> Started on port ${port}`);
});
