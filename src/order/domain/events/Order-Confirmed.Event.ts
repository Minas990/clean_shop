export interface OrderConfirmedShippingAddress
{
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
}

export class OrderConfirmedEvent
{
    constructor(
        public readonly orderId: string,
        public readonly customerId: string,
        public readonly shippingAddress: OrderConfirmedShippingAddress
    ) {}
}