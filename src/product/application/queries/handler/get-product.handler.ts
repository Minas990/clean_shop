import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProductQuery } from "../get-product.query";
import { Inject } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../ports/product.repository.port";
import { ProductId } from "../../../domain/value-objects/product-id.vo";


@QueryHandler(GetProductQuery) 
export class GetProductHandler implements IQueryHandler<GetProductQuery>
{
    constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository) {}

    async execute(query: GetProductQuery): Promise<any> {
        return this.productRepository.findById(new ProductId(query.id));
    }
    

}
