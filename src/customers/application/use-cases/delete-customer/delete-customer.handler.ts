import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCustomerCommand } from "./delete-customer.command";
import { Inject } from "@nestjs/common";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../ports/customer.repository";
import { Customer } from "../../../domain/entities/customer.entity";
import { Email } from "../../../domain/value-objects/customer-email.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";
import { CustomerId } from "../../../domain/value-objects/customer-id.vo";


@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand,void>
{
    constructor(@Inject(CUSTOMER_REPOSITORY) private readonly csRepo : CustomerRepositoryPort) {

    }

    async execute(command: DeleteCustomerCommand): Promise<void> {
        await this.csRepo.delete(new CustomerId(command.id));
    }

}