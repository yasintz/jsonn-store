import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import Models from './models';

function databaseInit(cb: (connection: Connection) => void) {
  createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: Object.keys(Models).map(key => Models[key]),
    synchronize: true,
  })
    .then(connection => cb(connection))
    // eslint-disable-next-line no-console
    .catch(error => console.error(error));
}

export default databaseInit;
