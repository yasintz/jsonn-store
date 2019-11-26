import md5 from 'md5';
import database from '.';
import { userTable, jsonTable } from './table';
import { UserTable, JsonTable } from './helpers';

function getUser(username: string, password: string) {
  return new Promise<UserTable>((resolve, reject) => {
    if (username && password) {
      const md5Password = md5(password);
      database
        .run(`Select * from ${userTable.tableName} where  username = $1 AND password = $2`, [username, md5Password])
        .then(result => {
          if (result.rowCount == 1) {
            resolve(result.rows[0]);
          } else {
            reject('User Not found');
          }
        })
        .catch(e => reject(e));
    } else {
      reject('Username yada password yok');
    }
  });
}

function getJson(id: string) {
  return new Promise<JsonTable>((resolve, reject) => {
    database
      .run(`Select * from ${jsonTable.tableName} where id = $1`, [id])
      .then(result => {
        if (result.rowCount == 1) {
          resolve(result.rows[0]);
        } else {
          reject('Json Not Found');
        }
      })
      .catch(e => reject(e));
  });
}

function getAllJson() {
  return new Promise<JsonTable[]>((resolve, reject) => {
    database
      .run(`Select * from ${jsonTable.tableName}`)
      .then(result => {
        resolve(result.rows);
      })
      .catch(e => reject(e));
  });
}

export { getUser, getJson, getAllJson };
