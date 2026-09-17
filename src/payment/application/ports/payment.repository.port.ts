import { UniqueId } from "../../../shared/domain/value-objects/unique-Id.vo";
import { Payment } from "../../domain/entities/payment.entity";

export const PAYMENT_REPOSITORY = Symbol("PaymentRepository");

export interface PaymentRepositoryPort
{
    save(payment: Payment): Promise<void>;
    findByOrderId(orderId: UniqueId): Promise<Payment | null>;    
}