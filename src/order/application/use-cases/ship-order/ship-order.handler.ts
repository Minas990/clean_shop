import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ShipOrderCommand } from "./ship-order.command";
import { ORDER_REPOSITORY, OrderRepositoryPort } from "../../ports/orderRepository.port";
import { Inject } from "@nestjs/common";
import { OrderId } from "../../../domain/value-objects/order-id.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";


@CommandHandler(ShipOrderCommand)
export class ShipOrderHandler implements ICommandHandler<ShipOrderCommand,void>
{
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: OrderRepositoryPort,
        private readonly eventPublisher: EventPublisher
    ) {}

    async execute(command: ShipOrderCommand): Promise<void> {
        const order = await this.orderRepository.findById(new OrderId   (command.orderId));
        if(!order) throw new ApplicationException("Order not found with id: " + command.orderId,ApplicationExceptionCode.NOT_FOUND);
        const trakOrder = this.eventPublisher.mergeObjectContext(order);
        trakOrder.ship(command.trackingNumber);
        await this.orderRepository.save(trakOrder);
        trakOrder.commit();
    }
}