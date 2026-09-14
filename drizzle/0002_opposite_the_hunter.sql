CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'shipped', 'delivered', 'canceled');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"orderId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"productName" varchar NOT NULL,
	"unitPriceAmount" integer NOT NULL,
	"unitPriceCurrency" varchar(3) DEFAULT 'USD' NOT NULL,
	"quantity" integer NOT NULL,
	"discountAmount" integer,
	"discountCurrency" varchar(3),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"customerId" uuid NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"totalAmount" integer NOT NULL,
	"totalCurrency" varchar(3) DEFAULT 'USD' NOT NULL,
	"shippingId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shipping_address" (
	"id" uuid PRIMARY KEY NOT NULL,
	"street" varchar,
	"city" varchar,
	"state" varchar,
	"zipCode" varchar,
	"country" varchar,
	"trackingNumber" varchar,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shippingId_shipping_address_id_fk" FOREIGN KEY ("shippingId") REFERENCES "public"."shipping_address"("id") ON DELETE no action ON UPDATE no action;