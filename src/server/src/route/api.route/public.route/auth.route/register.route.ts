import { Route } from '@server/helpers';
import { checkAuthBodyMiddleware } from '@server/middleware';
import ServerContext from '@server/context';
import { HTTP400Error } from '@server/helpers/http-errors';

const registerRoute: Route = {
  method: 'post',
  path: '/register',
  middlewares: [checkAuthBodyMiddleware],
  handler: async (req, res, next) => {
    const { UserService } = ServerContext.DatabaseContext.Services;
    const hasUser = await UserService.hasUserByName(req.body.username);
    if (hasUser) {
      throw new HTTP400Error('Username Daha once kayit edilmis');
    }
    const newUser = await UserService.create(req.body.username, req.body.password);
    res.json({ username: newUser.username, id: newUser.id });
  },
};

export default registerRoute;
