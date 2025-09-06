import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Organization } from './organization.entity';

@ObjectType()
@Entity('customers')
export class Customer {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field(() => [String])
  @Column('simple-array', { nullable: true })
  tags: string[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  notes?: string;

  @Field()
  @Column({ default: 'active' })
  status: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  organizationId: number;

  @Field(() => Organization)
  @ManyToOne(() => Organization, organization => organization.customers)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}

