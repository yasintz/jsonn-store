import { URL } from 'url';
import qs, { ParsedUrlQueryInput } from 'querystring';

export function makeUrl(baseUrl: string, path: string, params: ParsedUrlQueryInput) {
  // remove undefined fields
  Object.keys(params).forEach(key => (params[key] === undefined ? delete params[key] : {}));

  const paramsString = qs.stringify(params);
  const url = new URL(path, baseUrl);
  url.search = paramsString;
  return url.toString();
}
