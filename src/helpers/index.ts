export type MaybeArray<T> = T | T[];

export interface PageContext {
  jsonCount: number;
  mode: 'create' | 'view';
  database?: {
    json: any;
    id: any;
  };
}
