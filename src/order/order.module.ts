import { Module } from "@nestjs/common";
import { ORDER_REPOSITORY } from "./application/ports/orderRepository.port";
import { DrizzleOrderRepo } from "./infrastructure/adapters/drizzle-order.repository";
import { OrderController } from "./presentation/order.controller";
import { CommandHandlers } from "./application/use-cases";
import { CUSTOMER } from "./application/ports/customer.port";
import { CustomerAdapter } from "./infrastructure/adapters/customer.adapter";
import { PRODUCT } from "./application/ports/product.port";
import { ProductAdapter } from "./infrastructure/adapters/product.adapter";
import { CustomerModule } from "../customers/customer.module";
import { ProductModule } from "../product/product.module";
import { QueryHandlers } from "./application/query/handlers";
import { EventHadnlers } from "./application/events";

@Module({
    imports:[CustomerModule,ProductModule],
    controllers:[OrderController],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        ...EventHadnlers,
        {
            provide: ORDER_REPOSITORY,
            useClass: DrizzleOrderRepo
        },
        {
            provide:CUSTOMER,
            useClass: CustomerAdapter,   
        },
        {
            provide:PRODUCT,
            useClass: ProductAdapter
        }
    ],
    exports:[ORDER_REPOSITORY]
})
export class OrderMoudle
{
    
}