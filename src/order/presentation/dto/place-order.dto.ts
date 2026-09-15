import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength, ValidateNested } from "class-validator";

export class PlaceOrderItemDto
{
    @IsUUID()
    productId!: string;

    @IsString()
    @MinLength(1)
    @MaxLength(255)
    productName!: string;

    @IsNumber()
    @Min(0)
    unitPrice!: number;

    @IsOptional()
    @MinLength(3)
    @MaxLength(3)
    currency?: string ="USD";

    @IsNumber()
    @Min(1)
    quantity!:number;

}

export class PlaceOrderDto
{
    @IsUUID()
    customerId!: string;

    @ArrayMinSize(1)
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => PlaceOrderItemDto)
    items!: PlaceOrderItemDto[];

    @IsString()
    shippingCity!:string;
    @IsString()
    shippingStreet!:string;
    @IsString()
    shippingState!:string;
    @IsString()
    shippingZipcode!:string;
    @IsString()
    shippingCountry!:string;
}