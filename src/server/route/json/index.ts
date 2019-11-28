import lodash from 'lodash';
import { Request } from 'express';
import { RouteType } from '~/server/helpers';
import { generateViewLink, generateApiLink } from '~/server/utils/link';
import { resultHandler } from '~/server/utils';
import appError from '~/server/utils/app-error';

function responseCreator(req: Request, id: string) {
  return {
    url: generateApiLink(req, id),
    id,
    view: generateViewLink(req, id),
  };
}
const jsonRoute: RouteType = (path, app, { db }) => {
  /* CREATE JSON */
  app.post(path, async (req, res) => {
    try {
      const body = {
        data: {},
        isPrivate: false,
        ...req.body,
      };
      if (body.username && body.password) {
        const user = await db.User.getUser(body.username, body.password);
        if (user) {
          const json = await db.User.createNewJson(user.id, body.data, body.isPrivate);
          res.send(responseCreator(req, json.id));
        } else {
          throw appError('User Not Found');
        }
      } else {
        const json = await db.Json.savePublicJson(body.data);
        res.send(responseCreator(req, json.id));
      }
    } catch (error) {
      res.send({ error });
    }
  });

  /* GET JSON */
  app.get(`${path}/:id`, async (req, res) => {
    try {
      const { username, password } = req.headers as { username: string; password: string };
      const { path: databasePath, schema: databaseSchema } = req.query;
      const jsonDb = await db.Json.getJsonByIdWithRelatedUser(req.params.id);
      if (jsonDb) {
        if (jsonDb.isPrivate) {
          const user = await db.User.getUser(username, password);
          if (user && jsonDb.user.id === user.id) {
            res.send({
              result: resultHandler(jsonDb, databasePath, databaseSchema),
            });
          } else {
            throw appError('UUPs Forbidden');
          }
        } else {
          const result = resultHandler(jsonDb, databasePath, databaseSchema);
          res.send({ result });
        }
      } else {
        throw appError('Json Not Found');
      }
    } catch (error) {
      res.status(500).send({ status: 500, ...error });
    }
  });
  /* UPDATE JSON */
  app.put(`${path}/:id`, async (req, res) => {
    const { username, password } = req.headers as { username: string; password: string };
    const { path: databasePath } = req.query;
    const body = { data: {}, ...req.body };
    try {
      const jsonDb = await db.Json.getJsonByIdWithRelatedUser(req.params.id);
      if (jsonDb && jsonDb.isPrivate) {
        const user = await db.User.getUser(username, password);
        if (user && user.id === jsonDb.user.id) {
          const newJson = databasePath ? lodash.set(jsonDb.json, databasePath, body.data) : body.data;
          await db.Json.updatePrivate(jsonDb.id, user, newJson, true);
          res.send({
            result: body.data,
          });
        }
      } else if (jsonDb) {
        const newJson = databasePath ? lodash.set(jsonDb.json, databasePath, body.data) : body.data;
        await db.Json.updatePublicJson(jsonDb.id, newJson, false);
        res.send({
          result: body.data,
        });
      } else {
        throw appError('Json Not Found');
      }
    } catch (error) {
      res.status(500).send({ ...error, status: 500 });
    }
  });
};

export default jsonRoute;
