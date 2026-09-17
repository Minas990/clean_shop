import { Money } from "../../../shared/domain/value-objects/money.vo";

export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");

export interface CheckOutUrls {
    successUrl?:string;
    cancelUrl?:string;
}

export interface CreateCheckoutSessionResult 
{
    url:string;
    sessionId:string;
}

export interface ChecckOutLineItem
{
    name:string;
    unitAmount:Money;
    quantity:number;
}

export interface GatewayPort 
{
    createCheckOut(
        lines:ChecckOutLineItem[]
        ,metadata:{
        orderId:string,
        paymentId:string
    },urls:CheckOutUrls): Promise<CreateCheckoutSessionResult> 

    constructWebHookEvent(payload:Buffer,signature:string):any;
}