import lodash from 'lodash';
import { Route } from '~/server/helpers';
import { checkUpdateUserBody } from '~/server/middleware/check';
import { UserTable } from '~/server/database/models/user';

const userRoute: Route[] = [
  {
    path: '/',
    method: 'put',
    handler: ({ db }) => [
      checkUpdateUserBody,
      async (req, res) => {
        const user = res.locals.user as UserTable;
        const { username: newUsername, password: newPassword } = req.body as {
          username: string;
          password: string;
        };
        const updatedUser = await db.User.update(user.id, { username: newUsername, password: newPassword });
        res.send(lodash.omit(updatedUser, 'password'));
      },
    ],
  },
];

export default userRoute;
