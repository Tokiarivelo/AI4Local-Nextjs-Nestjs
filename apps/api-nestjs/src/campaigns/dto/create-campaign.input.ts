import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray, IsInt, IsDateString } from 'class-validator';

@InputType()
export class CreateCampaignInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsString()
  type: string; // 'sms', 'email', 'social'

  @Field()
  @IsString()
  content: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetTags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @Field(() => Int)
  @IsInt()
  organizationId: number;
}

