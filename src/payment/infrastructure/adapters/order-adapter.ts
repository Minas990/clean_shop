import { Inject, Injectable } from "@nestjs/common";
import { OrderPricing, OrderServicePort } from "../../application/ports/orders.port";
import { ORDER_REPOSITORY, OrderRepositoryPort } from "../../../order/application/ports/orderRepository.port";
import { OrderId } from "../../../order/domain/value-objects/order-id.vo";


@Injectable()
export class OrderServiceAdapter implements OrderServicePort
{
    constructor(
        @Inject(ORDER_REPOSITORY) private readonly or: OrderRepositoryPort
    ) {}

    async getOrderPricing(orderId: string): Promise<OrderPricing | null> {
        const order = await this.or.findById(new OrderId(orderId));
        if(!order) {
            return null;
        }
        return {
            total: order.getTotal(),
            lines: order.items.map((line)=>({
                name: line.productName,
                quantity:line.quantity,
                unitAmount: line.getEffectiveUnitPrice()
            })),

        }
    }
}