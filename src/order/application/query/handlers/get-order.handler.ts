import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetOrderQuery } from "../get-order.query";
import { Order } from "../../../domain/entities/order.entity";
import { Inject } from "@nestjs/common";
import { ORDER_REPOSITORY, OrderRepositoryPort } from "../../ports/orderRepository.port";
import { OrderId } from "../../../domain/value-objects/order-id.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery,Order>
{
    constructor(@Inject(ORDER_REPOSITORY) private readonly orderRepo: OrderRepositoryPort)
    {
    }
    async execute(query: GetOrderQuery): Promise<Order> {
        const order = await this.orderRepo.findById( new OrderId(query.id));
        if(!order) 
        throw new ApplicationException('not found the order'+query.id,ApplicationExceptionCode.NOT_FOUND);
        return order;
    }
}