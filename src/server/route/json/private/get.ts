import { Route } from '~/server/helpers';
import { schemaParser, jsonAccessiblity } from '~/server/utils';
import { JsonUserRole } from '~/server/database/models/user-json';
import { checkHasJson } from '~/server/middleware/check';
import { JsonTable } from '~/server/database/models/json';
import { HTTP403Error } from '~/server/helpers/http-errors';
import { UserTable } from '~/server/database/models/user';

const getJsonRoute: Route = {
  path: '/json/:id',
  method: 'get',
  handler: ctx => [
    checkHasJson(ctx),
    async (req, res, next) => {
      try {
        const user = res.locals.user as UserTable;
        const { schema: databaseSchema } = req.query;
        const jsonDb = res.locals.jsonDb as JsonTable;
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
        throw new HTTP403Error('Erisim Izni Yok');
      } catch (error) {
        next(error);
      }
    },
  ],
};

export default getJsonRoute;
