import { Inject, Injectable } from "@nestjs/common";
import { CustomerPort } from "../../application/ports/customer.port";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../../customers/application/ports/customer.repository";
import { CustomerId } from "../../../customers/domain/value-objects/customer-id.vo";


@Injectable()
export class CustomerAdapter implements CustomerPort
{
    constructor(@Inject(CUSTOMER_REPOSITORY) private readonly customerRepo : CustomerRepositoryPort) 
    {

    }
    async exist(customerId: string): Promise<boolean> {
        const customer = await this.customerRepo.findById(new CustomerId(customerId));
        return customer!==null;
    }
}