import { Module } from "@nestjs/common";
import { PAYMENT_REPOSITORY } from "./application/ports/payment.repository.port";
import { DrizzlePaymentRpoistory } from "./infrastructure/adapters/drizzle-payment.adapter";
import { PAYMENT_GATEWAY } from "./application/ports/payment.gateway";
import { StripePaymentAdapter } from "./infrastructure/adapters/stripe-payment.adapter";



@Module({
    providers: [{
        provide: PAYMENT_REPOSITORY,
        useClass: DrizzlePaymentRpoistory
    },
    {
        provide: PAYMENT_GATEWAY,
        useClass: StripePaymentAdapter
    }
]
})
export class  PaymentModule
{
    
}