import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ShipOrderCommand } from "../ship-order/ship-order.command";
import { Inject } from "@nestjs/common";
import { ORDER_REPOSITORY, OrderRepositoryPort } from "../../ports/orderRepository.port";
import { OrderId } from "../../../domain/value-objects/order-id.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";
import { DeliverOrderCommand } from "./deliver.command";


@CommandHandler(DeliverOrderCommand)
export class DeliverOrderHandler implements ICommandHandler<DeliverOrderCommand>
{
    constructor(@Inject(ORDER_REPOSITORY) private readonly orderRepo: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisher) {}
    
    
    async execute(command: DeliverOrderCommand): Promise<void> {
            const order = await this.orderRepo.findById(new OrderId(command.orderId));
            if (!order) {
                throw new ApplicationException(`Order with id ${command.orderId} not found`,ApplicationExceptionCode.NOT_FOUND);
            }    
            const trackOrder = this.eventPublisher.mergeObjectContext(order);
            trackOrder.deliver();
            await this.orderRepo.save(trackOrder);
            trackOrder.commit();
    }
}