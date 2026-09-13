import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RegisterCustomerCommand } from "./register-customer.command";
import { Inject } from "@nestjs/common";
import { CUSTOMER_REPOSITORY, CustomerRepositoryPort } from "../../ports/customer.repository";
import { Customer } from "../../../domain/entities/customer.entity";
import { Email } from "../../../domain/value-objects/customer-email.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";


@CommandHandler(RegisterCustomerCommand)
export class RegisteCustomerHandler implements ICommandHandler<RegisterCustomerCommand,void>
{
    constructor(@Inject(CUSTOMER_REPOSITORY) private readonly csRepo : CustomerRepositoryPort
                ,private readonly eventPublisher: EventPublisher
) {

    }

    async execute(command: RegisterCustomerCommand): Promise<void> {
        const email = Email.create(command.email);
        const exisitngCustomer =await this.csRepo.findByEmail(email);
        if(exisitngCustomer) 
            throw new ApplicationException('user already exists',ApplicationExceptionCode.CONFLICT );
        const customer = this.eventPublisher.mergeObjectContext( Customer.register(email,command.firstName,command.lastName,command.phone));
        await this.csRepo.save(customer);
        customer.commit();
    }

    
}