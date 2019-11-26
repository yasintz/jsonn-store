import { Express } from 'express';
import md5 from 'md5';
import { getUser } from '../../database/functions';
import database from '../../database';
import { userTable } from '../../database/table';
import { makeid } from '../../utils';
export default (route: string, app: Express) => {
  app.post(route, async (req, res) => {
    const body = {
      ...req.body,
    };
    try {
      if (body.username && body.password) {
        getUser(body.username, body.password)
          .then(() => {
            res.send('User mecvut');
          })
          .catch(() => {
            const user = {
              username: body.username,
              id: makeid(9),
            };
            database.run(userTable.insertSql, [body.username, md5(body.password), user.id]).then(() => {
              res.send(user);
            });
          });
      } else {
        throw new Error('Username pass yok');
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  });
};
