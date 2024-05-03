import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @Column('bool', {
    default: true,
  })
  @Expose()
  isActive: boolean;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
