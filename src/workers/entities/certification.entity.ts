import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Worker } from './worker.entity';

@Entity()
export class Certification {
  constructor(partial?: Partial<Certification>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @Expose()
  @Column('text')
  certificationName: string; // nombre de la certificacion.

  @Column('text')
  @Expose()
  keyFile: string; // nombre del archivo

  @Column('text')
  @Expose()
  path: string; // path del archivo en el bucket

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => Worker, (worker) => worker.certifications)
  @JoinColumn({ name: 'workerId' })
  worker: Worker;

  @Column({ type: 'int', nullable: true })
  workerId: number;
}
