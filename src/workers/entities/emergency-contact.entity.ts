import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Worker } from './worker.entity';

@Entity()
export class EmergencyContact {
  constructor(partial?: Partial<EmergencyContact>) {
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
  relation: string;

  @ManyToOne(() => Worker, (worker) => worker.emergencyContacts)
  @JoinColumn({ name: 'workerId' })
  worker: Worker;

  @Column({ type: 'int', nullable: true })
  workerId: number;
}
