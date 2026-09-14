import { AggregateRoot } from "../../../shared/domain/aggregate-root";
import { DomainException } from "../../../shared/domain/exceptions/domain.exception";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { OrderId } from "../value-objects/order-id.vo";
import { OrderStatus } from "../value-objects/order-status.vo";
import { ShippingAddress } from "../value-objects/shipping-address.vo";
import { OrderItem } from "./order-item.entity";

interface OrderProps {
    id:OrderId;
    customerId:string;
    status: OrderStatus;
    items: OrderItem[];
    shippingAddress:ShippingAddress;
    trackingNumber: string |null;
    notes: string|null;
    createdAt:Date;
    updatedAt: Date;
}

export class Order extends AggregateRoot
{
    private readonly _id!:OrderId;
    private readonly _customerId!:string;
    private _status!: OrderStatus;
    private _items!: OrderItem[];
    private readonly _shippingAddress!:ShippingAddress;
    private _trackingNumber!: string |null;
    private _notes!: string|null;
    private readonly _createdAt!:Date;
    private readonly _updatedAt!: Date;

    private constructor(prop:OrderProps)
    {
        super();
        //redo
        Object.keys(prop).forEach((key) => { 
            this[`_${key}`] = prop[key]
        });
    }



    static place
    (
        customerId: string,
        items:OrderItem[],
        shippingAddress:ShippingAddress
    )
    {
        if(items.length===0) throw new DomainException('order must contain at least 1 item');
        const now = new Date();
        const id = new OrderId();

        const order = new Order({
            createdAt:now,
            updatedAt:now,
            customerId,
            shippingAddress,
            items,
            id,
            status: OrderStatus.pending(),
            notes:null,
            trackingNumber:null
        });

        return order;
    }

    static reconstitute(props: OrderProps) : Order
    {
        return new Order(props);
    }


    getTotal() :Money 
    {
        return this.getSubtotal();
    }

    getSubtotal(): Money
    {
        if(this._items.length === 0 )
            return Money.zero();
        return this._items.reduce((sum,item) => 
            sum.add(item.getSubtotal()),
        Money.zero(this._items[0].unitPrice.getCurrency()));
    }

}