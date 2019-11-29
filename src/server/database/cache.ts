import NodeCache from 'node-cache';

class Cache {
  private cache: NodeCache;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
  }

  get = <T>(key: string, storeFunction: () => Promise<T>): Promise<T> => {
    const value = this.cache.get<T>(key);
    if (value) {
      return Promise.resolve(value);
    }

    return storeFunction().then(result => {
      this.cache.set(key, result);

      return result;
    });
  };

  update = (key: string, u: (prev: any) => any) => {
    this.cache.set(key, u(this.cache.get(key)));
  };

  del = (keys: string) => {
    this.cache.del(keys);
  };

  delIncluded = (startStr = '') => {
    if (!startStr) {
      return;
    }

    this.cache.keys().forEach(key => {
      if (key.indexOf(startStr) >= 0) {
        this.del(key);
      }
    });
  };

  flush = () => {
    this.cache.flushAll();
  };
}

const ttl = 1 * 60 * 60; // 1 hour

export default new Cache(ttl);
