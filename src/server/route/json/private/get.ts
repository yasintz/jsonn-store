import { RouteType, RequestWithUser } from '~/server/helpers';
import { schemaParser, jsonAccessiblity } from '~/server/utils';
import { appError } from '~/server/utils/errors';
import { JsonUserRole } from '~/server/database/models/user-json';

const getJsonRoute: RouteType = (app, ctx) => {
  const { db } = ctx;

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
};

export default getJsonRoute;
