import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn, BaseEntity } from 'typeorm';
import UserModel from './user.model';
import JsonModel from './json.model';

export enum UserJsonRole {
  admin = 'admin',
  member = 'member',
  everyone = 'everyone',
}

@Entity({ name: 'user_json' })
class UserJsonModel extends BaseEntity {
  @PrimaryColumn()
  public id: string;

  @Column()
  public jsonId: string;

  @Column()
  public userId: string;

  @Column('varchar')
  public role: UserJsonRole;

  @ManyToOne(
    type => UserModel,
    user => user.jsonConnection,
  )
  @JoinColumn({ name: 'userId' })
  public user: UserModel;

  @ManyToOne(
    type => JsonModel,
    json => json.userConnection,
  )
  @JoinColumn({ name: 'jsonId' })
  public json: JsonModel;
}

export default UserJsonModel;
