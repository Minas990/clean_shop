import { Inject, Injectable } from "@nestjs/common";
import { ProductFilters, ProductRepository } from "../../application/ports/product.repository.port";
import { DRIZZLE, DrizzleDB } from "../../../shared/infrastructure/database/postgres/drizzle.provider";
import { Product } from "../../domain/entities/product.entity";
import { products } from "../../../shared/infrastructure/database/postgres/schema";
import { Sku } from "../../domain/value-objects/sku.vo";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { ProductId } from "../../domain/value-objects/product-id.vo";
import { and, eq, gte, lte, SQL } from "drizzle-orm";


@Injectable()
export class DrizzleProductRepository implements ProductRepository
{
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) 
    {

    }

    async save(product: Product): Promise<void> {
        const row = DrizzleProductRepository.toPersistence(product);
        await this.db.insert(products).values(row).onConflictDoUpdate({
            target: products.id,
            set: {
                name: row.name,
                description: row.description,
                priceAmount: row.priceAmount,
                priceCurrency: row.priceCurrency,
                sku: row.sku,
                stock: row.stock,
                isActive: row.isActive,
                lowStockThreshold: row.lowStockThreshold,
                updatedAt: row.updatedAt
            },
        })
    }



    async findById(id: ProductId): Promise<Product | null> {
        const row = await this.db.select().from(products).where(eq(products.id,id.getValue()));
        if(row.length === 0) return null;
        return DrizzleProductRepository.toDomain(row[0]);
    }

    async findAll(filters: ProductFilters): Promise<Product[]> {
        const conditions: SQL[] = [];

        if(filters.isActive !== undefined) {
            conditions.push(eq(products.isActive, filters.isActive));
        }
        if(filters.minPrice !== undefined) {
            conditions.push( gte (products.priceAmount, Math.round(filters.minPrice * 100)));
        }
        if(filters.maxPrice !== undefined) {
            conditions.push(lte (products.priceAmount, Math.round(filters.maxPrice * 100)));
        }

        const query = this.db.select().from(products);
        const productRows = conditions.length > 0 ? await query.where(and(...conditions)) : await query;

        return productRows.map(DrizzleProductRepository.toDomain);
    }



    async findBySku(sku: Sku): Promise<Product | null> {
        const row = await this.db.select().from(products).where(eq(products.sku, sku.getValue()));
        if(row.length === 0) return null;
        return DrizzleProductRepository.toDomain(row[0]);
    }

    async findByName(name: string): Promise<Product | null> {
        const row = await this.db.select().from(products).where(eq(products.name, name));
        if(row.length === 0) return null;
        return DrizzleProductRepository.toDomain(row[0]);
    }


    async delete(id: ProductId): Promise<void> {
         await this.db.delete(products).where(eq(products.id, id.getValue()));
    }

    private static toDomain(row: typeof products.$inferSelect): Product
    {
        return Product.reconsitute({
            id: new ProductId(row.id),
            name: row.name,
            description: row.description,
            price: Money.create(row.priceAmount / 100, row.priceCurrency),
            sku:  Sku.create(row.sku),
            stock: row.stock,
            isActive: row.isActive,
            lowStockThreshold: row.lowStockThreshold,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        })
    }

    private static toPersistence(product: Product): typeof products.$inferSelect
    {
        return {
            id:product.id.getValue(),
            name:product.name,
            description:product.description,
            priceAmount:product.price.toCents(),
            priceCurrency:product.price.getCurrency(),
            sku:product.sku.getValue(),
            stock:product.stock,
            isActive:product.isActive,
            lowStockThreshold:product.lowStockThreshold,
            createdAt:product.createdAt,
            updatedAt:product.updatedAt
        }
    }

}