import jwt from 'jsonwebtoken';
import lodash from 'lodash';
import { checkAuthBody } from '~/server/middleware/check';
import { HTTP404Error, HTTP400Error } from '~/server/helpers/http-errors';
import { Route } from '~/server/helpers';

const authRoute: Route[] = [
  {
    method: 'post',
    path: '/signup',
    handler: ({ db }) => [
      checkAuthBody,
      async (req, res, next) => {
        try {
          const hasUser = await db.User.hasUsername(req.body.username);
          if (hasUser) {
            throw new HTTP400Error('Username Daha once kayit edilmis');
          }
          const newUser = await db.User.save(req.body.username, req.body.password);
          res.send(lodash.omit(newUser, 'password'));
        } catch (error) {
          next(error);
        }
      },
    ],
  },

  {
    method: 'post',
    path: '/login',
    handler: ctx => [
      checkAuthBody,
      async (req, res, next) => {
        try {
          const { db, JWT_SECRET } = ctx;
          const user = await db.User.getUser(req.body.username, req.body.password);
          if (!user) {
            throw new HTTP404Error('User Not Found');
          }

          res.json({
            ...lodash.omit(user, 'password'),
            token: jwt.sign(
              {
                userId: (user as any).id,
              },
              JWT_SECRET,
              { expiresIn: 60 * 60 },
            ),
          });
        } catch (error) {
          next(error);
        }
      },
    ],
  },
];

export default authRoute;
