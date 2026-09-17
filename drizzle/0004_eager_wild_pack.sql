CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'SUCCEEDED', 'PROCESSING');--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"orderId" uuid NOT NULL,
	"gateway_transaction_id" varchar(255),
	"paymentStatus" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;