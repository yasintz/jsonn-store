import * as express from 'express';

import apiRoute from './api.route';
import clientRoute from './client.route';

import applyRoutes from './apply-routes';

export default (server: express.Router) => {
  applyRoutes(apiRoute, server);
  applyRoutes(clientRoute, server);
};
