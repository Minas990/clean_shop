import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { PlaceOrderDto } from "./dto/place-order.dto";
import { OrderResponseDto } from "./dto/order-response.dto";
import { PlaceOrderCommand } from "../application/use-cases/place-order/place-order.comand";
import { ListORderQUery } from "../application/query/liist-orders.query";
import { Order } from "../domain/entities/order.entity";
import { GetOrderQuery } from "../application/query/get-order.query";

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

    @Get()
    async findAll(@Query('customerId') customerId?: string) : Promise<OrderResponseDto[]>
    {
        const orders = await this.queryBus.execute<ListORderQUery, Order[]>(new ListORderQUery(customerId));

        return orders.map(OrderResponseDto.fromDomain);
    }

    @Get(":id")
    async findOne(@Param('id',new ParseUUIDPipe()) id: string) : Promise<OrderResponseDto>
    {
        const order = await this.queryBus.execute<GetOrderQuery, Order>(new GetOrderQuery(id));
        return OrderResponseDto.fromDomain(order);
    }
}