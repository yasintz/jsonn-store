import lodash from 'lodash';
import jsonParser, { registerHelper } from 'yasintz-json-parser';

registerHelper('slice', ({ node, args, next }) => {
  try {
    if (Array.isArray(node)) {
      return next(node.slice(parseInt(args[0], 10), parseInt(args[1], 10)));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return next(node);
});

registerHelper('getByPath', ({ node, args, next }) => {
  const [key] = args;
  try {
    if (node !== undefined && node !== null && key) {
      return next(lodash.get(node, key, null));
    }
  } catch (error) {} // eslint-disable-line no-empty

  return next(node);
});

registerHelper('arrayFilterEqualsByKey', ({ args, node, next }) => {
  if (Array.isArray(node)) {
    const [itemKey, ...values] = args;

    return next(
      node.filter(item => {
        let value = item;
        if (itemKey !== '$') {
          value = item[itemKey];
        }

        return values.includes(value);
      }),
    );
  }

  return next(node);
});

export default jsonParser;
