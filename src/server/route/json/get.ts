import { Express } from 'express';
import { getJson, getUser } from '../../database/functions';
import { resultHandler } from '../../utils';

export default (route: string, app: Express) => {
  app.get(`${route}/:id`, (req, res) => {
    const { username, password } = req.headers;
    try {
      const { path: databasePath, schema: databaseSchema } = req.query;
      const databaseId = req.params.id;
      getJson(databaseId)
        .then(databaseResult => {
          if (databaseResult.is_private) {
            getUser(username as string, password as string)
              .then(user => {
                if (user.id === databaseResult.user_id) {
                  res.send({
                    result: resultHandler(databaseResult, databasePath, databaseSchema),
                  });
                } else {
                  res.status(500).send({ mesage: 'Iznin Yok', status: 500 });
                }
              })
              .catch(error => {
                res.status(500).send({
                  mesage: 'User bilgilerine ulasilamadi',
                  status: 500,
                  error,
                });
              });
          } else {
            const result = resultHandler(databaseResult, databasePath, databaseSchema);
            res.send({ result });
          }
        })
        .catch(e => {
          res.status(500).send({ mesage: 'Internal Server Error', status: 500, error: e });
        });
    } catch (error) {
      res.status(500).send({ mesage: 'Internal Server Error', status: 500, error });
    }
  });
};
