import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Organization } from '../entities/organization.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      relations: ['organization'],
    });
  }

  async findByOrganization(organizationId: number): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { organizationId },
      relations: ['organization'],
    });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['organization'],
    });

    if (!customer) {
      throw new NotFoundException(`Client avec l'ID ${id} non trouvé`);
    }

    return customer;
  }

  async create(createCustomerInput: CreateCustomerInput): Promise<Customer> {
    const { organizationId, ...customerData } = createCustomerInput;

    // Vérifier que l'organisation existe
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException(`Organisation avec l'ID ${organizationId} non trouvée`);
    }

    const customer = this.customerRepository.create({
      ...customerData,
      organizationId,
    });

    return this.customerRepository.save(customer);
  }

  async update(id: number, updateCustomerInput: UpdateCustomerInput): Promise<Customer> {
    const customer = await this.findOne(id);

    Object.assign(customer, updateCustomerInput);

    return this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<boolean> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
    return true;
  }
}

