import * as express from 'express';
import { Route } from '@server/helpers';
import { rateLimiterUsingThirdParty } from '@server/middleware/rate-limiter.middleware';
import secretRoute from './secret.route';
import publicRoute from './public.route';

const apiRoute: Route = {
  path: '/api',
  router: express.Router(),
  middlewares: [rateLimiterUsingThirdParty],
  routes: [publicRoute, secretRoute],
};

export default apiRoute;
