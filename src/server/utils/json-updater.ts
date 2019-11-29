import lodash from 'lodash';
import { DatabaseUpdateActions } from '../helpers';

export default (json: any, newValue: any, path: string, action: DatabaseUpdateActions) => {
  try {
    const newJson = (() => {
      const currentJson = path ? lodash.get(JSON.parse(JSON.stringify(json)), path) : JSON.parse(JSON.stringify(json));
      switch (action) {
        case DatabaseUpdateActions.replace:
          return newValue;
        case DatabaseUpdateActions.assign:
          return { ...currentJson, ...newValue };
        case DatabaseUpdateActions.deepAssign:
          return lodash.merge(currentJson, newValue);

        case DatabaseUpdateActions.push: {
          if (lodash.isArray(currentJson)) {
            currentJson.push(newValue);
          }

          return currentJson;
        }
        case DatabaseUpdateActions.contact: {
          if (lodash.isArray(currentJson) && lodash.isArray(newValue)) {
            return lodash.concat(currentJson, newValue);
          }

          return currentJson;
        }

        default:
          return currentJson;
      }
    })();
    let cloneJson = JSON.parse(JSON.stringify(json));
    if (path) {
      lodash.set(cloneJson, path, newJson);
    } else {
      cloneJson = newJson;
    }

    return cloneJson;
  } catch (error) {
    return json;
  }
};
