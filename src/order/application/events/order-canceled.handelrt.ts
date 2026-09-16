import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { OrderCanceledEvent } from "../../domain/events/order.canceled.event";
import { Inject } from "@nestjs/common";
import { NOTIFICATION_SERVICE, NotificationPort } from "../../../customers/application/ports/notifications.port";


@EventsHandler(OrderCanceledEvent)
export class OrderCanceledHandler implements IEventHandler<OrderCanceledEvent>
{
    constructor(
            @Inject(NOTIFICATION_SERVICE) private readonly noteService: NotificationPort
            ) 
        {
            
        }
    async handle(event: OrderCanceledEvent) {
        await this.noteService.sendNotification({
            subject: `Order ${event.orderId} canceled for customer ${event.customerId}`,
            recipientId: event.customerId,
            message: `Order ${event.orderId} has been canceled due to the following reason: ${event.reason}`,
        });
    }
}
