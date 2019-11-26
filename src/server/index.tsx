import express from 'express';
import database from './database';
import jsonGet from './route/json/get';
import jsonUpdate from './route/json/update';
import jsonCreate from './route/json/create';
import userCreate from './route/user/create';
import userUpdate from './route/user/update';
import home from './route/home';

const app = express()
  .disable('x-powered-by')
  // eslint-disable-next-line
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!));

database.init(() => {
  jsonGet('/api/json', app);
  jsonUpdate('/api/json', app);
  jsonCreate('/api/json', app);
  userCreate('/api/user', app);
  userUpdate('/api/user', app);
  home(app);
});

export default app;
