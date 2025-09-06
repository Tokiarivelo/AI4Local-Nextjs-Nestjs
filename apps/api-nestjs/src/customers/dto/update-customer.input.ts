import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateCustomerInput } from './create-customer.input';

@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  @Field({ nullable: true })
  status?: string;
}

