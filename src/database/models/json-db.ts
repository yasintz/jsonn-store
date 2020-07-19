import _ from 'lodash';
import { ModelsBaseEntitiy } from '../base-entities';
import { Entity, Column } from 'typeorm';
import { SerializedModelType } from '../../helpers';

export type SerializedJsonDatabaseFields = 'username' | 'db';

const serializedFields: SerializedJsonDatabaseFields[] = ['username', 'db'];

@Entity({ name: 'json-db' })
class JsonDatabaseModel extends ModelsBaseEntitiy<SerializedJsonDatabaseFields, JsonDatabaseModel> {
  @Column({ unique: true })
  username!: string;

  @Column({ type: 'json' })
  db!: object;

  serialize = () => _.pick(this, serializedFields);
}

export type SerializedJsonDatabase = SerializedModelType<SerializedJsonDatabaseFields, JsonDatabaseModel>;

export default JsonDatabaseModel;
