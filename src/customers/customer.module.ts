import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { DrizzleCustomerRepository } from "./infrastructure/adapters/drizzle-product.repository";
import { CUSTOMER_REPOSITORY } from "./application/ports/customer.repository";
import { commandHandlers } from "./application/use-cases";
import { CustomerController } from "./presentation/customer.controller";
import { queryHandlers } from "./application/queries/handlers";
import { NOTIFICATION_SERVICE } from "./application/ports/notifications.port";
import { ConsoleNotificationAdapter } from "./infrastructure/adapters/console-notification.adapter";
import { EventHandlers } from "./domain/events";
import { NodemailerNotificationsAdapter } from "./infrastructure/adapters/nodemailer-notification.adapter";

@Module({
    imports:[CqrsModule],
    controllers:[CustomerController],
    providers:[
        ...commandHandlers,
        ...queryHandlers,
        ...EventHandlers,
        {
            provide: CUSTOMER_REPOSITORY,
            useClass: DrizzleCustomerRepository
        },
        {
            provide: NOTIFICATION_SERVICE,
            useClass: NodemailerNotificationsAdapter
        }
    ],
    exports:[CUSTOMER_REPOSITORY]
})

export class CustomerModule {

}