import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import moment from 'moment-timezone';
import { Service } from './service.entity';
import { Client } from '../../clients/entities/client.entity'; // Relación con Cliente
import { BillingCurrencyType, BillingState, BillingDocumentType } from '../enum';
import { IGV } from '../../common/constants'; // Usando IGV como constante

@Entity()
export class Billing {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    type: 'enum',
    enum: BillingDocumentType,
    default: BillingDocumentType.BOLETA,
  })
  billingDocumentType: BillingDocumentType;

  @Column({
    type: 'text',
    nullable: false,
  })
  documentNumber: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  paymentDeadline: number;

  @ManyToOne(() => Service, (service) => service.billings, {
    onDelete: 'CASCADE',
    eager: true, // Relación con la tabla de servicios
  })
  service: Service;

  @ManyToOne(() => Client, (client) => client.billings, {
    onDelete: 'CASCADE',
    eager: true, // Relación con la tabla de clientes
  })
  client: Client;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string; // Descripción de la factura

  @Column({
    type: 'text',
    nullable: true,
  })
  purchaseOrderNumber: string; // Número de orden de compra

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
  amount: number; // Monto en la moneda indicada

  @Column({
    type: 'bool',
    default: false,
  })
  hasIGV: boolean;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  igv: number; // IGV calculado

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  total: number; // Total calculado

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
  expirationDate: Date;

  @Column('int', { nullable: false, default: 0 })
  accumulatedDays: number; // Días acumulados

  @Column('text', { nullable: true })
  hes: string; // Campo opcional para HES

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  currencyConversionAmount: number; // Monto convertido a la otra moneda

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  igvConversionAmount: number; // IGV en la moneda convertida

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  totalConversionAmount: number; // Total en la moneda convertida

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 3,
    nullable: false,
    default: 3.5, // Tipo de cambio por defecto
  })
  conversionRate: number; // Tipo de cambio actual

  @BeforeInsert()
  @BeforeUpdate()
  calculateBillingDetails() {
    if (this.startDate && this.paymentDeadline) {
      this.expirationDate = moment(this.startDate)
        .add(this.paymentDeadline, 'days')
        .toDate();
    }

    // Calcula los días acumulados (mora) solo si el estado es pendiente
    if (this.billingState === BillingState.PENDIENTE) {
      const today = moment().startOf('day');
      const start = moment(this.startDate).startOf('day');
      const daysElapsed = today.diff(start, 'days');
      this.accumulatedDays = daysElapsed > 0 ? daysElapsed : 0;
    } else {
      this.accumulatedDays = 0;
    }

    // Calcula el total sumando IGV si es necesario
    const igvRate = IGV; // Tasa de IGV (0.18)
    if (this.hasIGV) {
      this.igv = this.amount * igvRate;
      this.total = this.amount + this.igv;
    } else {
      this.igv = 0;
      this.total = this.amount;
    }

    // Realiza la conversión de moneda si es necesario
    if (this.currency === BillingCurrencyType.SOLES) {
      // Convertir a dólares
      this.currencyConversionAmount = this.amount / this.conversionRate;
      this.igvConversionAmount = this.igv / this.conversionRate;
      this.totalConversionAmount = this.total / this.conversionRate;
    } else if (this.currency === BillingCurrencyType.DOLARES) {
      // Convertir a soles
      this.currencyConversionAmount = this.amount * this.conversionRate;
      this.igvConversionAmount = this.igv * this.conversionRate;
      this.totalConversionAmount = this.total * this.conversionRate;
    }
  }
}
