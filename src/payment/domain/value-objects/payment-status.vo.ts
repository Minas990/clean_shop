import { DomainException } from "../../../shared/domain/exceptions/domain.exception";

export enum PaymentStatusValue
{
    PENDING = "PENDING",
    SUCCEEDED = "SUCCEEDED",
    PROCESSING = "PROCESSING"
}

export class PaymentStatus
{
    private readonly value: PaymentStatusValue;
    
    private constructor(value: PaymentStatusValue) {
        this.value = value;
    }

    static pending(): PaymentStatus {
        return new PaymentStatus(PaymentStatusValue.PENDING);
    }

    static Processing(): PaymentStatus {
        return new PaymentStatus(PaymentStatusValue.PROCESSING);
    }

    static succeeded(): PaymentStatus {
        return new PaymentStatus(PaymentStatusValue.SUCCEEDED);
    }

    static fromString(value: string): PaymentStatus 
    {
        switch (value) {
            case PaymentStatusValue.PENDING:
                return PaymentStatus.pending();
            case PaymentStatusValue.PROCESSING:
                return PaymentStatus.Processing();
            case PaymentStatusValue.SUCCEEDED:
                return PaymentStatus.succeeded();
            default:
                throw new DomainException(`Invalid payment status value: ${value}`);
        }
    }

    getValue(): PaymentStatusValue {
        return this.value;
    }
    
}