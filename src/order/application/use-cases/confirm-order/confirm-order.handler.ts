import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ConfirmedOrderCommand } from "./confirm-order.command";
import { ORDER_REPOSITORY, OrderRepositoryPort } from "../../ports/orderRepository.port";
import { Inject } from "@nestjs/common";
import { OrderId } from "../../../domain/value-objects/order-id.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";

@CommandHandler(ConfirmedOrderCommand)
export class ConfirmOrderHandler implements ICommandHandler<ConfirmedOrderCommand>
{
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: OrderRepositoryPort,
        private readonly eventPublisher: EventPublisher
    ) {}

    async execute(command: ConfirmedOrderCommand): Promise<void> {
        const order = await this.orderRepository.findById(new OrderId(command.orderId));
        if (!order) {
            throw new ApplicationException("Order not found with id: " + command.orderId,ApplicationExceptionCode.NOT_FOUND);
        }
        const trakOrder = this.eventPublisher.mergeObjectContext(order);
        trakOrder.confirm();
        await this.orderRepository.save(trakOrder);
        trakOrder.commit();
    }
}