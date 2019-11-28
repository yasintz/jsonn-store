import { Connection, Entity, Column, PrimaryColumn, Repository, ManyToOne } from 'typeorm';
import { makeid } from '~/utils';
import { UserTable } from './user';

@Entity({
  name: 'jsonss__table',
})
class JsonTable {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'json' })
  json: any;

  @ManyToOne(
    type => UserTable,
    user => user.jsons,
    { nullable: true },
  )
  user: UserTable;

  @Column({ type: 'boolean' })
  isPrivate: boolean;

  constructor(json: any, isPrivate?: boolean, user?: UserTable) {
    if (json) {
      this.id = makeid(15);
      this.json = json;
      if (isPrivate && user) {
        this.isPrivate = true;
        this.user = user;
      } else {
        this.isPrivate = false;
      }
    }
  }
}

class Json {
  private repository: Repository<JsonTable>;

  constructor(conn: Connection) {
    this.repository = conn.getRepository(JsonTable);
  }

  savePublicJson = (json: any, user?: UserTable) => {
    if (user) {
      return this.repository.save(new JsonTable(json, false, user));
    }

    return this.repository.save(new JsonTable(json, false));
  };

  savePrivateJson = (json: any, user: UserTable) => {
    return this.repository.save(new JsonTable(json, true, user));
  };

  getJsonByIdWithRelatedUser = (jsonId: string) => {
    return this.repository.findOne({ where: { id: jsonId }, relations: ['user'] });
  };

  updatePublicJson = async (jsonId: string, json: any, isPrivate?: boolean) => {
    const jsonDb = await this.getJsonByIdWithRelatedUser(jsonId);
    if (jsonDb) {
      jsonDb.json = json;
      if (typeof isPrivate === 'boolean') {
        jsonDb.isPrivate = isPrivate;
      }

      const updatedJson = await this.repository.save(jsonDb);

      return updatedJson;
    }

    return jsonDb;
  };

  updatePrivate = async (jsonId: string, user: UserTable, json: any, isPrivate?: boolean) => {
    const jsonDb = await this.getJsonByIdWithRelatedUser(jsonId);
    if (jsonDb && jsonDb.user.id === user.id) {
      jsonDb.json = json;
      if (typeof isPrivate === 'boolean') {
        jsonDb.isPrivate = isPrivate;
      }

      const updatedJson = await this.repository.save(jsonDb);

      return updatedJson;
    }

    return jsonDb;
  };

  getAllThePublic = async () => {
    return this.repository.find({ where: { isPrivate: false } });
  };
}

export { JsonTable };

export default Json;
