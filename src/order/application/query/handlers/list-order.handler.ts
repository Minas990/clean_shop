import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Order } from "../../../domain/entities/order.entity";
import { Inject } from "@nestjs/common";
import { ORDER_REPOSITORY, OrderRepositoryPort } from "../../ports/orderRepository.port";
import { ListORderQUery } from "../liist-orders.query";

@QueryHandler(ListORderQUery)
export class ListORderHandler implements IQueryHandler<ListORderQUery,Order[]>
{
    constructor(
        @Inject(ORDER_REPOSITORY) private readonly orderRepo: OrderRepositoryPort
    )
    {

    }
    async execute(query: ListORderQUery): Promise<Order[]> {
        const orders = query.customerId ? await this.orderRepo.findByCustomerId(query.customerId) : await this.orderRepo.findAll();
        return orders;
    }
}