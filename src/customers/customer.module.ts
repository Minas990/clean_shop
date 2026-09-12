import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { DrizzleCustomerRepository } from "./infrastructure/adapters/drizzle-product.repository";
import { CUSTOMER_REPOSITORY } from "./application/ports/customer.repository";
import { commandHandlers } from "./application/use-cases";
import { CustomerController } from "./presentation/customer.controller";
import { queryHandlers } from "./application/queries/handlers";

@Module({
    imports:[CqrsModule],
    controllers:[CustomerController],
    providers:[
        ...commandHandlers,
        ...queryHandlers,
        {
            provide: CUSTOMER_REPOSITORY,
            useClass: DrizzleCustomerRepository
        }
    ]
})

export class CustomerModule {

}