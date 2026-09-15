import { OrderItem } from "../../domain/entities/order-item.entity";
import { Order } from "../../domain/entities/order.entity";

export class OrderItemResponseDto
{
    id!:string;
    productId!:string;
    productName!:string;
    unitPrice!:number;
    quantity!:number;
    currency!:string;
    discount!: number | null;
    subtotal!: number;

    static fromDomain(item:OrderItem): OrderItemResponseDto {
        const dto = new OrderItemResponseDto();
        dto.id = item.getId().getValue();
        dto.productId = item.productId;
        dto.productName = item.productName;
        dto.unitPrice = item.unitPrice.getAmount();
        dto.quantity = item.quantity;
        dto.currency = item.unitPrice.getCurrency();
        dto.discount = item.discount?.getAmount() ?? null;
        dto.subtotal = item.getSubtotal().getAmount();
        return dto;
    }
}

export class OrderResponseDto
{
    id!: string;
    customerId!: string;
    status!:string;
    items!: OrderItemResponseDto[];
    totalAmount!: number;
    totalCurrency!: string;
    itemCount!: number;
    trackingNumber!: string|null;
    notes!: string| null;

    shippingStreet!: string;
    shippingCity!: string;
    shippingState!: string;
    shippingZipCode!: string;
    shippingCountry!: string;

    createdAt!: string;
    updatedAt!: string;
    
    static fromDomain(order: Order): OrderResponseDto {
        const dto = new OrderResponseDto();
        dto.id = order.id.getValue();
        dto.customerId = order.customerId;
        dto.status = order.status.toString();
        dto.items = order.items.map(item => OrderItemResponseDto.fromDomain(item));
        dto.totalAmount = order.getTotal().getAmount();
        dto.totalCurrency = order.getTotal().getCurrency();
        dto.itemCount = order.getItemsCount();
        dto.trackingNumber = order.trackingNumber;
        dto.notes = order.notes;

        dto.shippingStreet = order.shippingAddress.street;
        dto.shippingCity = order.shippingAddress.city;
        dto.shippingState = order.shippingAddress.state;
        dto.shippingZipCode = order.shippingAddress.zipcode;
        dto.shippingCountry = order.shippingAddress.country;

        dto.createdAt = order.createdAt.toISOString();
        dto.updatedAt = order.updatedAt.toISOString();

        return dto;
    }
}