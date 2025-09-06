import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class GenerateContentInput {
  @Field()
  @IsString()
  prompt: string;

  @Field()
  @IsString()
  type: string; // 'sms', 'email', 'social', 'ad'
}

