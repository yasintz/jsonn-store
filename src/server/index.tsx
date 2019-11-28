import bodyParser from 'body-parser';
import SocketIO from 'socket.io';
import express from 'express';
import { Connection } from 'typeorm';
import { ServerContext } from './helpers';
import getDbContext from '~/server/database/db-context';
import jsonRoute from './route/json';
import userRoute from './route/user';
import home from './route/home';

const server = express();

function app(dbConnection: Connection, socket: SocketIO.Server) {
  const serverContext: ServerContext = {
    db: getDbContext(dbConnection),
    socket,
  };
  server
    .disable('x-powered-by')
    // eslint-disable-next-line
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
    .use(express.json({ limit: '50mb' }))
    .use(express.urlencoded({ limit: '50mb', extended: false }))
    .use(bodyParser.json());

  userRoute('/api/user', server, serverContext);
  jsonRoute('/api/json', server, serverContext);
  home('/', server, serverContext);

  return server;
}

export default app;
