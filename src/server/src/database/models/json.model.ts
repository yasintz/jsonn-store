import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany } from 'typeorm';
import UserJsonModel from './user_json.model';

@Entity({
  name: 'json',
})
class JsonModel extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'json' })
  json: any;

  @OneToMany(
    () => UserJsonModel,
    userJson => userJson.json,
    { nullable: true },
  )
  userConnection: UserJsonModel[];
}

export default JsonModel;
