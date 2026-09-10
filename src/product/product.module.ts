import { Module } from "@nestjs/common";
import { ProductController } from "./presentation/product.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { PRODUCT_REPOSITORY } from "./application/ports/product.repository.port";
import { DrizzleProductRepository } from "./infrastructure/adapters/drizzle-product.repository";
import { CommandHandlers } from "./application";
import { QueryHandlers } from "./application/queries/handler";


@Module({
    imports:[CqrsModule],
    controllers: [ProductController],
    providers:[
       ...CommandHandlers,
       ...QueryHandlers
        ,{
            provide: PRODUCT_REPOSITORY,
            useClass: DrizzleProductRepository
        }
    ]
})
export class ProductModule
{

}