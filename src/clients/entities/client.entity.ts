import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Worker } from '../../workers/entities/worker.entity';
import { WorkerToClient } from 'src/workers/entities/worker-to-client.entity';

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

  @Column({
    type: 'text',
  })
  @Expose()
  ruc: string;

  @Column('text')
  @Expose()
  phone: string;

  @Column('text')
  @Expose()
  email: string;

  @Column({ type: 'date' })
  @Expose()
  contractStartDate: Date;

  @Column({ type: 'date' })
  @Expose()
  contractEndDate: Date;

  @OneToMany(() => WorkerToClient, (workerToClient) => workerToClient.client)
  public workerToClients: WorkerToClient[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @Column('bool', {
    default: true,
  })
  @Expose()
  isActive: boolean;
}
