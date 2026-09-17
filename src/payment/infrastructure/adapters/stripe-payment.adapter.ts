import { Injectable } from "@nestjs/common";
import { ChecckOutLineItem, CheckOutUrls, CreateCheckoutSessionResult, GatewayPort } from "../../application/ports/payment.gateway";
import Stripe from 'stripe';
import { ConfigService } from "@nestjs/config";
import { ApplicationException, ApplicationExceptionCode } from "../../../shared/domain/exceptions/application.exception";



@Injectable()
export class StripePaymentAdapter implements GatewayPort
{
    private readonly stripe: Stripe;
    constructor(
        private readonly cs: ConfigService
    ) {
        this.stripe = new Stripe(cs.getOrThrow('STRIPE_SECRET_KEY'));
    }

    async createCheckOut(lines:ChecckOutLineItem[], metadata: { orderId: string; paymentId: string; }, urls: CheckOutUrls): Promise<CreateCheckoutSessionResult> {
        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lines.map(line => ({
                quantity: line.quantity,
                price_data: {
                    currency: line.unitAmount.getCurrency().toLocaleLowerCase(),
                    unit_amount: line.unitAmount.toCents(),
                    product_data: {
                        name: line.name,
                    }
                }
            })),
            success_url: urls.successUrl,
            cancel_url: urls.cancelUrl,
            metadata
        });  
        if(!session.url || !session.id)
            throw new ApplicationException(`Failed to create checkout session with Stripe`, ApplicationExceptionCode.INTERNAL_SERVER_ERROR);
        return {
            sessionId: session.id,
            url: session.url
        }
    }

    constructWebHookEvent(payload: Buffer, signature: string): Stripe.Event {
        return this.stripe.webhooks.constructEvent(payload, signature, this.cs.getOrThrow('STRIPE_WEBHOOK_SECRET'));
    }

}