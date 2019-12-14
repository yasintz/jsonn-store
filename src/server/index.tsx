import bodyParser from 'body-parser';
import cors from 'cors';
import SocketIO from 'socket.io';
import express from 'express';
import { Connection } from 'typeorm';
import { ServerContext } from './helpers';
import Json from './database/models/json';
import User from './database/models/user';
import JsonUser from './database/models/user-json';
import route from './route';
import applyMiddleware from './middleware';
import applyErrorHandlers from './middleware/error-handler';

const server = express();
const apiRouter = express.Router();
const baseRouter = express.Router();

// eslint-disable-next-line

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
};

function app(dbConnection: Connection, socket: SocketIO.Server) {
  const serverContext: ServerContext = {
    db: {
      Json,
      User,
      JsonUser,
    },
    socket,
    JWT_SECRET: process.env.JWT_SECRET as string,
  };

  server
    .disable('x-powered-by')
    // eslint-disable-next-line
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
    .use(express.json({ limit: '50mb' }))
    .use(express.urlencoded({ limit: '50mb', extended: false }))
    .use(cors(corsOptions))
    .use(bodyParser.json());

  applyMiddleware(server, serverContext);

  server.use('/api', apiRouter);
  server.use('/', baseRouter);

  route(apiRouter, baseRouter, serverContext);
  applyErrorHandlers(server);

  return server;
}

export default app;
