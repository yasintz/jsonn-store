import { RouteType, RequestWithUser } from '~/server/helpers';
import { appError } from '~/server/utils/errors';

const userRoute: RouteType = (app, { db }) => {
  /* UPDATE USER */
  app.put('/', async (req, res) => {
    try {
      const { user } = req as RequestWithUser;
      const { username: newUsername, password: newPassword } = req.body as {
        username: string;
        password: string;
      };
      if (newUsername || newPassword) {
        const updatedUser = await db.User.update(user.id, { username: newUsername, password: newPassword });
        if (updatedUser) {
          delete updatedUser.password;
          res.send(updatedUser);

          return;
        }
      }
      throw appError('Username or Password required');
    } catch (error) {
      res.send({ error });
    }
  });

  return app;
};

export default userRoute;
