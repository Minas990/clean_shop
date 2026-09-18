import { Money } from "../../../shared/domain/value-objects/money.vo";

export const ORDER_SERVICE  = Symbol("ORDER_SERVICE");

export interface PricingLine
{
    name:string;
    unitAmount:Money;
    quantity:number;
}

export interface OrderPricing{
    total:Money,
    lines: PricingLine[];
}

export interface OrderServicePort
{
    getOrderPricing(orderId: string): Promise<OrderPricing | null>;
}