import { Inject, Injectable } from "@nestjs/common";
import { OrderRepositoryPort } from "../../application/ports/orderRepository.port";
import { DRIZZLE, DrizzleDB } from "../../../shared/infrastructure/database/postgres/drizzle.provider";
import { Order } from "../../domain/entities/order.entity";
import { orderItems, orders } from "../../../shared/infrastructure/database/postgres/schema";
import { OrderItem } from "../../domain/entities/order-item.entity";
import { and, eq, notInArray } from "drizzle-orm";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { UniqueId } from "../../../shared/domain/value-objects/unique-Id.vo";
import { ShippingAddress } from "../../domain/value-objects/shipping-address.vo";
import { OrderId } from "../../domain/value-objects/order-id.vo";
import { OrderStatus } from "../../domain/value-objects/order-status.vo";


@Injectable()
export class DrizzleOrderRepo implements OrderRepositoryPort
{
    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleDB 
    ) {}

    async save(order: Order): Promise<void> {
        const orderRow  =  DrizzleOrderRepo.toOrderPersistence(order);
        const itemsRow = order.items.map((item)=>DrizzleOrderRepo.toItemPersistence(item,order.id.getValue()));

        await this.db.transaction(async (tx) => {
            await tx.insert(orders).values(orderRow).onConflictDoUpdate({
            target: orders.id,
            set: {
                status: orderRow.status,
                totalAmount: orderRow.totalAmount,
                totalCurrency: orderRow.totalCurrency,
                adressCity: orderRow.adressCity,
                adressCountry: orderRow.adressCountry,
                adressState: orderRow.adressState,
                adressStreet: orderRow.adressStreet,
                adressTrackingNumber: orderRow.adressTrackingNumber,
                adressZipCode: orderRow.adressZipCode,
                updatedAt: orderRow.updatedAt,
                notes: orderRow.notes,
            }});

            await Promise.all(itemsRow.map((item)=>{
                return tx.insert(orderItems).values(item).onConflictDoUpdate({
                    target: orderItems.id,
                    set: {
                        productName: item.productName,
                        discountAmount: item.discountAmount,
                        discountCurrency: item.discountCurrency,
                        quantity: item.quantity,
                        unitPriceAmount: item.unitPriceAmount,
                        unitPriceCurrency: item.unitPriceCurrency,
                        updatedAt: item.updatedAt
                    }
                })
             }));
                
            const currentItemIds = itemsRow.map((r) => r.id);
            if(currentItemIds.length) 
            {
                await tx.delete(orderItems).where(
                    and(
                        eq(orderItems.orderId,order.id.getValue()),
                        notInArray(orderItems.id,currentItemIds)
                    )
                );
            }
            else 
            {
                await tx.delete(orderItems).where(
                    eq(orderItems.orderId,order.id.getValue())
                )
            }
        })

    }

    async findById(id: OrderId): Promise<Order | null> {
        const result = await this.db.query.orders.findFirst({
            where: eq(orders.id,id.getValue()),
            with: {items: true}
        })
        if (!result) {
            return null;
        }
        return DrizzleOrderRepo.toDomain(result,result.items);
    }

    async findByCustomerId(customerId: string): Promise<Order[]> {
        const result = await this.db.query.orders.findMany({
            where: eq(orders.customerId,customerId),
            with: {items: true}
        })
        if (!result) {
            return [];
        }
        return result.map((row) => DrizzleOrderRepo.toDomain(row,row.items));
    }

    async findAll(): Promise<Order[]> {
        const result = await this.db.query.orders.findMany({
            with: {items: true}
        });
        return  result.map((row) => DrizzleOrderRepo.toDomain(row,row.items));
    }

    async delete(id: OrderId): Promise<void> {
        await this.db.transaction( async (tx) => {
            await tx.delete(orderItems).where(eq(orderItems.orderId, id.getValue()));
            await tx.delete(orders).where(eq(orders.id, id.getValue()));
        });
    }

    private static toOrderPersistence(order:Order) : typeof orders.$inferSelect
    { 
        
        const total = order.getTotal();
        return {
            id:order.id.getValue(),
            createdAt:order.createdAt,
            customerId:order.customerId,
            adressCity:order.shippingAddress.city,
            adressCountry:order.shippingAddress.country,
            notes:order.notes,
            adressState:order.shippingAddress.state,
            adressStreet:order.shippingAddress.street,
            adressTrackingNumber: order.trackingNumber,
            adressZipCode: order.shippingAddress.zipcode,
            status: order.status.getValue(),
            totalAmount: total.toCents(),
            totalCurrency: total.getCurrency(),
            updatedAt: order.updatedAt
        }
    }

    private static toItemPersistence(item: OrderItem,orderId: string):typeof orderItems.$inferSelect
    {
        const now =new Date();
        return {
            id:item.getId().getValue(),
            productId:item.productId,
            productName: item.productName,
            unitPriceCurrency: item.unitPrice.getCurrency(),
            unitPriceAmount: item.unitPrice.toCents(),
            orderId,
            quantity: item.quantity,
            discountAmount: item.discount?.toCents() ?? null,
            discountCurrency:item.discount?.getCurrency() ?? null,
            createdAt: now,
            updatedAt: now
        }
    }

    private static toDomain(orderRow: typeof orders.$inferSelect,itemRows: typeof orderItems.$inferSelect[]): Order 
    {

        const item = itemRows.map((row) => {
            const discount = row.discountAmount !== null && row.discountCurrency !==null ? 
            Money.create(row.discountAmount / 100, row.discountCurrency) : null;

            return OrderItem.recontitute({
                id: new UniqueId(row.id),
                discount,
                productId: row.productId,
                productName: row.productName,
                unitPrice: Money.create(row.unitPriceAmount / 100, row.unitPriceCurrency),
                quantity: row.quantity
            });
        });

        const shippingAddress = ShippingAddress.create({
            city: orderRow.adressCity ?? '',
            country: orderRow.adressCountry??'',
            state: orderRow.adressState ?? '',
            street: orderRow.adressStreet ?? '',
            zipCode: orderRow.adressZipCode ?? ''
        });

        return Order.reconstitute({
            id: new OrderId(orderRow.id),
            customerId: orderRow.customerId,
            createdAt: orderRow.createdAt,
            updatedAt: orderRow.updatedAt,
            shippingAddress,
            trackingNumber: orderRow.adressTrackingNumber,
            notes: orderRow.notes,
            status:  OrderStatus.fromString(orderRow.status ),
            items: item,
        });

    }
}