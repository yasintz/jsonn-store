import { Connection } from 'typeorm';
import { DBContext } from '../helpers';
import User from './models/user';
import Json from './models/json';

function getDbContext(conn: Connection): DBContext {
  const JsonDb = new Json(conn);
  const UserDb = new User(conn, { Json: JsonDb });

  return {
    Json: JsonDb,
    User: UserDb,
  };
}

export default getDbContext;
