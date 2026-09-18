import { Body, Controller, Post } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CreatePaymentCommand } from "../application/use-cases/create-payment/create-payment.command";


@Controller('payments')
export class PaymentController 
{
    constructor(
        private readonly commandBus: CommandBus,
    ){}

    @Post()
    async createPayment(
        @Body() createPaymentDto: CreatePaymentDto
    )
    {   
        return this.commandBus.execute<CreatePaymentCommand>(new CreatePaymentCommand(
            createPaymentDto.orderId,
            createPaymentDto.cancelUrl,
            createPaymentDto.successUrl
        ));
    }
}