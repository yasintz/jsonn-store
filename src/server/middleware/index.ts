import { Express } from 'express';
import auth from './auth';
import { ServerContext } from '../helpers';

export default (server: Express, ctx: ServerContext) => {
  auth(server, ctx);
};
