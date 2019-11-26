import lodash from 'lodash';
import { JsonTable } from '../database/helpers';
import jsonParser from './json-parser';

function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
async function asyncMap(array: (() => Promise<any>)[]): Promise<any> {
  if (array.length === 0) {
    return Promise.resolve();
  }
  if (array.length === 1) {
    return array[0]();
  }
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await array[index]();
  }

  return Promise.resolve();
}
function resultHandler(db: JsonTable, dbPath?: string, schema?: string) {
  let result = JSON.parse(db.json);
  if (dbPath) {
    result = lodash.get(result, dbPath);
  }
  if (schema) {
    result = jsonParser(result, schema);
  }
  return result;
}
function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export { makeid, asyncMap, resultHandler, numberWithCommas };
