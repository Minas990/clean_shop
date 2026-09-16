import { AggregateRoot } from "../../../shared/domain/aggregate-root";
import { DomainException } from "../../../shared/domain/exceptions/domain.exception";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { OrderConfirmedEvent } from "../events/Order-Confirmed.Event";
import { OrderDeliveredEvent } from "../events/order-delivered.event";
import { OrderPlacedEvent } from "../events/order-placed.event";
import { OrderShippedEvent } from "../events/order-shipped.event";
import { OrderCanceledEvent } from "../events/order.canceled.event";
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
    private  _updatedAt!: Date;

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

        order.apply(new OrderPlacedEvent(order.id.getValue(),order.customerId));
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

    getItemsCount()//the entire quantity not the length
    {
        return this._items.reduce((count, item) => count + item.quantity, 0);
    }

    getSubtotal(): Money
    {
        if(this._items.length === 0 )
            return Money.zero();
        return this._items.reduce((sum,item) => 
            sum.add(item.getSubtotal()),
        Money.zero(this._items[0].unitPrice.getCurrency()));
    }

    get id() {return this._id}
    get customerId() :string {return this._customerId}
    get status() : OrderStatus {return this._status}
    get items() : OrderItem[] { return this._items}
    get shippingAddress():ShippingAddress {return this._shippingAddress}
    get trackingNumber(): string |null { return this._trackingNumber}
    get notes(): string|null {return this._notes}
    get createdAt():Date {return this._createdAt}
    get updatedAt(): Date { return this._updatedAt}

    confirm()
    {
        this._status = this._status.confirm();
        this._updatedAt = new Date();
        this.apply(new OrderConfirmedEvent(this.id.getValue(),this.customerId,{
            city: this._shippingAddress.city,
            country: this._shippingAddress.country,
            state: this._shippingAddress.state,
            street: this._shippingAddress.street,
            zipcode: this._shippingAddress.zipcode
        }));
    }

    ship(trackingNumber:string)
    {
        if(!trackingNumber || trackingNumber.trim().length === 0)
        {
            throw new DomainException("Tracking number is required");
        }
        this._trackingNumber = trackingNumber;
        this._updatedAt = new Date();
        this._status = this._status.ship();
        this.apply(new OrderShippedEvent(this.id.getValue(),this.customerId,trackingNumber));
    }

    deliver() 
    {
        this._status = this._status.deliver();
        this._updatedAt = new Date();
        this.apply(new OrderDeliveredEvent(this.id.getValue(),this.customerId));
    }

    cancel(reason:string)
    {
        if(!reason || reason.trim().length === 0)
        {
            throw new DomainException("Reason is required");
        }
        this._status = this._status.cancel();
        this._updatedAt = new Date();
        this.apply(new OrderCanceledEvent(this.id.getValue(),this.customerId,reason));
    }
}