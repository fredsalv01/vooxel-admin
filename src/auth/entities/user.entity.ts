import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @Column({ unique: true })
  @Expose()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;
}
