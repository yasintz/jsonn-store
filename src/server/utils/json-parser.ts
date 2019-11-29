import jsonParser, { registerHelper } from 'yasintz-json-parser';

registerHelper('filter', ({ args, node, next }) => {
  const [key, operator, arg] = args;
  if (Array.isArray(node) && operator === '>') {
    return next(node.filter(item => item[key] > parseFloat(arg)));
  }

  return next(node);
});

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

registerHelper('getByKey', ({ node, args, next }) => {
  const [key] = args;
  try {
    if (node !== undefined && node !== null && key) {
      return next(node[key]);
    }
  } catch (error) {} // eslint-disable-line no-empty

  return next(node);
});

export default jsonParser;
