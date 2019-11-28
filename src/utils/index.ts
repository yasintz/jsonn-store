function makeid(length: number) {
  let result = 'i';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_1234567890';
  for (let i = 0; i < length - 1; i++) {
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

export { makeid, asyncMap };
