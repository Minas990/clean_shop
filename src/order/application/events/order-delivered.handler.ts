import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { OrderDeliveredEvent } from "../../domain/events/order-delivered.event";
import { NOTIFICATION_SERVICE, NotificationPort } from "../../../customers/application/ports/notifications.port";
import { Inject } from "@nestjs/common";


@EventsHandler(OrderDeliveredEvent) 
export class OrderDeliveredHandler implements IEventHandler<OrderDeliveredEvent>
{
      constructor(
            @Inject(NOTIFICATION_SERVICE) private readonly noteService: NotificationPort
        
    ) 
        {
    
        }

     async handle(event: OrderDeliveredEvent) {
         await this.noteService.sendNotification({
             subject: `Order delivered: ${event.orderId}`,
             recipientId: event.customerId,
             message: `order with id ${event.orderId} has been delivered to customer ${event.customerId}`,
         });
     }
}