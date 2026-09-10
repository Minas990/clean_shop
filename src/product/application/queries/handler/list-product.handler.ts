import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ListProductQuery } from "../list-product.query";
import { Inject } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../ports/product.repository.port";
import { Product } from "../../../domain/entities/product.entity";


@QueryHandler(ListProductQuery)
export class ListProductHandler implements IQueryHandler<ListProductQuery>
{
    constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository) 
    {}

    execute(query: ListProductQuery): Promise<Product[]>  {
        return this.productRepository.findAll({
            isActive: query.isActive,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice
        });
    }

}