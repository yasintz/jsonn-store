import { Handler } from '../helpers';
import to from 'await-to-js';
import jsonDatabaseService from '../services/database/json-db';
import HTTPClientError from '../helpers/http-client-error';
import { HTTP_ERROR_MESSAGES } from '../utils/constants';

const getOrCreateDatabaseHandler: Handler<object, { username: string }, { db?: object }> = async (req, res) => {
  const [getOrCreateError, database] = await to(jsonDatabaseService.getOrCreate(req.params.username, req.body.db));
  if (getOrCreateError || !database) {
    throw new HTTPClientError(400, HTTP_ERROR_MESSAGES.AN_ERROR_OCCURRED);
  }

  res.json(database.db);
};

const updateDatabaseHandler: Handler<object, { username: string }, { db: object }> = async (req, res) => {
  const [updateOrCreateError, database] = await to(
    jsonDatabaseService.updateOrCreate(req.params.username, req.body.db),
  );
  if (updateOrCreateError || !database) {
    throw new HTTPClientError(400, HTTP_ERROR_MESSAGES.AN_ERROR_OCCURRED);
  }

  res.json(database.db);
};

const removeHandler: Handler<{ isRemoved: boolean }, { username: string }> = async (req, res) => {
  const [getOrCreateError, database] = await to(jsonDatabaseService.getByUsername(req.params.username));
  if (getOrCreateError) {
    throw new HTTPClientError(400, HTTP_ERROR_MESSAGES.AN_ERROR_OCCURRED);
  }

  if (!database) {
    throw new HTTPClientError(404, HTTP_ERROR_MESSAGES.DATABASE_NOT_FOUND);
  }

  const [removeError] = await to(database.completelyRemove());

  res.json({ isRemoved: !removeError });
};

export { getOrCreateDatabaseHandler, updateDatabaseHandler, removeHandler };
