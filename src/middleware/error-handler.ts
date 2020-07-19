/* eslint-disable no-console,global-require,@typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction, Express } from 'express';
import HTTPClientError from '../helpers/http-client-error';
import errorLog from '../utils/error-log';

function applyErrorHandlers(server: Express) {
  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line
    // @ts-ignore
    const sentryId = res.sentry;
    errorLog(err);
    if (err instanceof HTTPClientError) {
      if (process.env.NODE_ENV !== 'development') {
        res.status(err.statusCode).send({ message: err.message, sentryId });
      } else {
        res.status(err.statusCode).send({ message: err.message, sentryId, stack: err.stack });
      }
    } else {
      if (process.env.NODE_ENV !== 'development') {
        res.status(500).send({
          message: 'Error occurred, please try again later. If the problem persists, please contact support.',
          sentryId,
        });
      } else {
        res.status(500).send({
          message: err.stack,
          sentryId,
        });
      }
    }
  });
}

export default applyErrorHandlers;
