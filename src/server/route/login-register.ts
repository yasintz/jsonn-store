import jwt from 'jsonwebtoken';
import { RouteType } from '~/server/helpers';
import { appError } from '../utils/errors';

const userRoute: RouteType = (app, { db, JWT_SECRET }) => {
  /* CREATE USER */
  app.post('/signup', async (req, res) => {
    const body = {
      ...req.body,
    };
    try {
      if (body.username && body.password) {
        const hasUser = await db.User.hasUsername(body.username);
        if (hasUser) {
          throw appError('Username Daha once kayit edilmis');
        }
        const newUser = await db.User.save(body.username, body.password);
        delete newUser.password;
        res.send(newUser);
      } else {
        throw appError('Username pass yok');
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  });

  /* LOGIN USER */
  app.post('/login', async (req, res) => {
    try {
      if (req.body.username && req.body.password) {
        const user = await db.User.getUser(req.body.username, req.body.password);
        if (user) {
          delete user.password;
          res.json({
            ...user,
            token: jwt.sign(
              {
                userId: user.id,
              },
              JWT_SECRET,
              { expiresIn: 60 * 60 },
            ),
          });

          return;
        }
        throw appError('Username Not Found');
      }

      throw appError('Username pass yok');
    } catch (error) {
      res.status(500).send({ error });
    }
  });

  return app;
};

export default userRoute;
