require('dotenv').config();
const isDev = process.env.NODE_ENV === 'development';
const isVscodeDebug = process.env.DEBUG_MODE === 'vscode';

let fileExtension = 'js';

if (isDev && !isVscodeDebug) {
  fileExtension = 'ts';
}

const folder = fileExtension === 'js' ? 'build' : 'src';

const logging = false;

module.exports = {
  url: process.env.DATABASE_URL,
  type: 'postgres',
  synchronize: true,
  // TODO: log errors on sentry
  logging: logging && isDev,
  entities: [`${folder}/database/models/**/*.${fileExtension}`],
  migrations: [`${folder}/migration/**/*.${fileExtension}`],
  subscribers: [`${folder}/subscriber/**/*.${fileExtension}`],
  cli: {
    entitiesDir: 'src/database/models',
    migrationsDir: 'src/database/migration',
    subscribersDir: 'src/database/subscriber',
  },
  // EXPLANATION: If this property is true, the server completely delete and recreate the database when it starts.
  dropSchema: false,
};
