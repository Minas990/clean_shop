import { Inject, Injectable } from "@nestjs/common";
import { UniqueId } from "../../../shared/domain/value-objects/unique-Id.vo";
import { PaymentRepositoryPort } from "../../application/ports/payment.repository.port";
import { Payment } from "../../domain/entities/payment.entity";
import { DRIZZLE, DrizzleDB } from "../../../shared/infrastructure/database/postgres/drizzle.provider";
import { payments } from "../../../shared/infrastructure/database/postgres/schema";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { PaymentStatus } from "../../domain/value-objects/payment-status.vo";
import { eq } from "drizzle-orm";


@Injectable()
export class DrizzlePaymentRpoistory implements PaymentRepositoryPort
{
    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleDB
    ) {}

    async save(payment: Payment): Promise<void> {
        const row = DrizzlePaymentRpoistory.toPersistence(payment);
         await this.db.insert(payments).values(row).onConflictDoUpdate({
            target: payments.id,
            set: {
                amount: row.amount,
                currency: row.currency,
                gatewayTransactionId: row.gatewayTransactionId,
                status: row.status,
                updatedAt: row.updatedAt,
            }
        });
        
    }

    async findByOrderId(orderId: UniqueId): Promise<Payment | null> {
        const payment = await this.db.query.payments.findFirst({
            where:eq(payments.orderId,orderId.getValue())
        });

        if(!payment) return null;
        return DrizzlePaymentRpoistory.toDomain(payment[0]);        
    }

    static toPersistence(payment: Payment) : typeof payments.$inferSelect
    {
        return {
            amount: payment.amount.getAmount() ,
            createdAt: payment.createdAt,
            currency: payment.amount.getCurrency(),
            gatewayTransactionId: payment.gatewatTransactionId,
            id: payment.id.getValue(), 
            orderId: payment.orderId,
            status: payment.status.getValue(),
            updatedAt: payment.updatedAt
        }
    }

    static toDomain(payment: typeof payments.$inferSelect): Payment
    {
        return Payment.reconstitute({
            amount:  Money.create(payment.amount,payment.currency),
            createdAt: payment.createdAt,
            gatewatTransactionId: payment.gatewayTransactionId,
            id: new UniqueId(payment.id),
            orderId: payment.orderId,
            status: PaymentStatus.fromString(payment.status),
            updatedAt: payment.updatedAt
        })
    }

}