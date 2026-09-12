import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { RegisterCustomerDto } from "./dto/register-customer.dto";
import { CustomerResponseDto } from "./dto/customer-response.dto";
import { RegisterCustomerCommand } from "../application/use-cases/register-customer/register-customer.command";
import { ListCustomersQuery } from "../application/queries/list-customers.query";
import { Customer } from "../domain/entities/customer.entity";
import { GetCustomerQuery } from "../application/queries/get-customer.query";
import { DeleteCustomerCommand } from "../application/use-cases/delete-customer/delete-customer.command";

@Controller('customer')
export class CustomerController
{
    constructor(private readonly commandBus: CommandBus,private readonly queryBus: QueryBus)
    {
        
    }

    @Post()
    async register(@Body() dto:RegisterCustomerDto ): Promise<void>
    {
        const command = new RegisterCustomerCommand(dto.email,dto.firstName,dto.lastName,dto.phone);
        await this.commandBus.execute<RegisterCustomerCommand,void>(command);
    }
    

    @Get()
    async list() : Promise<CustomerResponseDto[]> 
    {
        const customers = await this.queryBus.execute<ListCustomersQuery,Customer[]>(new ListCustomersQuery());
        return customers.map(CustomerResponseDto.fromDomain);
    } 

    @Get(':id')
    async findOne(
        @Param('id',ParseUUIDPipe) id: string
    ) : Promise<CustomerResponseDto | null>
    {
        const customer = await this.queryBus.execute<GetCustomerQuery,Customer>(new GetCustomerQuery(id));
        return CustomerResponseDto.fromDomain(customer);
    }

    @Delete(':id')
    async deleteOne(
        @Param('id',ParseUUIDPipe) id: string
    ) : Promise<void>
    {
        await this.commandBus.execute<DeleteCustomerCommand>(new DeleteCustomerCommand(id));        
    }

    
}