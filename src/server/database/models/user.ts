import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;
}

export default User;
