import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Organization } from './organization.entity';

@ObjectType()
@Entity('campaigns')
export class Campaign {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @Column()
  type: string; // 'sms', 'email', 'social'

  @Field()
  @Column('text')
  content: string;

  @Field(() => [String])
  @Column('simple-array', { nullable: true })
  targetTags: string[];

  @Field()
  @Column({ default: 'draft' })
  status: string; // 'draft', 'scheduled', 'sent', 'cancelled'

  @Field({ nullable: true })
  @Column({ nullable: true })
  scheduledAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  sentAt?: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  organizationId: number;

  @Field(() => Organization)
  @ManyToOne(() => Organization, organization => organization.campaigns)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}

