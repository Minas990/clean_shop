import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteProductCommand } from "./delete-product.command";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../ports/product.repository.port";
import { Inject } from "@nestjs/common";
import { ProductId } from "../../../domain/value-objects/product-id.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand,void> 
{
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository
    ){}

    async execute(command: DeleteProductCommand): Promise<void> {
        const productId = new ProductId(command.id);

        const prod= await this.productRepository.findById(
            productId
        );

        if(!prod)
            throw new ApplicationException(`Product with id ${productId.getValue()} not found`, ApplicationExceptionCode.NOT_FOUND);
        
        await this.productRepository.delete(productId);
    }
}