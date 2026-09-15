import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { PlaceOrderDto } from "./dto/place-order.dto";
import { OrderResponseDto } from "./dto/order-response.dto";
import { PlaceOrderCommand } from "../application/use-cases/place-order/place-order.comand";

@Controller('orders')
export class OrderController
{
    constructor(
        private readonly commandBus: CommandBus,private readonly queryBus: QueryBus
    ) {}

    @Post()
    async place(@Body() dto : PlaceOrderDto): Promise<void>
    {
        await  this.commandBus.execute<PlaceOrderCommand,void>(new PlaceOrderCommand(dto.customerId,dto.items.map((item) => {
            return {
                productId: item.productId,
                productName: item.productName,
                unitPrice: item.unitPrice,
                currency: item.currency ?? "USD",
                quantity: item.quantity,
            };
        }),dto.shippingStreet,dto.shippingCity,dto.shippingState,dto.shippingZipcode,dto.shippingCountry));
    }
}