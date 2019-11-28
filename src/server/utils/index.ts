import lodash from 'lodash';
import { JsonTable } from '../database/models/json';
import jsonParser from './json-parser';

function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function resultHandler(db: JsonTable, dbPath?: string, schema?: string) {
  let result = db.json;
  if (dbPath) {
    result = lodash.get(result, dbPath, null);
  }
  if (schema) {
    result = jsonParser(result, schema);
  }

  return result;
}
function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export { makeid, resultHandler, numberWithCommas };
