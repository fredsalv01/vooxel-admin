import { Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Worker } from '../../workers/entities/worker.entity';

@Entity()
export class Client {
  constructor(partial?: Partial<Client>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @Column('text')
  @Expose()
  fullName: string;

  @Column('text')
  @Expose()
  businessName: string; // razon social

  @Column('text')
  @Expose()
  phone: string;

  @Column('text')
  @Expose()
  email: string;

  @Column({
    default: null,
  })
  @Expose()
  contractStartDate: string;

  @Column({
    default: null,
  })
  @Expose()
  contractEndDate: string;

  @OneToMany(() => Worker, (worker) => worker.client, {
    cascade: true,
    eager: true,
  })
  @Expose()
  workers: Worker[];
}
