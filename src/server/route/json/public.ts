import { Request } from 'express';
import { RouteType, DatabaseUpdateActions } from '~/server/helpers';
import { generateViewLink, generateApiLink } from '~/server/utils/link';
import { schemaParser } from '~/server/utils';
import { appError } from '~/server/utils/errors';
import { JsonUserRole } from '~/server/database/models/user-json';
import jsonUpdater from '~/server/utils/json-updater';

interface PutQuery {
  action: DatabaseUpdateActions;
  path: string;
  schema: string;
}

function responseCreator(req: Request, id: string) {
  return {
    url: generateApiLink(req, id, true),
    id,
    view: generateViewLink(req, id),
  };
}
const jsonRoute: RouteType = (app, { db, socket }) => {
  /* CREATE JSON */
  app.post('/json', async (req, res) => {
    try {
      const data = req.body || {};
      const json = await db.Json.create(data, JsonUserRole.everyone, JsonUserRole.everyone);
      res.send(responseCreator(req, json.id));
    } catch (error) {
      res.send({ error });
    }
  });

  /* GET JSON */
  app.get('/json/:id', async (req, res) => {
    try {
      const { schema: databaseSchema } = req.query;
      const jsonDb = await db.Json.getJsonById(req.params.id);
      if (jsonDb) {
        if (jsonDb.read !== JsonUserRole.everyone) {
          throw appError('Is Private you should use /api/json/ route');
        } else {
          const result = schemaParser(jsonDb.json, databaseSchema);
          res.send({ result });
        }
      } else {
        throw appError('Json Not Found');
      }
    } catch (error) {
      res.status(500).send({ status: 500, ...error });
    }
  });
  /* UPDATE JSON */
  app.put('/json/:id', async (req, res) => {
    const { path: databasePath, schema: databaseSchema, action: databaseAction } = {
      action: DatabaseUpdateActions.replace,
      path: '',
      schema: '',
      ...req.query,
    } as PutQuery;

    try {
      if (!req.body) {
        throw appError('body is required field example {}');
      }
      const jsonDb = await db.Json.getJsonById(req.params.id);
      if (jsonDb && jsonDb.write !== JsonUserRole.everyone) {
        throw appError('Is Private you should use /api/json/ route');
      } else if (jsonDb) {
        const { newJson } = jsonUpdater(jsonDb.json, req.body, databasePath, databaseAction);
        const updatedJsonRow = await db.Json.updatePublicJson(jsonDb.id, newJson);
        // TODO: implement [socket]
        // if (databasePath) {
        //   socket.emit(`${jsonDb.id}/${databasePath}`, changedJson);
        // }
        // socket.emit(jsonDb.id, newJson);
        res.send({
          result: schemaParser(updatedJsonRow.json, databaseSchema),
        });
      } else {
        throw appError('Json Not Found');
      }
    } catch (error) {
      res.status(500).send({ ...error, status: 500 });
    }
  });
};

export default jsonRoute;
