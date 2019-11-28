import { RouteType } from '~/server/helpers';

const userRoute: RouteType = (route, app, { db }) => {
  /* CREATE USER */
  app.post(route, async (req, res) => {
    const body = {
      ...req.body,
    };
    try {
      if (body.username && body.password) {
        const hasUser = await db.User.hasUsername(body.username);
        if (hasUser) {
          throw new Error('Username Daha once kayit edilmis');
        }
        const newUser = await db.User.save(body.username, body.password);
        delete newUser.password;
        res.send(newUser);
      } else {
        throw new Error('Username pass yok');
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  });

  /* UPDATE USER */
  app.put(route, async (req, res) => {
    try {
      const { username, password } = req.headers as {
        username: string;
        password: string;
      };
      const { username: newUsername, password: newPassword } = req.body as {
        username: string;
        password: string;
      };
      const user = await db.User.getUser(username, password);
      if (user) {
        const updatedUser = await db.User.update(user.id, { username: newUsername, password: newPassword });
        if (updatedUser) {
          delete updatedUser.password;
          res.send(updatedUser);
        } else {
          throw new Error('User Not Found');
        }
      }
    } catch (error) {
      res.send({ error });
    }
  });
};

export default userRoute;
