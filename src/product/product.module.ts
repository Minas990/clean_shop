import { Module } from "@nestjs/common";
import { ProductController } from "./presentation/product.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { PRODUCT_REPOSITORY } from "./application/ports/product.repository.port";
import { DrizzleProductRepository } from "./infrastructure/adapters/drizzle-product.repository";
import { CommandHandlers } from "./application";
import { QueryHandlers } from "./application/queries/handler";
import { ConfigService } from "@nestjs/config";
import { MongoProductRepository } from "./infrastructure/adapters/mongo-product.repository";


@Module({
    imports:[CqrsModule],
    controllers: [ProductController],
    providers:[
       ...CommandHandlers,
       ...QueryHandlers,
       DrizzleProductRepository,
       MongoProductRepository
        ,{
            provide: PRODUCT_REPOSITORY,
            useFactory: (cs:ConfigService, mongoRepo : MongoProductRepository , drizzleRepo:DrizzleProductRepository) => {
                return cs.get('DATABASE') === 'mongodb' ? mongoRepo: drizzleRepo
            },
            inject:[ConfigService,MongoProductRepository,DrizzleProductRepository]
        }
    ]
})
export class ProductModule
{

}