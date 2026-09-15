ALTER TABLE "shipping_address" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "shipping_address" CASCADE;--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_shippingId_shipping_address_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "adressStreet" varchar;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "adressCity" varchar;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "adressState" varchar;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "adressZipCode" varchar;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "adressCountry" varchar;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "adressTrackingNumber" varchar;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shippingId";