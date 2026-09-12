import { Collection, Db, Filter, MongoClient } from "mongodb";
import { ProductFilters, ProductRepository } from "../../application/ports/product.repository.port";
import { Inject } from "@nestjs/common";
import { MONGO_DB } from "../../../shared/infrastructure/database/mongodb/mongo.provider";
import { Product } from "../../domain/entities/product.entity";
import { ProductId } from "../../domain/value-objects/product-id.vo";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { Sku } from "../../domain/value-objects/sku.vo";

interface ProductDocument {
    _id:string;
    name:string;
    description:string;
    sku:string;
    priceAmount:number;
    priceCurrency:string;
    stock:number;
    isActive:boolean;
    lowStockThreshold:number;
    createdAt:Date;
    updatedAt:Date;
}


export class MongoProductRepository  implements ProductRepository
{
    private readonly collection: Collection<ProductDocument>;
    constructor(
        @Inject(MONGO_DB) private readonly db : Db
    )
    {
        this.collection = this.db.collection<ProductDocument>('products');
    }

    async save(product: Product): Promise<void> {
        const doc = MongoProductRepository.toPersistence(product);
        await this.collection.updateOne({
            _id:doc._id
        },{$set: {
            doc
        }},{upsert:true});
    }

    async findById(id: ProductId): Promise<Product | null> {
        const doc = await this.collection.findOne({_id:id.getValue()});
        if(!doc) return null;
        return MongoProductRepository.toDomain(doc);
    }

    async findByName(name: string): Promise<Product | null> {
        const doc = await this.collection.findOne({name:name});
        if(!doc) return null;
        return MongoProductRepository.toDomain(doc);
    }

    async findBySku(sku: Sku): Promise<Product | null> {
        const doc = await this.collection.findOne({sku:sku.getValue()});
        if(!doc) return null;
        return MongoProductRepository.toDomain(doc);
    }

    async findAll(filters: ProductFilters): Promise<Product[]> {
        const conditions: Filter<ProductDocument> = {};


        if(filters.isActive !== undefined) {
            conditions.isActive = filters.isActive;
        }
        if(filters.minPrice !== undefined || filters.maxPrice !== undefined ) 
        {
            conditions.priceAmount = {};
            if(filters.minPrice !== undefined)
                conditions.priceAmount.$gte = filters.minPrice * 100;
            if(filters.maxPrice !== undefined) 
            conditions.priceAmount.$lte = filters.maxPrice*100;

        }
        
        const docs = await this.collection.find(conditions).toArray();
        return docs.map(MongoProductRepository.toDomain);

    }


    async delete(id: ProductId): Promise<void> {
        await this.collection.findOneAndDelete({_id:id.getValue()});
    }
    private static toPersistence(product:Product) : ProductDocument
    {
        return {
            _id:product.id.getValue(),
            createdAt: product.createdAt,
            description:product.description,
            isActive: product.isActive,
            lowStockThreshold:product.lowStockThreshold,
            name: product.name,
            priceAmount: product.price.toCents(),
            priceCurrency: product.price.getCurrency(),
            sku: product.sku.getValue(),
            stock: product.stock,
            updatedAt:  product.updatedAt
        }
    }

    private static toDomain(product:ProductDocument) : Product
    {
        return Product.reconsitute({
            id: new ProductId(product._id),
            createdAt: product.createdAt,
            description:product.description,
            isActive: product.isActive,
            lowStockThreshold:product.lowStockThreshold,
            name: product.name,
            price: Money.create(product.priceAmount / 100,product.priceCurrency),
            sku: Sku.create(product.sku),
            stock: product.stock,
            updatedAt:  product.updatedAt
        })
    }


}