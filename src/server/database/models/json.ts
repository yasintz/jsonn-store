import { Entity, Column, OneToMany, PrimaryColumn, BaseEntity } from 'typeorm';
import { JsonUserRole, UserJsonTable } from './user-json';
import { makeid } from '~/utils';
import cache from '../cache';
import { HTTP404Error } from '~/server/helpers/http-errors';

@Entity({
  name: 'json',
})
class JsonTable extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'json' })
  json: any;

  @OneToMany(
    () => UserJsonTable,
    ju => ju.json,
    { nullable: true },
  )
  userConnection: UserJsonTable[];

  @Column('varchar')
  read: JsonUserRole;

  @Column('varchar')
  write: JsonUserRole;

  userJson = () => {
    return cache.get(`${this.id}_userJson`, () =>
      UserJsonTable.find({
        where: {
          jsonId: this.id,
        },
        relations: ['user'],
      }),
    );
  };
}

class Json {
  create = (json: any, read: JsonUserRole, write: JsonUserRole) => {
    return JsonTable.create({ id: makeid(15), json, read, write })
      .save()
      .then(j => {
        cache.update('json_getCount', p => p + 1);

        return j;
      });
  };

  updatePublicJson = async (jsonId: string, json: any) => {
    const jsonDb = await this.getJsonById(jsonId);
    if (jsonDb) {
      jsonDb.json = json;
      const updatedJson = await jsonDb.save();

      cache.del(`${jsonId}_getById`);

      return updatedJson;
    }

    throw new HTTP404Error('Json Not Found');
  };

  updatePrivateJson = async (jsonId: string, json: any, access: { read: JsonUserRole; write: JsonUserRole }) => {
    const jsonDb = await this.getJsonById(jsonId);
    if (jsonDb) {
      jsonDb.json = json;
      jsonDb.read = access.read;
      jsonDb.write = access.write;
      const updatedJson = await jsonDb.save();

      cache.del(`${jsonId}_getById`);

      return updatedJson;
    }

    throw new HTTP404Error('Json Not Found');
  };

  updatePrivateJsonAccess = async (jsonId: string, read: JsonUserRole, write: JsonUserRole) => {
    const jsonDb = await this.getJsonById(jsonId);
    if (jsonDb) {
      jsonDb.read = read;
      jsonDb.write = write;
      const updatedJson = await jsonDb.save();

      cache.del(`${jsonId}_getById`);

      return updatedJson;
    }

    throw new HTTP404Error('Json Not Found');
  };

  updatePrivateJsonContent = async (jsonId: string, json: any) => {
    const jsonDb = await this.getJsonById(jsonId);
    if (jsonDb) {
      jsonDb.json = json;
      const updatedJson = await jsonDb.save();

      cache.del(`${jsonId}_getById`);

      return updatedJson;
    }

    throw new HTTP404Error('Json Not Found');
  };

  getJsonById = (jsonId: string) => {
    return cache.get(`${jsonId}_getById`, () => JsonTable.findOne({ where: { id: jsonId } }));
  };

  getCount = () =>
    cache.get('json_getCount', () => {
      return JsonTable.getRepository()
        .createQueryBuilder('json')
        .select('id')
        .getCount();
    });
}

export { JsonTable };

export default new Json();
