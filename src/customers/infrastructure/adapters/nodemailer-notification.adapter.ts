import { Inject, Injectable, Logger } from "@nestjs/common";
import { Notification, NotificationPort } from "../../application/ports/notifications.port";
import * as Nodemailer from 'nodemailer';
import { ConfigService } from "@nestjs/config";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../application/ports/customer.repository";
import { CustomerId } from "../../domain/value-objects/customer-id.vo";
import { ApplicationException } from "../../../shared/domain/exceptions/application.exception";
@Injectable()
export class NodemailerNotificationsAdapter implements NotificationPort
{
    private readonly transport: Nodemailer.Transporter
    private readonly from:string;
    private readonly logger = new Logger(NodemailerNotificationsAdapter.name)
    constructor(private readonly cs:ConfigService,
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customersRepo: CustomerRepositoryPort)
    {
        this.transport = Nodemailer.createTransport({
            host: cs.getOrThrow('SMTP_HOST'),
            auth: {
                pass: cs.getOrThrow('SMTP_PASS'),
                user: cs.getOrThrow('SMTP_USER'),
            },
            port: cs.getOrThrow("SMTP_PORT"),
        });
        this.from = cs.getOrThrow('SMTP_FROM')
    }

    async sendNotification(notification: Notification): Promise<void> {
        const customer = await this.customersRepo.findById(new CustomerId(notification.recipientId));
        if(!customer) throw new ApplicationException(`user not found by ${notification.recipientId}`);
        await this.transport.sendMail({
            to:customer.getEmail().toString(),
            from:this.from,
            subject:notification.subject,
            text: notification.message
        });
        this.logger.log(`email send to user ${customer.getEmail().getValue()}`);
    }
}