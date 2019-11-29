import { Entity, Column, JoinColumn, OneToMany, PrimaryColumn, BaseEntity } from 'typeorm';
import md5 from 'md5';
import { makeid } from '~/utils';
import UserJson, { UserJsonTable, JsonUserRole } from './user-json';
import { JsonTable } from './json';
import cache from '../cache';

@Entity({
  name: 'user',
})
class UserTable extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(
    () => UserJsonTable,
    ju => ju.user,
  )
  @JoinColumn()
  jsonConnection: UserJsonTable[];

  createNewJson = async (json: any, access: { read: JsonUserRole; write: JsonUserRole }, role: JsonUserRole) => {
    const savedJson = await JsonTable.create({ id: makeid(15), json, ...access }).save();
    await UserJson.create(this, savedJson, role);

    cache.update('json_getCount', p => p + 1);

    return savedJson;
  };

  addRelationToJson = async (jsonId: string, role: JsonUserRole) => {
    const userJsonRow = await UserJson.createWithIds(this.id, jsonId, role);
    cache.del(`${jsonId}_userJson`);

    return userJsonRow;
  };
}

class User {
  hasUsername = (username: string) =>
    cache.get(`${username}_hasUsername`, async () => {
      const user = await UserTable.findOne({ username });

      if (user) {
        return true;
      }

      return false;
    });

  getUser = (username: string, password: string) =>
    cache.get(`${username}_${password}_getUser`, async () => {
      if (username && password) {
        return UserTable.findOne({ where: { username, password: md5(password) } });
      }

      return null;
    });

  getUserById = (userId: string) =>
    cache.get(`${userId}_getUserById`, () => {
      return UserTable.findOne({ where: { id: userId } });
    });

  update = async (userId: string, newUser: Partial<{ username: string; password: string }>) => {
    const currentUser = await this.getUserById(userId);
    if (currentUser) {
      cache.delIncluded(currentUser.username);

      if (newUser.username) {
        currentUser.username = newUser.username;
      }
      if (newUser.password) {
        currentUser.password = md5(newUser.password);
      }
      const updatedUser = await UserTable.save(currentUser);

      cache.delIncluded(updatedUser.username);
      cache.delIncluded(updatedUser.id);

      return updatedUser;
    }

    return currentUser;
  };

  save = (username: string, password: string) => {
    return UserTable.create({ id: makeid(15), username, password: md5(password) })
      .save()
      .then(user => {
        cache.delIncluded(user.username);

        return user;
      });
  };
}

export { UserTable };

export default new User();
