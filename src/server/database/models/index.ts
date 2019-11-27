import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import User from './user';

function databaseInit(cb: (connection: Connection) => void) {
  createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User],
  })
    .then(connection => cb(connection))
    .catch(error => console.log(error));
}

export default databaseInit;
