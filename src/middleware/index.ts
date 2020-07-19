import { RouteParamsSchema } from '../helpers';
import { Handler } from 'express';
import HTTPClientError from '../helpers/http-client-error';

function validateSchemaMiddleware(params: RouteParamsSchema) {
  const keys: Array<keyof RouteParamsSchema> = ['headers', 'body', 'params', 'query'];
  const validate: Handler = (req, res, next) => {
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const schema = params[key];
      if (schema) {
        const { error } = schema.validate(req[key]);
        if (error) {
          next(new HTTPClientError(400, error.message));
          return;
        }
      }
    }

    next();
  };
  return validate;
}

export { validateSchemaMiddleware };
