import * as jsonDatabase from './controllers/json-db';
import { RouteParamsSchema, Handler } from './helpers';
import Joi from '@hapi/joi';

type Route = {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string | string[];
  rateLimit: {
    max: number;
    windowMs: string;
    message?: string;
  };
  schema: RouteParamsSchema;
  middlewares: Handler<any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  handler: Handler<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

const jsonDatabaseRoutes: Route[] = [
  {
    method: 'post',
    path: '/:username',
    rateLimit: {
      windowMs: '1 minutes',
      max: 100,
    },
    schema: {
      params: Joi.object({ username: Joi.string().required() }),
      body: Joi.object({ db: Joi.object() }),
    },
    middlewares: [],
    handler: jsonDatabase.getOrCreateDatabaseHandler,
  },
  {
    method: 'get',
    path: '/:username',
    rateLimit: {
      windowMs: '1 minutes',
      max: 100,
    },
    schema: {
      params: Joi.object({ username: Joi.string().required() }),
    },
    middlewares: [],
    handler: jsonDatabase.getDatabase,
  },
  {
    method: 'put',
    path: '/:username',
    rateLimit: {
      windowMs: '1 minutes',
      max: 100,
    },
    schema: {
      params: Joi.object({ username: Joi.string().required() }),
      body: Joi.object({ db: Joi.object().required() }),
    },
    middlewares: [],
    handler: jsonDatabase.updateDatabaseHandler,
  },
  {
    method: 'delete',
    path: '/:username',
    rateLimit: {
      windowMs: '1 minutes',
      max: 100,
    },
    schema: {
      params: Joi.object({ username: Joi.string().required() }),
    },
    middlewares: [],
    handler: jsonDatabase.removeHandler,
  },
];

const healthRoute: Route = {
  method: 'get',
  path: '/health',
  rateLimit: {
    windowMs: '1 minutes',
    max: 30,
  },
  schema: {},
  middlewares: [],
  handler: (req, res) => res.json({ OK: true }),
};

const routes: Route[] = [healthRoute, ...jsonDatabaseRoutes];

export default routes;
