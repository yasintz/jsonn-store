import lodash from 'lodash';
import { DatabaseUpdateActions } from '../helpers';
import { HTTP404Error } from '../helpers/http-errors';
/*
example path:  
words[id=your_id].text
words[id=your_id,or_other_id].text
*/
function pathParser(json: any, path: string) {
  if (path.includes('[')) {
    const items = path.split('.');
    let correctPath = '';
    items.forEach(p => {
      if (p.includes('[')) {
        const [arrayKey, f] = p.split('[');
        correctPath += `${correctPath ? '.' : ''}${arrayKey}`;
        const fields = f
          .substring(0, f.length - 1)
          .split(',')
          .map(item => ({ key: item.split('=')[0], value: item.split('=')[1] }));
        const itselfSelector = fields.find(item => item.key === '$');
        const array = lodash.get(json, correctPath) as any[];
        if (Array.isArray(array)) {
          array.find((item, arrayIndex) => {
            if (itselfSelector && item === itselfSelector.value) {
              correctPath += `.${arrayIndex}`;

              return true;
            }
            let isCorrect = true;
            fields.forEach(({ key, value }) => {
              isCorrect = item[key] === value;
            });
            if (isCorrect) {
              correctPath += `.${arrayIndex}`;

              return true;
            }

            return false;
          });
        } else {
          throw new HTTP404Error(`${correctPath} not found in json`);
        }
      } else {
        correctPath += `${correctPath ? '.' : ''}${p}`;
      }
    });

    return correctPath;
  }

  return path;
}

export default (json: any, newValue: any, path: string, action: DatabaseUpdateActions) => {
  let cloneJson = JSON.parse(JSON.stringify(json));
  const correctPath = pathParser(json, path);
  const newJson = (() => {
    const currentJson = correctPath ? lodash.get(cloneJson, correctPath) : cloneJson;
    switch (action) {
      case DatabaseUpdateActions.REPLACE:
        return newValue;
      case DatabaseUpdateActions.ASSIGN:
        return { ...currentJson, ...newValue };
      case DatabaseUpdateActions.DEEP_ASSIGN:
        return lodash.merge(currentJson, newValue);

      case DatabaseUpdateActions.PUSH: {
        if (lodash.isArray(currentJson)) {
          currentJson.push(newValue);
        } else if (currentJson === undefined || currentJson === null) {
          return [newValue];
        }

        return currentJson;
      }
      case DatabaseUpdateActions.CONTACT: {
        if (lodash.isArray(currentJson) && lodash.isArray(newValue)) {
          return lodash.concat(currentJson, newValue);
        }

        if ((currentJson === undefined || currentJson === null) && lodash.isArray(newValue)) {
          return newValue;
        }

        return currentJson;
      }

      default:
        return currentJson;
    }
  })();
  if (correctPath) {
    lodash.set(cloneJson, correctPath, newJson);
  } else {
    cloneJson = newJson;
  }

  return { newJson: cloneJson, changedJson: newJson };
};
