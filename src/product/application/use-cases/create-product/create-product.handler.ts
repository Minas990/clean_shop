import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateProductCommand } from "./create-product.command";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../ports/product.repository.port";
import { Inject } from "@nestjs/common";
import { Product } from "../../../domain/entities/product.entity";

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> 
{
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository
    ){}
    async execute(command: CreateProductCommand): Promise<any> {
        const product = Product.create(
            command.name,
            command.description,
            command.price,
            command.currency,
            command.stock,
            command.sku
        );
        await this.productRepository.save(product)
    }
}