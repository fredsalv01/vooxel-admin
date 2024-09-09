import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BillingDocumentType } from "../enum/DocumentType";
import { BillingCurrencyType } from "../enum/CurrencyType";
import { BillingState } from "../enum/BillingState";
import { BillingServiceType } from "../enum/ServiceType";

@Entity()
export class Billing {
  constructor(partial?: Partial<Billing>){
    Object.assign(this, partial)
  }

  @PrimaryGeneratedColumn('identity')
  @Expose()
  id: number;

  @Column({
    type: 'text',
    default: null
  })
  clientName: string;

  @Column({
    type:"enum",
    enum: BillingDocumentType,
    default: BillingDocumentType.BOLETA
  })
  documentType: BillingDocumentType

  @Column({
    type: 'text',
    default: null
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

  @Column({
    type:"enum",
    enum: BillingServiceType,
    default: BillingServiceType.OTROS
  })
  serviceType: BillingServiceType

  @Column({
    type: 'text',
    default: null
  })
  description: string;

  @Column({
    type: 'text',
    default: null
  })
  purchaseOrderNumber: string;

  @Column({
    type:"enum",
    enum: BillingCurrencyType,
    default: BillingCurrencyType.SOLES
  })
  currency: BillingCurrencyType

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0.00
  })
  amount: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0.00
  })
  igv: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0.00
  })
  total: number;

  @Column({
    type:"enum",
    enum: BillingState,
    default: BillingState.PENDIENTE
  })
  billingState: BillingState

  @Column({
    type: 'date',
    nullable: true,
  })
  @Expose()
  expirationDate: Date;

  @Column('int', { nullable: false, default: 0 })
  accumulatedDays: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
