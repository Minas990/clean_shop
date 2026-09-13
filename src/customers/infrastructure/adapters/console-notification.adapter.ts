import { Inject, Injectable, Logger } from "@nestjs/common";
import { Notification, NotificationPort } from "../../application/ports/notifications.port";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../application/ports/customer.repository";
import { CustomerId } from "../../domain/value-objects/customer-id.vo";



@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort
{

    constructor(
        @Inject(CUSTOMER_REPOSITORY) private readonly csRepo: CustomerRepositoryPort
    ) {}
    private readonly logger = new Logger(ConsoleNotificationAdapter.name);
    async sendNotification(notification: Notification): Promise<void> {

        const customer = await this.csRepo.findById(new CustomerId(notification.recipientId));
        const recipient = customer?.getEmail().getValue() ;
        this.logger.log(
            `[${notification.subject} TO: ${recipient} | ${notification.message}`
        )
    }
}