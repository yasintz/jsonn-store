import bodyParser from 'body-parser';
import cors from 'cors';
import SocketIO from 'socket.io';
import express from 'express';
import { Connection } from 'typeorm';
import { ServerContext } from './helpers';
import privateJsonRoute from './route/json/private';
import publicJsonRoute from './route/json/public';
import userRoute from './route/user';
import loginRegisterRoute from './route/login-register';
import home from './route/home';
import authFactory from './middleware/auth';
import Json from './database/models/json';
import User from './database/models/user';
import JsonUser from './database/models/user-json';

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
    JWT_SECRET: 'yasin-tazeoglu',
  };
  server
    .disable('x-powered-by')
    // eslint-disable-next-line
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
    .use(express.json({ limit: '50mb' }))
    .use(express.urlencoded({ limit: '50mb', extended: false }))
    .use(cors(corsOptions))
    .use(bodyParser.json());

  /* auth */
  server.use('/api', authFactory(serverContext) as any);
  /* routes */
  server.use('/api', apiRouter);
  server.use('/', baseRouter);
  /* public routes  */
  home(baseRouter, serverContext);
  loginRegisterRoute(baseRouter, serverContext);
  publicJsonRoute(baseRouter, serverContext);
  /* private routes  */
  userRoute(apiRouter, serverContext);
  privateJsonRoute(apiRouter, serverContext);

  return server;
}

export default app;
