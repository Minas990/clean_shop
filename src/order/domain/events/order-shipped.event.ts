
export class OrderShippedEvent {
    constructor(public readonly orderId: string, public readonly customerId: string, public readonly trackingNumber: string) {}
}