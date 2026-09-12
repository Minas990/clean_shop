import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ListCustomersQuery } from "../list-customers.query";
import { Inject } from "@nestjs/common";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../ports/customer.repository";
import { Customer } from "../../../domain/entities/customer.entity";


@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<ListCustomersQuery,Customer[]>
{
    constructor(@Inject(CUSTOMER_REPOSITORY) private readonly csrepo:CustomerRepositoryPort)
    {

    }

    async execute(query: ListCustomersQuery): Promise<Customer[]> {
        const cs = await this.csrepo.findAll();
        return cs;
    }


}