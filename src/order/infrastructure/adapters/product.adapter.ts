import { Inject, Injectable } from "@nestjs/common";
import { CustomerPort } from "../../application/ports/customer.port";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../../product/application/ports/product.repository.port";
import { ProductId } from "../../../product/domain/value-objects/product-id.vo";


@Injectable()
export class ProductAdapter implements CustomerPort
{
    constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepo : ProductRepository) 
    {

    }
    async exist(productID: string): Promise<boolean> {
        const product = await this.productRepo.findById(new ProductId(productID));
        return product!==null;
    }
}