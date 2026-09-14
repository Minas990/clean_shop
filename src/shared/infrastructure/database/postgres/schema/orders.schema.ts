import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { customers } from "./customer.schema";
import { pgEnum } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { products } from "./product.schema";

export const orderStatusEnum = pgEnum('order_status',[
    'pending',
    'confirmed',
    'shipped' ,
    'delivered',
    'canceled'
])

export const orders = pgTable('orders',{
    id: uuid().primaryKey(),
    customerId: uuid().notNull().references(() => customers.id),
    status: orderStatusEnum().default('pending').notNull(),
    totalAmount: integer().notNull(),
    totalCurrency: varchar({length:3}).notNull().default('USD'),
    shippingId: uuid().notNull().references(() => shippingAddress.id),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

export const shippingAddress = pgTable('shipping_address',{
    id:uuid().primaryKey(),
    street: varchar(),
    city:varchar(),
    state:varchar(),
    zipCode: varchar(),
    country: varchar(),
    trackingNumber: varchar(),
    notes:text(),
})

export const orderItems =pgTable('order_items', {
    id: uuid().primaryKey(),
    orderId: uuid().notNull().references(() => orders.id),
    productId: uuid().notNull().references(() => products.id),
    productName: varchar().notNull(),
    unitPriceAmount: integer().notNull(),
    unitPriceCurrency: varchar({length:3}).notNull().default('USD'),
    quantity: integer().notNull(),
    discountAmount: integer(),
    discountCurrency: varchar({length:3}),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});