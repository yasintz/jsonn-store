import * as express from 'express';
import { Route } from '@server/helpers';
import { HTTP404Error } from '@server/helpers/http-errors';
import { authenticationMiddleware } from '@server/middleware';
import testRoute from './test.route';

const notFoundError: Route = {
  path: '*',
  method: 'get',
  handler: (req, res) => {
    throw new HTTP404Error('Not Found');
  },
};

const apiRoute: Route = {
  path: '/secret',
  router: express.Router(),
  middlewares: [authenticationMiddleware],
  routes: [testRoute, notFoundError],
};

export default apiRoute;
