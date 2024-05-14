import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Worker } from './worker.entity';

@Entity()
export class WorkerToClient {
  @PrimaryGeneratedColumn('increment')
  workerToClientId: number;

  @Column()
  clientId: number;

  @Column()
  workerId: number;

  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

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

  @ManyToOne(() => Client, (client) => client.workerToClients)
  client: Client;

  @ManyToOne(() => Worker, (worker) => worker.workerToClients)
  worker: Worker;
}
