import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreatePaymentCommand } from "./create-payment.command";
import { Inject } from "@nestjs/common";
import { GatewayPort, PAYMENT_GATEWAY } from "../../ports/payment.gateway";
import { PAYMENT_REPOSITORY, PaymentRepositoryPort } from "../../ports/payment.repository.port";
import { UniqueId } from "../../../../shared/domain/value-objects/unique-Id.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";
import { ORDER_SERVICE, OrderServicePort } from "../../ports/orders.port";
import { Payment } from "../../../domain/entities/payment.entity";

interface CreatePaymentResponse {
    checkOutUrl: string;
    paymentId:string
}

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand,CreatePaymentResponse>
{
    constructor(
        @Inject(PAYMENT_GATEWAY) private readonly paymentGateway: GatewayPort,
        @Inject(PAYMENT_REPOSITORY) private readonly paymentRepository: PaymentRepositoryPort,
        @Inject(ORDER_SERVICE) private readonly orderService: OrderServicePort,
        private readonly eventpublisher: EventPublisher
    ) {}
    async execute(command: CreatePaymentCommand): Promise<CreatePaymentResponse> {
        const orderId = new UniqueId(command.orderId);
        const existing = await this.paymentRepository.findByOrderId(orderId);

        if(existing?.isSucceeded())
            throw new ApplicationException("Payment already succeeded.",ApplicationExceptionCode.CONFLICT);
        
        const orderPricing = await this.orderService.getOrderPricing(command.orderId);

        if(!orderPricing)
            throw new ApplicationException("Order pricing not found.",ApplicationExceptionCode.NOT_FOUND);

        let payment: Payment;

        if(existing)
            payment = this.eventpublisher.mergeObjectContext(existing);
        else   
        payment = this.eventpublisher.mergeObjectContext(
            Payment.initiate(orderId.toString(),orderPricing.total)
        );
        
        const {url} = await this.paymentGateway.createCheckOut(orderPricing.lines,{orderId: command.orderId,paymentId: payment.id.toString()},{
            cancelUrl:command.cancelUrl,
            successUrl: command.succesUrl
        });
         
        payment.startCheckOut();
        await this.paymentRepository.save(payment);

        payment.commit();

        return {
            checkOutUrl: url,
            paymentId: payment.id.toString()
        };
    }
}