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
import { Service } from './service.entity';
import { Client } from '../../clients/entities/client.entity'; // Relación con Cliente
import {
  BillingCurrencyType,
  BillingState,
  BillingDocumentType,
} from '../enum';
import { IGV } from '../../common/constants'; // Usando IGV como constante
import { Months } from '../../common/enums';
import 'moment/locale/es';
const moment = require('moment-timezone');

@Entity()
export class Billing {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    type: 'int',
    nullable: true,
    default: null,
  })
  year: number; // Nueva columna para el año

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  month: string; // Nueva columna para el mes

  @Column({
    type: 'enum',
    enum: BillingDocumentType,
    default: BillingDocumentType.BOLETA,
  })
  documentType: BillingDocumentType;

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

  // Nuevos campos según la imagen
  @Column({
    type: 'enum',
    enum: Months,
    nullable: true,
  })
  depositMonth: Months;

  @Column({
    type: 'date',
    nullable: true,
  })
  depositDate: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  depositAmountDollars: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  depositAmountSoles: number;

  @Column({
    type: 'enum',
    enum: BillingState,
    nullable: true,
  })
  state2: BillingState;

  @Column({
    type: 'enum',
    enum: Months,
    nullable: true,
  })
  depositMonth2: Months;

  @Column({
    type: 'date',
    nullable: true,
  })
  depositDate2: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  depositAmountDollars2: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  depositAmountSoles2: number;

  @BeforeInsert()
  calculateBillingDetails() {
    if (this.startDate) {
      const date = moment(this.startDate);
      this.year = date.year();
      this.month = date.format('MMMM'); // Obtiene el mes en formato largo
    }

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
