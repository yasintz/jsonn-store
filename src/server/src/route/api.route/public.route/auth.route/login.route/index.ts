import * as express from 'express';
import { Route } from '@server/helpers';
import localRoute from './local.route';
import googleRoute from './google.route';
import githubRoute from './github.route';

const loginRoute: Route = {
  path: '/login',
  router: express.Router(),
  routes: [googleRoute, githubRoute, localRoute],
};

export default loginRoute;
