/* eslint-disable no-console */

import 'reflect-metadata';
import { createConnection } from 'typeorm';

async function connectToDatabase() {
  try {
    const connection = await createConnection();
    console.log('Connected to database.');
    return connection;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export { connectToDatabase };
