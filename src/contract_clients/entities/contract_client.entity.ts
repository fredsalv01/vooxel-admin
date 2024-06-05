import { Expose } from 'class-transformer';
import { Client } from '../../clients/entities/client.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class ContractClient {
  constructor(partial?: Partial<ContractClient>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @Column({
    type: 'date',
  })
  @Expose()
  startDate: Date;

  @Column({
    type: 'date',
  })
  @Expose()
  endDate: Date;

  @Column({
    type: 'bool',
    default: true,
  })
  @Expose()
  isActive: Boolean;

  @ManyToOne(() => Client, (client) => client.contractClients)
  @JoinColumn({ name: 'workerId' })
  client: Client;

  @Column({
    type: 'int',
    nullable: true,
  })
  @Expose()
  clientId: number;
}
