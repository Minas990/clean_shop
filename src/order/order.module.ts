import { Module } from "@nestjs/common";
import { ORDER_REPOSITORY } from "./application/ports/orderRepository.port";
import { DrizzleOrderRepo } from "./infrastructure/adapters/drizzle-order.repository";

@Module({
    providers: [
        {
            provide: ORDER_REPOSITORY,
            useClass: DrizzleOrderRepo
        }
    ]
})
export class OrderMoudle
{
    
}