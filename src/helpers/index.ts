export type MaybeArray<T> = T | T[];

export interface AppContext {
  jsonCount: number;
  mode: 'create' | 'view';
  database: {};
}
