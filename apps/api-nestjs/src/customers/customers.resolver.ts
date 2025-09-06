import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomersService } from './customers.service';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Resolver(() => Customer)
@UseGuards(JwtAuthGuard)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Query(() => [Customer], { name: 'customers' })
  findAll() {
    return this.customersService.findAll();
  }

  @Query(() => [Customer], { name: 'customersByOrganization' })
  findByOrganization(@Args('organizationId', { type: () => Int }) organizationId: number) {
    return this.customersService.findByOrganization(organizationId);
  }

  @Query(() => Customer, { name: 'customer' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.customersService.findOne(id);
  }

  @Mutation(() => Customer)
  createCustomer(@Args('input') createCustomerInput: CreateCustomerInput) {
    return this.customersService.create(createCustomerInput);
  }

  @Mutation(() => Customer)
  updateCustomer(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateCustomerInput: UpdateCustomerInput,
  ) {
    return this.customersService.update(id, updateCustomerInput);
  }

  @Mutation(() => Boolean)
  removeCustomer(@Args('id', { type: () => Int }) id: number) {
    return this.customersService.remove(id);
  }
}

