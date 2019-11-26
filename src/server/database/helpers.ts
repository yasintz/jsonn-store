type BooleanType = 'boolean';
type StringType = 'string';
export type TableColumnType = BooleanType | StringType;

export interface TableColumn {
  name: string;
  type: TableColumnType;
  primaryKey?: boolean;
}

export interface RunParams {
  sql: string;
  params?: any[];
}

export interface UserTable {
  username: string;
  id: string;
}

export interface JsonTable {
  id: string;
  json: string;
  is_private: string;
  user_id: string | null;
}
