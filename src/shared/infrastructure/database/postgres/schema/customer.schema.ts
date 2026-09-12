import { varchar } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const customers = pgTable('customers',{
    id: uuid().primaryKey(),
    email: varchar('email',{length:255}).notNull().unique(),
    firstName: varchar('first_name',{length:100}).notNull(),
    lastName:  varchar('last_name',{length:100}).notNull(),
    phone: varchar('phone',{length:20}),
    isActive: boolean().notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt :timestamp('updated_at').notNull().defaultNow()
});

