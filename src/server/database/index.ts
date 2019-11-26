import { userTable, jsonTable } from './table';
import { asyncMap } from '../utils';
import { Pool, QueryResult } from 'pg';

class Database {
  private db: Pool;
  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db.connect();
  }
  run = (sql: string, params: any[] = []) => {
    let sqlResult = sql;
    if (params) {
      params.forEach((param, index) => {
        sqlResult = sqlResult.replace(`$${index + 1}`, param);
      });
    }
    return new Promise<QueryResult>((resolve, reject) => {
      this.db.query(sql, params || [], function(err, result) {
        if (err) {
          console.log('Error running sql ' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
          console.log(`
            ${sqlResult} 
          `);
        }
      });
    });
  };
  init = (callback: Function) => {
    asyncMap([() => this.run(jsonTable.createSql), () => this.run(userTable.createSql)]).then(() => {
      callback();
    });
  };
}

export default new Database();
