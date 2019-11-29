import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn, BaseEntity } from 'typeorm';
import { UserTable } from './user';
import { JsonTable } from './json';
import { makeid } from '~/utils';

export enum JsonUserRole {
  admin = 'admin',
  member = 'member',
  everyone = 'everyone',
}

@Entity({ name: 'user_json' })
class UserJsonTable extends BaseEntity {
  @PrimaryColumn()
  public id: string;

  @Column()
  public jsonId: string;

  @Column()
  public userId: string;

  @Column('varchar')
  public role: JsonUserRole;

  @ManyToOne(
    type => UserTable,
    user => user.jsonConnection,
  )
  @JoinColumn({ name: 'userId' })
  public user: UserTable;

  @ManyToOne(
    type => JsonTable,
    json => json.userConnection,
  )
  @JoinColumn({ name: 'jsonId' })
  public json: JsonTable;
}

class JsonUser {
  create = (user: UserTable, json: JsonTable, role: JsonUserRole) => {
    return UserJsonTable.create({ id: makeid(15), user, json, role }).save();
  };

  createWithIds = (userId: string, jsonId: string, role: JsonUserRole) => {
    return UserJsonTable.create({ id: makeid(15), userId, jsonId, role }).save();
  };
}

export { UserJsonTable };

export default new JsonUser();
