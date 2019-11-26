import { Express } from 'express';
import md5 from 'md5';
import { getUser } from '../../database/functions';
import database from '../../database';
import { userTable } from '../../database/table';
const getDbItems = (body: any, userId: string) => {
  if (body.username && body.password) {
    return {
      sql: `UPDATE ${userTable.tableName} SET username = $1 , password = $2 WHERE id = $3`,
      params: [body.username, md5(body.password), userId],
    };
  }
  if (body.username) {
    return {
      sql: `UPDATE ${userTable.tableName} SET username = $1  WHERE id = $2`,
      params: [body.username, userId],
    };
  }
  return {
    sql: `UPDATE ${userTable.tableName} SET password = $1  WHERE id = $2`,
    params: [md5(body.password), , userId],
  };
};
export default (route: string, app: Express) => {
  app.put(`${route}`, (req, res) => {
    const { username, password } = req.headers as {
      username: string;
      password: string;
    };
    if (username && password) {
      if (req.body.username || req.body.password) {
        getUser(username, password)
          .then(user => {
            const getParams = getDbItems(req.body, user.id);
            database
              .run(getParams.sql, getParams.params)
              .then(() => {
                res.send({
                  result: {
                    username: req.body.username || username,
                    id: user.id,
                  },
                });
              })
              .catch(error => {
                res.status(500).send({
                  mesage: 'Internal Server Error',
                  status: 500,
                  error,
                });
              });
          })
          .catch(e => {
            res.status(500).send({ mesage: 'Internal Server Error', status: 500, error: e });
          });
      } else {
        res.status(400).send({ mesage: 'Eksik Prametre', status: 400 });
      }
    } else {
      res.status(400).send({ mesage: 'User Not Found', status: 400 });
    }
  });
};
