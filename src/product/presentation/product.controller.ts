import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProductCommand } from "../application/use-cases/create-product/create-product.command";
import { ProductResponseDto } from "./dto/product-response.dto";
import { ListProductQuery } from "../application/queries/list-product.query";
import { Product } from "../domain/entities/product.entity";
import { GetProductQuery } from "../application/queries/get-product.query";

@Controller('products')
export class ProductController
{
    constructor(private readonly commandBus: CommandBus,private readonly queryBus: QueryBus)
    {
        
    }

    @Post()
    async createProduct(@Body() dto: CreateProductDto): Promise<void>
    {
        const command = new CreateProductCommand(
            dto.name,
            dto.description,
            dto.price,
            dto.currency,
            dto.stock,
            dto.sku
        );
        await this.commandBus.execute(command);
    }
    

    @Get()
    async getAllProducts(@Query('isActive') isActive?: string,@Query('minPrice') minPrice?: string , @Query('maxPrice'  ) maxPrice?: string): Promise<ProductResponseDto[]>
    {
        console.log(isActive,minPrice,maxPrice);
        const prodacts =  await this.queryBus.execute<ListProductQuery, Product[]>(
            new ListProductQuery(
                isActive !== undefined ? isActive==='true' : undefined,
                 minPrice !== undefined ? parseFloat(minPrice) : undefined,
                 maxPrice !== undefined ? parseFloat(maxPrice) : undefined));
        
        return prodacts.map(ProductResponseDto.fromDomain);
        
    }

    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<ProductResponseDto | null> 
    {
        const product = await this.queryBus.execute(new GetProductQuery(id));
        if(!product) return null;
        return ProductResponseDto.fromDomain(product); 
    }
}