import { Module } from "@nestjs/common";
import { PAYMENT_REPOSITORY } from "./application/ports/payment.repository.port";
import { DrizzlePaymentRpoistory } from "./infrastructure/adapters/drizzle-payment.adapter";
import { PAYMENT_GATEWAY } from "./application/ports/payment.gateway";
import { StripePaymentAdapter } from "./infrastructure/adapters/stripe-payment.adapter";
import { ORDER_SERVICE } from "./application/ports/orders.port";
import { OrderServiceAdapter } from "./infrastructure/adapters/order-adapter";
import { OrderMoudle } from "../order/order.module";
import { PaymentController } from "./presentation/payment.controller";
import { CommandHandler } from "./application/use-cases";



@Module({
    imports:[OrderMoudle],
    providers: [{
        provide: PAYMENT_REPOSITORY,
        useClass: DrizzlePaymentRpoistory
    },
    {
        provide: PAYMENT_GATEWAY,
        useClass: StripePaymentAdapter
    },
    {
        provide: ORDER_SERVICE,
        useClass: OrderServiceAdapter
    },
    ...CommandHandler
],
controllers:[PaymentController]
})
export class  PaymentModule
{
    
}