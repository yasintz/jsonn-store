import { Request } from 'express';
import { RouteType, RequestWithUser, DatabaseUpdateActions } from '~/server/helpers';
import { generateViewLink, generateApiLink } from '~/server/utils/link';
import { schemaParser, accessIsCorrect, jsonAccessiblity } from '~/server/utils';
import { appError } from '~/server/utils/errors';
import { JsonUserRole } from '~/server/database/models/user-json';
import jsonUpdater from '~/server/utils/json-updater';

interface PostPutBody {
  data: any;
  write: JsonUserRole;
  read: JsonUserRole;
}
interface PutQuery {
  action: DatabaseUpdateActions;
  path: string;
  schema: string;
}

function responseCreator(req: Request, id: string) {
  return {
    url: generateApiLink(req, id),
    id,
    view: generateViewLink(req, id),
  };
}
const jsonRoute: RouteType = (app, { db }) => {
  /* CREATE JSON */
  app.post('/json', async (req, res) => {
    try {
      const body = {
        data: {},
        read: JsonUserRole.admin,
        write: JsonUserRole.admin,
        ...req.body,
      } as PostPutBody;
      const { user } = req as RequestWithUser;
      if (accessIsCorrect(body.read) && accessIsCorrect(body.write)) {
        const jsonRow = await user.createNewJson(body.data, { read: body.read, write: body.write }, JsonUserRole.admin);
        res.send(responseCreator(req, jsonRow.id));

        return;
      }
      throw appError(`Access Must Be a [${Object.keys(JsonUserRole).join(', ')}]`);
    } catch (error) {
      res.send({ error });
    }
  });

  /* GET JSON */
  app.get('/json/:id', async (req, res) => {
    try {
      const { user } = req as RequestWithUser;
      const { schema: databaseSchema } = req.query;
      const jsonDb = await db.Json.getJsonById(req.params.id);
      if (jsonDb) {
        if (jsonDb.read === JsonUserRole.everyone) {
          res.send({
            result: schemaParser(jsonDb.json, databaseSchema),
          });

          return;
        }
        const jsonUserConnections = await jsonDb.userJson();
        const connectionForCurrenUser = jsonUserConnections.find(jsonUser => jsonUser.user.id === user.id);
        if (connectionForCurrenUser && jsonAccessiblity(jsonDb.read, connectionForCurrenUser.role)) {
          res.send({
            result: schemaParser(jsonDb.json, databaseSchema),
          });

          return;
        }
        throw appError('Erisim Izni Yok');
      }
      throw appError('Json Not Found');
    } catch (error) {
      res.status(500).send({ status: 500, ...error });
    }
  });
  /* UPDATE JSON */
  app.put('/json/:id', async (req, res) => {
    const { user } = req as RequestWithUser;
    try {
      const jsonDb = await db.Json.getJsonById(req.params.id);
      const { path: databasePath, schema: databaseSchema, action: databaseAction } = {
        action: DatabaseUpdateActions.replace,
        ...req.query,
      } as PutQuery;
      if (jsonDb) {
        const body = { data: jsonDb.json, read: jsonDb.read, write: jsonDb.write, ...req.body } as PostPutBody;
        if (accessIsCorrect(body.read) && accessIsCorrect(body.write)) {
          const newJson = jsonUpdater(jsonDb.json, body.data, databasePath, databaseAction);
          if (jsonDb.write === JsonUserRole.everyone) {
            const updatedJsonRow = await db.Json.updatePrivateJson(jsonDb.id, newJson, {
              write: body.write,
              read: body.read,
            });
            res.send({
              result: schemaParser(updatedJsonRow.json, databaseSchema),
            });

            return;
          }
          const jsonUserConnections = await jsonDb.userJson();
          const connectionForCurrenUser = jsonUserConnections.find(jsonUser => jsonUser.user.id === user.id);

          if (connectionForCurrenUser && jsonAccessiblity(jsonDb.write, connectionForCurrenUser.role)) {
            const updatedJsonRow = await db.Json.updatePrivateJson(jsonDb.id, newJson, {
              write: body.write,
              read: body.read,
            });
            res.send({
              result: schemaParser(updatedJsonRow.json, databaseSchema),
            });

            return;
          }
        }
        throw appError(`Access Must Be a [${Object.keys(JsonUserRole).join(', ')}]`);
      }
      throw appError('Json Not Found');
    } catch (error) {
      res.status(500).send({ ...error, status: 500 });
    }
  });
};

export default jsonRoute;
