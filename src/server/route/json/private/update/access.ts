import { Route } from '~/server/helpers';
import { JsonUserRole } from '~/server/database/models/user-json';
import { checkHasJson, checkAccessParams } from '~/server/middleware/check';
import { JsonTable } from '~/server/database/models/json';
import { HTTP404Error } from '~/server/helpers/http-errors';
import { UserTable } from '~/server/database/models/user';

interface PostPutBody {
  write: JsonUserRole;
  read: JsonUserRole;
}

const updateJsonAccessRoute: Route = {
  path: '/json/:id/access',
  method: 'put',
  handler: ctx => [
    checkHasJson(ctx),
    checkAccessParams,
    async (req, res) => {
      const user = res.locals.user as UserTable;
      const jsonDb = res.locals.jsonDb as JsonTable;
      const body = { read: jsonDb.read, write: jsonDb.write, ...req.body } as PostPutBody;
      const jsonUserConnections = await jsonDb.userJson();
      const connectionForCurrenUser = jsonUserConnections.find(jsonUser => jsonUser.user.id === user.id);

      if (connectionForCurrenUser && connectionForCurrenUser.role === JsonUserRole.admin) {
        await ctx.db.Json.updatePrivateJsonAccess(jsonDb.id, body.read, body.write);

        res.send({ status: true });

        return;
      }

      throw new HTTP404Error('user must me admin');
    },
  ],
};

export default updateJsonAccessRoute;
