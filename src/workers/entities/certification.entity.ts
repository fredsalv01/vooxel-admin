import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  @Column()
  name: string;

  @Expose()
  @Column()
  urlFile: string;

  @ManyToOne(() => Worker, (worker) => worker.certifications)
  worker: Worker;
}
