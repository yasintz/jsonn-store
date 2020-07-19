import {
  BaseEntity as TypeormBaseEntity,
  PrimaryColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SerializedModelType } from '../helpers';

export type SerializedBaseEntityFields = 'id' | 'createdAt' | 'updatedAt';

export const COMMON_SERIALIZED_FIELDS: SerializedBaseEntityFields[] = ['createdAt', 'id', 'updatedAt'];

export abstract class ModelsBaseEntitiy<SerializedFields extends keyof Model, Model> extends TypeormBaseEntity {
  @PrimaryColumn()
  id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date | null;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  public deletedAt!: Date | null;

  abstract serialize(): SerializedModelType<SerializedFields, Model>;

  remove = () => this.softRemove();

  completelyRemove = () => {
    return super.remove();
  };
}
