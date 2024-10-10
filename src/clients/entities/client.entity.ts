import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkerToClient } from 'src/workers/entities/worker-to-client.entity';
import { ContractClient } from '../../contract_clients/entities/contract_client.entity';
import { Contact } from './contact.entity';
import { Billing } from "../../billing/entities/billing.entity";

@Entity()
export class Client {
  constructor(partial?: Partial<Client>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @Column('text')
  @Expose()
  businessName: string; // razon social

  @Column({
    type: 'text',
  })
  @Expose()
  ruc: string;

  @Column('text')
  @Expose()
  phone: string;

  @Column('text')
  @Expose()
  address: string;

  @OneToMany(() => WorkerToClient, (workerToClient) => workerToClient.client)
  public workerToClients: WorkerToClient[];

  @OneToMany(() => ContractClient, (contractClient) => contractClient.client)
  contractClients: ContractClient[];

  @OneToMany(() => Billing, (billing) => billing.client)
  billings: Billing[];

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

  @Column('bool', {
    default: true,
  })
  @Expose()
  isActive: boolean;

  @OneToMany(() => Contact, (contact) => contact.client, {
    cascade: true,
    eager: true,
  })
  @Expose()
  contacts: Contact[];
}
