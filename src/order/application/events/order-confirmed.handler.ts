import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { OrderConfirmedEvent } from "../../domain/events/Order-Confirmed.Event";
import { Inject } from "@nestjs/common";
import { NOTIFICATION_SERVICE, NotificationPort } from "../../../customers/application/ports/notifications.port";
import { ConfigService } from "@nestjs/config";

@EventsHandler(OrderConfirmedEvent) 
export class OrderConfirmedEventHandler implements IEventHandler<OrderConfirmedEvent>
{
    constructor(
        @Inject(NOTIFICATION_SERVICE) private readonly noteService: NotificationPort
    ,
       protected readonly  cs:ConfigService
) 
    {

    }

    async handle(event: OrderConfirmedEvent) {
        await this.noteService.sendNotification({
            subject: `Order ${event.orderId} confirmed for customer ${event.customerId}`,
            recipientId: this.cs.getOrThrow('ADMID_USER_ID'),//not a good idea to hardcode this, but for the sake of this example, we will do it later
            message: `order to be sent to ${event.shippingAddress.street}, ${event.shippingAddress.city}, ${event.shippingAddress.state}, ${event.shippingAddress.zipcode}, ${event.shippingAddress.country}`,
        })
    }
}