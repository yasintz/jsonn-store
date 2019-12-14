import { Router } from 'express';
import { ServerContext, Route } from '../helpers';
import privateJsonRoute from './json/private';
import publicJsonRoute from './json/public';
import userRoute from './user';
import authRoute from './auth';
import home from './home';
import docRoute from './doc';

export const applyRoutes = (routes: Route[], router: Router, ctx: ServerContext) => {
  // eslint-disable-next-line
  for (const { handler, path, method } of routes) {
    router[method](path, handler(ctx));
  }
};

export default (apiRouter: Router, baseRouter: Router, ctx: ServerContext) => {
  applyRoutes([...authRoute, ...publicJsonRoute, home, docRoute], baseRouter, ctx);
  applyRoutes([...userRoute, ...privateJsonRoute], apiRouter, ctx);
};
