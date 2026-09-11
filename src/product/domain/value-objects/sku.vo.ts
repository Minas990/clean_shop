import { DomainException } from "../../../shared/domain/exceptions/domain.exception";

export class Sku 
{
    private static readonly skuPattern =/^[A-Za-z0-9-]+$/;
    private static readonly MIN_LENGTH = 3;
    private static readonly MAX_LENGTH = 50;

    private readonly value: string;

    private constructor(value: string) 
    {
        this.value = value;
    }


    static create(value: string): Sku
    {
        const trimmedValue = value.trim(); 
        if(trimmedValue.length < Sku.MIN_LENGTH || trimmedValue.length > Sku.MAX_LENGTH)
        {
            throw new DomainException(`Invalid SKU length. SKU must be between ${Sku.MIN_LENGTH} and ${Sku.MAX_LENGTH} characters long.`);
        }
        if(!Sku.skuPattern.test(trimmedValue))
        {
            throw new DomainException(`Invalid SKU format. SKU must be 8 characters long and contain only uppercase letters and numbers.`);
        }
        return new Sku(trimmedValue);
    }

    equals(other: Sku): boolean
    {
        return this.value === other.value;
    }


    getValue(): string
    {
        return this.value;
    }

    toString(): string
    {
        return this.value;
    }
}