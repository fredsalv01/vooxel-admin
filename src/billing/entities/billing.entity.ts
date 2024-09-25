import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  // OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillingDocumentType } from '../enum/DocumentType';
import { BillingCurrencyType } from '../enum/CurrencyType';
import { BillingState } from '../enum/BillingState';
// import { BillingServiceType } from '../enum/ServiceType';
import { IGV } from '../../common/constants';
import { Months } from '../../common/enums';
import { Service } from './service.entity';
import { Client } from "../../clients/entities/client.entity";

@Entity()
export class Billing {
  constructor(partial?: Partial<Billing>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('identity')
  @Expose()
  id: number;

  @Column({
    type: 'text',
    default: null,
  })
  clientName: string;

  @Column({
    type: 'enum',
    enum: BillingDocumentType,
    default: BillingDocumentType.BOLETA,
  })
  documentType: BillingDocumentType;

  @Column({
    type: 'text',
    default: null,
  })
  documentNumber: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  @Expose()
  startDate: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  @Expose()
  paymentDeadline: Date;

  @ManyToOne(() => Service, (service) => service.billings, {
    onDelete: 'CASCADE',
    eager: true
  })
  service: Service;

  @ManyToOne(() => Client, (client) => client.billings, {
    onDelete: 'CASCADE',
    eager: true
  })
  client: Client;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  purchaseOrderNumber: string;

  @Column({
    type: 'enum',
    enum: BillingCurrencyType,
    default: BillingCurrencyType.SOLES,
  })
  currency: BillingCurrencyType;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  currencyValue: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  amount: number;

  @Column({
    type: 'bool',
    default: false,
  })
  hasIGV: boolean;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    default: IGV,
  })
  igv: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  total: number;

  @Column({
    type: 'enum',
    enum: BillingState,
    default: BillingState.PENDIENTE,
  })
  billingState: BillingState;

  @Column({
    type: 'date',
    nullable: true,
  })
  billingStateDate: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  @Expose()
  expirationDate: Date;

  @Column('int', { nullable: false, default: 0 })
  accumulatedDays: number;

  @Column('bool', { default: false })
  hashes: boolean;

  @Column('text', { nullable: true })
  hes: string;

  // estas son propiedades calculadas que bien pueden ser 0 o nulas porque son calculadas por dentro

  @Column('int', { nullable: true, default: 0 })
  currencyConversionAmount: number; // este seria el monto neto USD2 segun el excel

  @Column('int', { nullable: true, default: 0 })
  igvConversionDollars: number; // esta es la taza de igv cuando es dolares (seria currency_conversion_amount * 0.18)

  @Column('int', { nullable: true, default: 0 })
  totalAmountDollars: number; //esto seria el igvConversionDollars + currency_conversion_amount

  @Column({
    type: 'enum',
    enum: Months,
    nullable: true,
  })
  paymentMonth: Months;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
