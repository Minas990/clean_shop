import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CustomerRegisterEvent } from "../../domain/events/customer-register.event";
import { Inject } from "@nestjs/common";
import { NOTIFICATION_SERVICE, NotificationPort } from "../ports/notifications.port";


@EventsHandler(CustomerRegisterEvent)

export class CustomerRegisterHandler implements IEventHandler< CustomerRegisterEvent>
{

    constructor(@Inject(NOTIFICATION_SERVICE) private readonly notificationService: NotificationPort)
    {}
    
    async handle(event: CustomerRegisterEvent) {
        await this.notificationService.sendNotification({
            recipientId:event.customerId,
            subject: 'welcome',
            message: 'welcome to our shop '+event.fullName
        })
    }
}