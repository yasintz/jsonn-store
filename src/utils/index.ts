function makeid(length: number) {
  let result = 'i';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_1234567890';
  for (let i = 0; i < length - 1; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function faktor(sayi: number) {
  let result = 1;
  for (let i = 1; i <= sayi; i++) {
    result *= i;
  }

  return result;
}

function combination(elementCount: number, choicesCount: number) {
  return Math.round(faktor(elementCount) / (faktor(choicesCount) * faktor(elementCount - choicesCount)));
}

function createIdStore(length = 15) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_1234567890';
  const objCombination = combination(characters.length, length);

  return {
    _val: 0,
    next() {
      if (this._val <= objCombination) {
        this._val++;
      }
    },
    get() {
      let x = this._val.toString(15);
      while (x.length < objCombination.toString(15).length) {
        x = `0${x}`;
      }

      return x
        .split('')
        .map(i => characters[parseInt(i, 15)])
        .join('');
    },
  };
}

const idStore = createIdStore();

function makeSameId() {
  const result = idStore.get();

  idStore.next();

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

export { makeid, asyncMap, makeSameId };
