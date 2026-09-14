import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { customers } from "./customer.schema";
import { pgEnum } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { products } from "./product.schema";
import { relations } from "drizzle-orm";

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
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    adressStreet: varchar(),
    adressCity:varchar(),
    adressState:varchar(),
    adressZipCode: varchar(),
    adressCountry: varchar(),
    adressTrackingNumber: varchar(),
    notes:text(),

});

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
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull()
});

export const orderRelations = relations(orders,({ many }) => ({
    items: many(orderItems),
}));

export const orderItemsRelations= relations(orderItems,({one}) => ({
    order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));