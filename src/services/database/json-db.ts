import JsonDatabaseModel from '../../database/models/json-db';
import { v4 as uuid } from 'uuid';

class JsonDatabaseService {
  getByUsername = async (username: string) => JsonDatabaseModel.findOne({ where: { username } });

  getOrCreate = async (username: string, db?: object) => {
    const databaseByUserName = await this.getByUsername(username);
    if (databaseByUserName) {
      return databaseByUserName;
    }

    const newDatabase = JsonDatabaseModel.create({ id: uuid(), username, db: db || {} });
    await newDatabase.save();

    return newDatabase;
  };

  updateOrCreate = async (username: string, db: object) => {
    const database = await this.getOrCreate(username);
    database.db = db;

    await database.save();

    return database;
  };
}

const jsonDatabaseService = new JsonDatabaseService();

export default jsonDatabaseService;
