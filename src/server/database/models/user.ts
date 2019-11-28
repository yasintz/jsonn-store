import { Connection, Entity, Column, PrimaryColumn, Repository, OneToMany, JoinColumn } from 'typeorm';
import md5 from 'md5';
import { makeid } from '~/utils';
import { JsonTable } from './json';
import { ServerContext } from '~/server/helpers';

@Entity({
  name: 'users__table',
})
class UserTable {
  @PrimaryColumn()
  id: string;

  @PrimaryColumn()
  username: string;

  @Column()
  password: string;

  @OneToMany(
    type => JsonTable,
    json => json.user,
  )
  @JoinColumn()
  jsons: JsonTable[];

  constructor(username: string, password: string) {
    if (username && password) {
      this.id = makeid(15);
      this.username = username;
      this.password = md5(password);
    }
  }
}
type DbWithoutUser = Omit<ServerContext['db'], 'User'>;

class User {
  private repository: Repository<UserTable>;

  private db: DbWithoutUser;

  constructor(conn: Connection, db: DbWithoutUser) {
    this.repository = conn.getRepository(UserTable);
    this.db = db;
  }

  hasUsername = async (username: string) => {
    const user = await this.repository.findOne({ username });

    if (user) {
      return true;
    }

    return false;
  };

  getUser = async (username: string, password: string) => {
    if ((typeof username === 'string' && typeof password === 'string') || typeof password === 'number') {
      return this.repository.findOne({ where: { username, password: md5(password) } });
    }

    return null;
  };

  getUserById = async (userId: string) => {
    return this.repository.findOne({ where: { id: userId } });
  };

  update = async (userId: string, newUser: Partial<{ username: string; password: string }>) => {
    const currentUser = await this.getUserById(userId);
    if (currentUser) {
      if (newUser.username) {
        currentUser.username = newUser.username;
      }
      if (newUser.password) {
        currentUser.password = md5(newUser.password);
      }
      const updatedUser = await this.repository.save(currentUser);

      return updatedUser;
    }

    return currentUser;
  };

  createNewJson = async (userId: string, json: any, isPrivate: boolean) => {
    const currentUser = await this.getUserById(userId);
    if (currentUser && isPrivate) {
      const savedJson = await this.db.Json.savePrivateJson(json, currentUser);

      return savedJson;
    }

    if (currentUser) {
      const savedJson = await this.db.Json.savePublicJson(json, currentUser);

      return savedJson;
    }

    throw new Error('User Not Found');
  };

  save = (username: string, password: string) => {
    return this.repository.save(new UserTable(username, password));
  };
}

export { UserTable };

export default User;
