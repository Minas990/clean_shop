import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { NOTIFICATION_SERVICE, NotificationPort } from "../../../customers/application/ports/notifications.port";
import { ConfigService } from "@nestjs/config";
import { OrderShippedEvent } from "../../domain/events/order-shipped.event";

@EventsHandler(OrderShippedEvent) 
export class OrderShippedEventHandler implements IEventHandler<OrderShippedEvent>
{
    constructor(
        @Inject(NOTIFICATION_SERVICE) private readonly noteService: NotificationPort
    ,
       protected readonly  cs:ConfigService
) 
    {

    }

    async handle(event: OrderShippedEvent) {
        await this.noteService.sendNotification({
            subject: `Order shipped: ${event.orderId}`,
            recipientId: this.cs.getOrThrow('ADMID_USER_ID'),//not a good idea to hardcode this, but for the sake of this example, we will do it later
            message: `order to customer ${event.customerId} has been shipped with tracking number ${event.trackingNumber}`,
        })
    }
}