import { RouteType, RequestWithUser } from '~/server/helpers';
import { accessIsCorrect } from '~/server/utils';
import { appError } from '~/server/utils/errors';
import { JsonUserRole } from '~/server/database/models/user-json';

interface PostPutBody {
  write: JsonUserRole;
  read: JsonUserRole;
}

const updateJsonAccessRoute: RouteType = (app, ctx) => {
  const { db } = ctx;

  /* UPDATE JSON */
  app.put('/json/:id/access', async (req, res) => {
    const { user } = req as RequestWithUser;
    try {
      const jsonDb = await db.Json.getJsonById(req.params.id);
      if (jsonDb) {
        const body = { read: jsonDb.read, write: jsonDb.write, ...req.body } as PostPutBody;
        if (accessIsCorrect(body.read) && accessIsCorrect(body.write)) {
          const jsonUserConnections = await jsonDb.userJson();
          const connectionForCurrenUser = jsonUserConnections.find(jsonUser => jsonUser.user.id === user.id);

          if (connectionForCurrenUser && connectionForCurrenUser.role === JsonUserRole.admin) {
            await db.Json.updatePrivateJsonAccess(jsonDb.id, body.read, body.write);

            res.send({ status: true });

            return;
          }

          throw appError('User must be a admin');
        }
        throw appError(`Access Must Be a [${Object.keys(JsonUserRole).join(', ')}]`);
      }
      throw appError('Json Not Found');
    } catch (error) {
      res.status(500).send({ ...error, status: 500 });
    }
  });
};

export default updateJsonAccessRoute;
