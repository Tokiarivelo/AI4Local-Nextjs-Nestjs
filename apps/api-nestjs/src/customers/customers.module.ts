import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersResolver } from './customers.resolver';
import { Customer } from '../entities/customer.entity';
import { Organization } from '../entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Organization])],
  providers: [CustomersService, CustomersResolver],
})
export class CustomersModule {}

