import { Command, CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { PlaceOrderCommand } from "./place-order.comand";
import { Inject } from "@nestjs/common";
import { ORDER_REPOSITORY, OrderRepositoryPort } from "../../ports/orderRepository.port";
import { Order } from "../../../domain/entities/order.entity";
import { OrderItem } from "../../../domain/entities/order-item.entity";
import { Money } from "../../../../shared/domain/value-objects/money.vo";
import { ShippingAddress } from "../../../domain/value-objects/shipping-address.vo";
import { CUSTOMER, CustomerPort } from "../../ports/customer.port";
import { PRODUCT, ProductPort } from "../../ports/product.port";
import { ApplicationException } from "../../../../shared/domain/exceptions/application.exception";



@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> 
{
    constructor(@Inject(ORDER_REPOSITORY) 
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(CUSTOMER) private readonly customer : CustomerPort,
    @Inject(PRODUCT) private readonly product: ProductPort,
    private readonly eventPublisher: EventPublisher
) {}

    async execute(command: PlaceOrderCommand): Promise<any> {
        const customerExist = await this.customer.exist(command.customerId);
        if(!customerExist) throw new ApplicationException('customer not found with id ' + command.customerId);

        command.items.forEach(async (item)=> {
            const prodExist = await this.product.exist(item.productId);
            if(!prodExist)
                throw new ApplicationException('product not found '+item.productId);
        })
        
        const items = command.items.map((item) => OrderItem.create(item.productId,item.productName,Money.create(item.unitPrice,item.currency),item.quantity,
    item.discount!==undefined ? Money.create(item.discount,item.currency):undefined));
        const shippingAddress = ShippingAddress.create({
            city: command.shippingCity,
            street: command.shippingStreet,
            zipCode: command.shippingZipCode,
            country: command.shippingCountry,
            state: command.shippingState
        });
        
        const order =this.eventPublisher.mergeObjectContext( Order.place(command.customerId,items,shippingAddress));
        await this.orderRepository.save(order);
        order.commit();
    }
}  
