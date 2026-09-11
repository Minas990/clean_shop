import { Product } from "../../domain/entities/product.entity";
import { ProductId } from "../../domain/value-objects/product-id.vo";
import { Sku } from "../../domain/value-objects/sku.vo";

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductFilters
{
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
}

export interface ProductRepository
{
    save(product: Product):Promise<void>;
    findById(id: ProductId):Promise<Product | null>;
    findAll(filters: ProductFilters):Promise<Product[]>;
    findBySku(sku: Sku):Promise<Product | null>;
    findByName(name: string):Promise<Product| null>;
    delete(id: ProductId):Promise<void>;
}