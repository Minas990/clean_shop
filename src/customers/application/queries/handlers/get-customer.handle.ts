import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCustomerQuery } from "../get-customer.query";
import { Customer } from "../../../domain/entities/customer.entity";
import { Inject } from "@nestjs/common";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../ports/customer.repository";
import { CustomerId } from "../../../domain/value-objects/customer-id.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery,Customer> 
{

    constructor(@Inject(CUSTOMER_REPOSITORY) private readonly csrepo:CustomerRepositoryPort)
    {}

    async execute(query: GetCustomerQuery): Promise<Customer> 
    {
        const customerId = new CustomerId(query.id);
        const cs = await this.csrepo.findById(customerId);
        if(!cs) throw new ApplicationException(`user with id ${customerId.getValue()} not found` , ApplicationExceptionCode.NOT_FOUND);
        return cs;
    }
}