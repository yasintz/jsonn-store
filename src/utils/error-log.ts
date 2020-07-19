import { ErrorType } from '../helpers/http-client-error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function errorLog(err: any) {
  const error = typeof err === 'string' ? { message: err } : err;
  const newError = Object.assign({}, error, {
    time: new Date().toString(),
    message: err.message,
  });

  if (!newError.type) {
    newError.type = ErrorType.Server;
  }

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(newError, null, 2));
}

export default errorLog;
