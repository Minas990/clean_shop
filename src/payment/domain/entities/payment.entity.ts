import { AggregateRoot } from "../../../shared/domain/aggregate-root";
import { DomainException } from "../../../shared/domain/exceptions/domain.exception";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { PaymentId } from "../value-objects/payment-id.vo";
import { PaymentStatus } from "../value-objects/payment-status.vo";

export interface PaymentProps
{
    id: PaymentId;
    orderId: string;
    amount: Money;
    status:PaymentStatus;
    gatewatTransactionId: string  | null;
    createdAt: Date;
    updatedAt: Date;
}

export class Payment extends AggregateRoot
{
    private _id: PaymentId;
    private _orderId: string;
    private _amount: Money
    private _status: PaymentStatus;
    private _gatewatTransactionId: string | null
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: PaymentProps)
    {
        super();
        this._id = props.id;
        this._orderId = props.orderId;
        this._amount = props.amount;
        this._status = props.status;
        this._gatewatTransactionId = props.gatewatTransactionId;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    public static initiate(orderId: string, amount: Money): Payment
    {
        if(amount.getAmount() <= 0 )
             throw new DomainException("Payment amount must be greater than zero.");
        
        const now = new Date();
        return new Payment({
            id: new PaymentId(),
            orderId: orderId,
            amount: amount,
            status: PaymentStatus.pending(),
            gatewatTransactionId: null,
            createdAt: now,
            updatedAt: now
        });
    } 

    static reconstitute(props: PaymentProps): Payment
    {
        return new Payment(props);
    }

    isSucceeded()
    {
        return this._status.isSucceeded();
    }
    

    startCheckOut()
    {
        if(this.isSucceeded())
            throw new DomainException("Cannot start check out for a succeeded payment.");
        this._status = PaymentStatus.Processing();
        this._updatedAt = new Date();
    }

    public get id(): PaymentId
    {
        return this._id;
    }

    public get orderId(): string
    {
        return this._orderId;
    }

    public get amount(): Money
    {
        return this._amount;
    }

    public get status(): PaymentStatus
    {
        return this._status;
    }

    public get gatewatTransactionId(): string | null
    {
        return this._gatewatTransactionId;
    }

    public get createdAt(): Date
    {
        return this._createdAt;
    }

    public get updatedAt(): Date
    {
        return this._updatedAt;
    }
}