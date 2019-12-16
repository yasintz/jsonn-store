export type MaybeArray<T> = T | T[];

interface DocumentItem {
  id: string;
  title: string;
  content: string;
}

export interface PageProps {
  jsonCount: number;
  docs: Array<DocumentItem>;
}
