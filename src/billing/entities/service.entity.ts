import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Billing } from './billing.entity';

@Entity()
export class Service {
  constructor(partial?: Partial<Service>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('identity')
  @Expose()
  id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  @Expose()
  name: string;

  @OneToMany(() => Billing, (billing) => billing.service)
  billings: Billing[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
