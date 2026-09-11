import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateProductCommand } from "./create-product.command";
import { PRODUCT_REPOSITORY, ProductRepository } from "../../ports/product.repository.port";
import { Inject } from "@nestjs/common";
import { Product } from "../../../domain/entities/product.entity";
import { Sku } from "../../../domain/value-objects/sku.vo";
import { ApplicationException, ApplicationExceptionCode } from "../../../../shared/domain/exceptions/application.exception";

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> 
{
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository
    ){}
    async execute(command: CreateProductCommand): Promise<any> {
        
        const exisitingSku = await this.productRepository.findBySku(Sku.create(command.sku));
        if (exisitingSku) {
            throw new ApplicationException(`Product with SKU ${command.sku} already exists.`,ApplicationExceptionCode.CONFLICT);
        }
        
        
        const exisitngName = await this.productRepository.findByName(command.name);
        if (exisitngName) {
            throw new ApplicationException(`Product with name ${command.name} already exists.`,ApplicationExceptionCode.CONFLICT);
        }
        

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