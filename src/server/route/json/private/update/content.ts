import { DatabaseUpdateActions, Route } from '~/server/helpers';
import { schemaParser, jsonAccessiblity } from '~/server/utils';
import { JsonUserRole } from '~/server/database/models/user-json';
import jsonUpdater from '~/server/utils/json-updater';
import { checkHasJson } from '~/server/middleware/check';
import { JsonTable } from '~/server/database/models/json';
import { UserTable } from '~/server/database/models/user';
import { HTTP403Error } from '~/server/helpers/http-errors';

interface PutQuery {
  action: DatabaseUpdateActions;
  path: string;
  schema: string;
}

const updateJsonContentRoute: Route = {
  path: '/json/:id',
  method: 'put',
  handler: ctx => [
    checkHasJson(ctx),
    async (req, res, next) => {
      try {
        const user = res.locals.user as UserTable;
        const jsonDb = res.locals.jsonDb as JsonTable;
        const { path: databasePath, schema: databaseSchema, action: databaseAction } = {
          action: DatabaseUpdateActions.replace,
          path: '',
          schema: '',
          ...req.query,
        } as PutQuery;

        const { newJson } = jsonUpdater(jsonDb.json, req.body, databasePath, databaseAction);
        if (jsonDb.write === JsonUserRole.everyone) {
          const updatedJsonRow = await ctx.db.Json.updatePrivateJsonContent(jsonDb.id, newJson);
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
          const updatedJsonRow = await ctx.db.Json.updatePrivateJsonContent(jsonDb.id, newJson);
          // TODO: implement [socket]
          // if (databasePath) {
          //   socket.emit(`${jsonDb.id}/${databasePath}`, changedJson);
          // }
          // socket.emit(jsonDb.id, newJson);
          res.send({
            result: schemaParser(updatedJsonRow.json, databaseSchema),
          });
        } else {
          throw new HTTP403Error('Access denied');
        }
      } catch (error) {
        next(error);
      }
    },
  ],
};

export default updateJsonContentRoute;
