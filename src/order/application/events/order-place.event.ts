import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { OrderPlacedEvent } from "../../domain/events/order-placed.event";
import { Inject } from "@nestjs/common";
import { NOTIFICATION_SERVICE, NotificationPort } from "../../../customers/application/ports/notifications.port";


@EventsHandler(OrderPlacedEvent)
export class OrderPlacetHandler implements IEventHandler<OrderPlacedEvent>
{
    constructor(@Inject(NOTIFICATION_SERVICE) private readonly nts: NotificationPort,

        ) {}
    async handle(event: OrderPlacedEvent) {
        await this.nts.sendNotification({
            recipientId: event.customerId,
            subject:'confirmed order',
            message: `ur clean shop order ${event.orderId} has been confirmed`
        });
    }
}