import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class Contact {
  constructor(partial?: Partial<Contact>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  phone: string;

  @Expose()
  @Column()
  designed_area: string;

  @ManyToOne(() => Client, (client) => client.contacts)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ type: 'int', nullable: true })
  clientId: number;
}
