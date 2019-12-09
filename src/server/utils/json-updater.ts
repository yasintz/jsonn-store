import lodash from 'lodash';
import { DatabaseUpdateActions } from '../helpers';

function pathParser(json: any, path: string) {
  const items = path.split('.');
  if (items.find(item => item.includes('['))) {
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
        correctPath += `.${p}`;
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
      case DatabaseUpdateActions.replace:
        return newValue;
      case DatabaseUpdateActions.assign:
        return { ...currentJson, ...newValue };
      case DatabaseUpdateActions.deepAssign:
        return lodash.merge(currentJson, newValue);

      case DatabaseUpdateActions.push: {
        if (lodash.isArray(currentJson)) {
          currentJson.push(newValue);
        } else if (currentJson === undefined || currentJson === null) {
          return [newValue];
        }

        return currentJson;
      }
      case DatabaseUpdateActions.contact: {
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
