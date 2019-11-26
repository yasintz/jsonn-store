import { TableColumn, TableColumnType } from './helpers';

const TABLE_TYPE_MAP: Record<TableColumnType, string> = {
  string: 'TEXT',
  boolean: 'INTEGER',
};

function table<T>(name: string, columns: TableColumn[], sql?: string) {
  const tableName = name;
  const columnsString = columns
    .map(column => `${column.name} ${TABLE_TYPE_MAP[column.type]} ${column.primaryKey ? 'PRIMARY KEY' : ''}`)
    .join(',');
  return {
    tableName,
    createSql: `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsString} ${sql ? sql : ''});`,
    insertSql: `INSERT INTO ${name} (${columns.map(col => col.name).join(',')}) VALUES (${columns
      .map((col, index) => `$${index + 1}`)
      .join(',')})`,
  };
}

const userTable = table('USERS_TABLE', [
  { name: 'username', type: 'string' },
  { name: 'password', type: 'string' },
  { name: 'id', type: 'string', primaryKey: true },
]);
const jsonTable = table('JSON_TABLE', [
  {
    name: 'id',
    primaryKey: true,
    type: 'string',
  },
  {
    name: 'json',
    type: 'string',
  },
  {
    name: 'is_private',
    type: 'boolean',
  },
  {
    name: 'user_id',
    type: 'string',
  },
]);

export { userTable, jsonTable };
