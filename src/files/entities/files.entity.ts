import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  constructor(partial?: Partial<Worker>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  table_name: string;

  @Column('int', {
    nullable: true,
  })
  tableId: number;

  @Column('text')
  tag: string; // nombre de la etiqueta de archivo (cv, psychologicalTest, contract)

  @Column('text')
  keyFile: string;
  // nombre del archivo
  @Column('text')
  path: string; // path del archivo en bucket

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
}
