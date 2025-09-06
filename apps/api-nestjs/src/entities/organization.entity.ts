import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { Customer } from './customer.entity';
import { Campaign } from './campaign.entity';

@ObjectType()
@Entity('organizations')
export class Organization {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

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
  ownerId: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.organizations)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Field(() => [Customer])
  @OneToMany(() => Customer, customer => customer.organization)
  customers: Customer[];

  @Field(() => [Campaign])
  @OneToMany(() => Campaign, campaign => campaign.organization)
  campaigns: Campaign[];
}

