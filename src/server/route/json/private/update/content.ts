import { RouteType, RequestWithUser, DatabaseUpdateActions } from '~/server/helpers';
import { schemaParser, jsonAccessiblity } from '~/server/utils';
import { appError } from '~/server/utils/errors';
import { JsonUserRole } from '~/server/database/models/user-json';
import jsonUpdater from '~/server/utils/json-updater';

interface PutQuery {
  action: DatabaseUpdateActions;
  path: string;
  schema: string;
}

const updateJsonContentRoute: RouteType = (app, ctx) => {
  const { db, socket } = ctx;

  /* UPDATE JSON */
  app.put('/json/:id', async (req, res) => {
    const { user } = req as RequestWithUser;
    try {
      const jsonDb = await db.Json.getJsonById(req.params.id);
      const { path: databasePath, schema: databaseSchema, action: databaseAction } = {
        action: DatabaseUpdateActions.replace,
        path: '',
        schema: '',
        ...req.query,
      } as PutQuery;

      if (!req.body) {
        throw appError('body is required field example {}');
      }

      if (jsonDb) {
        const { newJson, changedJson } = jsonUpdater(jsonDb.json, req.body, databasePath, databaseAction);
        if (jsonDb.write === JsonUserRole.everyone) {
          const updatedJsonRow = await db.Json.updatePrivateJsonContent(jsonDb.id, newJson);
          // TODO: implement [socket]
          // if (databasePath) {
          //   socket.emit(`${jsonDb.id}/${databasePath}`, changedJson);
          // }
          // socket.emit(jsonDb.id, newJson);
          res.send({
            result: schemaParser(updatedJsonRow.json, databaseSchema),
          });

          return;
        }
        const jsonUserConnections = await jsonDb.userJson();
        const connectionForCurrenUser = jsonUserConnections.find(jsonUser => jsonUser.user.id === user.id);

        if (connectionForCurrenUser && jsonAccessiblity(jsonDb.write, connectionForCurrenUser.role)) {
          const updatedJsonRow = await db.Json.updatePrivateJsonContent(jsonDb.id, newJson);
          if (databasePath) {
            socket.emit(`${jsonDb.id}/${databasePath}`, changedJson);
          }
          socket.emit(jsonDb.id, newJson);
          res.send({
            result: schemaParser(updatedJsonRow.json, databaseSchema),
          });

          return;
        }
      }
      throw appError('Json Not Found');
    } catch (error) {
      res.status(500).send({ ...error, status: 500 });
    }
  });
};

export default updateJsonContentRoute;
