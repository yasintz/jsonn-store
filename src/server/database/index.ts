import 'reflect-metadata';
import { createConnection } from 'typeorm';
import Models from './models';

require('dotenv').config();

function databaseInit() {
  return createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: Object.keys(Models).map(key => Models[key]),
    synchronize: true,
  });
}

export default databaseInit;
