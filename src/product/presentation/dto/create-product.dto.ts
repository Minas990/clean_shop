import { IsNumber, IsOptional, IsPositive, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto
{
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    name!: string;

    @IsString()
    description!: string;

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'SKU can only contain letters, numbers, underscores, and hyphens'
    })
    sku!: string;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsString()
    @MinLength(3)
    @MaxLength(3)
    @IsOptional()
    currency: string = 'USD';

    @IsNumber()
    @Min(0)
    stock!: number;
}