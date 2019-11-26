import lodash from 'lodash';
import { Express } from 'express';
import { getJson, getUser } from '../../database/functions';
import database from '../../database';
import { jsonTable } from '../../database/table';

export default (route: string, app: Express) => {
  app.put(`${route}/:id`, async (req, res) => {
    const { username, password } = req.headers;
    const { path: databasePath } = req.query;
    const body = { data: {}, ...req.body };
    const databaseId = req.params.id;
    try {
      const databaseResult = await getJson(databaseId);
      if (databaseResult.is_private) {
        const user = await getUser(username as string, password as string);
        if (user.id === databaseResult.user_id) {
          const newJson = databasePath
            ? lodash.set(JSON.parse(databaseResult.json), databasePath, body.data)
            : body.data;
          database
            .run(`UPDATE ${jsonTable.tableName} SET json = $1 WHERE id = $2`, [
              JSON.stringify(newJson),
              databaseResult.id,
            ])
            .then(() => {
              res.send({
                result: body.data,
              });
            })
            .catch(error => {
              res.status(500).send({
                mesage: 'Internal Server Error',
                status: 500,
                error,
              });
            });
        } else {
          res.status(500).send({ mesage: 'Iznin Yok', status: 500 });
        }
      } else {
        const newJson = databasePath ? lodash.set(JSON.parse(databaseResult.json), databasePath, body.data) : body.data;
        database
          .run(`UPDATE ${jsonTable.tableName} SET json = $1 WHERE id = $2`, [
            JSON.stringify(newJson),
            databaseResult.id,
          ])
          .then(() => {
            res.send({
              result: body.data,
            });
          });
      }
    } catch (error) {
      res.status(500).send({ mesage: 'Internal Server Error', status: 500, error });
    }
  });
};
