import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ORDER_REPOSITORY, OrderRepositoryPort } from "../../ports/orderRepository.port";
import { Inject } from "@nestjs/common";
import { OrderId } from "../../../domain/value-objects/order-id.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";
import { CancelOrderCommand } from "./cancel-order.command";

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand>
{
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: OrderRepositoryPort,
        private readonly eventPublisher: EventPublisher
    ) {}

    async execute(command: CancelOrderCommand): Promise<void> {
        const order = await this.orderRepository.findById(new OrderId(command.orderId));
        if (!order) {
            throw new ApplicationException("Order not found with id: " + command.orderId,ApplicationExceptionCode.NOT_FOUND);
        }
        const trakOrder = this.eventPublisher.mergeObjectContext(order);
        trakOrder.cancel(command.reason);
        await this.orderRepository.save(trakOrder);
        trakOrder.commit();
    }
}