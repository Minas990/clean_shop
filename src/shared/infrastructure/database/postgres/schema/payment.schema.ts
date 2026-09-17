import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { orders } from "./orders.schema";
import { varchar } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";


export const paymentStatusEnum = pgEnum('payment_status', ['PENDING', 'SUCCEEDED', 'PROCESSING']);

export const payments = pgTable("payments", {
    id: uuid().primaryKey(),
    orderId: uuid().notNull().references(()=>orders.id),
    gatewayTransactionId: varchar('gateway_transaction_id', { length: 255 }),
    status: paymentStatusEnum().notNull().default('PENDING'),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    currency: varchar("currency", { length: 3 }).notNull().default('USD'),
});
