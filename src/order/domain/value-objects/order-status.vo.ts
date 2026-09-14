import { DomainException } from "../../../shared/domain/exceptions/domain.exception";

export type OrderStatusValue = 
    | 'pending'
    | 'confirmed'
    | 'shipped' 
    | 'delivered'
    | 'canceled';

export class OrderStatus 
{
    private static readonly VALID_TRANSATION: Record<OrderStatusValue,OrderStatusValue[]> = 
    {
        pending: ['canceled','confirmed'],
        confirmed: ['shipped','canceled'],
        shipped: ['delivered'],
        delivered:[],
        canceled:[]
    };

    private constructor(private readonly value: OrderStatusValue )
    {

    }


    static pending(): OrderStatus 
    {
        return new OrderStatus('pending');
    }

    static canceled(): OrderStatus 
    {
        return new OrderStatus('canceled');
    }

    static confirmed(): OrderStatus 
    {
        return new OrderStatus('confirmed');
    }

    static delivered(): OrderStatus 
    {
        return new OrderStatus('delivered');
    }

    static shipped(): OrderStatus 
    {
        return new OrderStatus('shipped');
    }

    static fromString(value:string): OrderStatus
    {
        const valid : OrderStatusValue[] = [
                 'pending'
                , 'confirmed'
                , 'shipped' 
                , 'delivered'
                , 'canceled'
        ]

        if(!valid.includes(value as OrderStatusValue)) throw new DomainException('invalid order status' + value);
        return new OrderStatus(value as OrderStatusValue);
    }
    
    canConfirm(): boolean {
        return this.canTransitionTo('confirmed');
    }
    canCancel(): boolean {
        return this.canTransitionTo('canceled');
    }
    canDeliver(): boolean {
        return this.canTransitionTo('delivered');
    }
    canPending(): boolean {
        return this.canTransitionTo('pending');
    }
    canShip(): boolean {
        return this.canTransitionTo('shipped');
    }

    confirm():OrderStatus
    {
        return this.transationTo('confirmed');
    }
    cancel():OrderStatus
    {
        return this.transationTo('canceled');
    }
    ship():OrderStatus
    {
        return this.transationTo('shipped');
    }
    delive():OrderStatus
    {
        return this.transationTo('delivered');
    }

    getValue()
    {
        return this.value;
    }

    equals(other:OrderStatus)
    {
        return this.value === other.getValue();
    }

    toString()
    {
        return this.value;
    }

    private canTransitionTo(target: OrderStatusValue) : boolean
    {
        return OrderStatus.VALID_TRANSATION[this.value].includes(target);
    }

    private transationTo(target: OrderStatusValue): OrderStatus 
    {
        if(!this.canTransitionTo(target))
            throw new DomainException('cannot transation from'+ this.value+' to '+target);
        return new OrderStatus(target);
    }
}