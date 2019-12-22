import { Handler, HandlerWithContext } from '../helpers';
import { HTTP400Error, HTTP404Error } from '../helpers/http-errors';
import { JsonUserRole } from '../database/models/user-json';
import { accessIsCorrect } from '../utils';

const checkAuthBody: Handler = (req, res, next) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      next();
    } else {
      throw new HTTP400Error('Missing username password');
    }
  } catch (error) {
    next(error);
  }
};

const checkUpdateUserBody: Handler = (req, res, next) => {
  try {
    if (req.body && (req.body.username || req.body.password)) {
      next();
    } else {
      throw new HTTP400Error('Missing username or password');
    }
  } catch (error) {
    next(error);
  }
};

const checkHasJson: HandlerWithContext = ({ db }) => async (req, res, next) => {
  try {
    const jsonDb = await db.Json.getJsonById(req.params.id);
    if (jsonDb) {
      res.locals.jsonDb = jsonDb;
      next();
    } else {
      throw new HTTP404Error('Json Not Found');
    }
  } catch (error) {
    next(error);
  }
};

const checkHasData: Handler = (req, res, next) => {
  try {
    if (req.body.data) {
      next();
    } else {
      throw new HTTP404Error('Json Not Found');
    }
  } catch (error) {
    next(error);
  }
};

const checkAccessParams: Handler = (req, res, next) => {
  try {
    const body = {
      data: {},
      read: JsonUserRole.admin,
      write: JsonUserRole.admin,
      ...req.body,
    };
    if (accessIsCorrect(body.read) && accessIsCorrect(body.write)) {
      next();
    } else {
      throw new HTTP404Error(`Access Must Be a [${Object.keys(JsonUserRole).join(', ')}]`);
    }
  } catch (error) {
    next(error);
  }
};

export { checkAuthBody, checkUpdateUserBody, checkHasJson, checkAccessParams, checkHasData };
