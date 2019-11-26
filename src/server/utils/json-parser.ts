import jsonParser, { registerHelper } from 'yasintz-json-parser';

registerHelper('filter', ({ args, node, next }) => {
  const [key, operator, arg] = args;
  if (Array.isArray(node) && operator === '>') {
    return next(node.filter(item => item[key] > parseFloat(arg)));
  }

  return next(node);
});

export default jsonParser;
