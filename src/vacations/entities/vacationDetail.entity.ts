import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vacation } from './vacation.entity';
import { VacationDetailType } from '../enum/vacationDetailType';

@Entity('vacation_details')
export class VacationDetail {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(() => Vacation, (vacation) => vacation.vacationDetails)
  @JoinColumn({ name: 'vacationId' })
  vacation: Vacation;

  @Column('int', { nullable: false })
  vacationId: number;

  @Column({
    enum: VacationDetailType,
    default: VacationDetailType.PENDIENTES
  })
  vacationType: VacationDetailType;

  @Column({
    type: 'text',
    default: null,
    nullable: true,
  })
  reason: string;

  @Column({
    type: 'date',
    default: null,
    nullable: true,
  })
  startDate: Date;

  @Column({
    type: 'date',
    default: null,
    nullable: true,
  })
  endDate: Date;

  @Column({
    type: 'int',
    default: 1,
  })
  quantity: number;

  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
