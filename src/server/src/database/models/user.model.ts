import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany, JoinColumn } from 'typeorm';
import UserJsonModel from './user_json.model';

@Entity({
  name: 'user',
})
class UserModel extends BaseEntity {
  @PrimaryColumn({ nullable: false })
  id: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: true })
  googleId: string;

  @Column({ unique: true, nullable: true })
  githubId: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(
    () => UserJsonModel,
    userJson => userJson.user,
  )
  @JoinColumn()
  jsonConnection: UserJsonModel[];
}

export default UserModel;
