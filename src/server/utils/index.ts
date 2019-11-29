import jsonParser from './json-parser';
import { JsonUserRole } from '../database/models/user-json';

const accessibilty: Record<JsonUserRole, JsonUserRole[]> = {
  [JsonUserRole.everyone]: [JsonUserRole.everyone, JsonUserRole.admin, JsonUserRole.member],
  [JsonUserRole.member]: [JsonUserRole.admin, JsonUserRole.member],
  [JsonUserRole.admin]: [JsonUserRole.admin],
};

function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function schemaParser(db: any, schema?: string | null) {
  let result = db;

  if (schema) {
    result = jsonParser(db, schema);
  }

  return result;
}
function accessIsCorrect(str: string) {
  return Object.keys(JsonUserRole).includes(str);
}
const jsonAccessiblity = (jsonAccess: JsonUserRole, userRole: JsonUserRole) => {
  return accessibilty[jsonAccess].includes(userRole);
};

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export { makeid, schemaParser, numberWithCommas, accessIsCorrect, jsonAccessiblity };
