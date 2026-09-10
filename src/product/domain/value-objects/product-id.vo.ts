import { UniqueId } from "../../../shared/domain/value-objects/unique-Id.vo";

export class ProductId extends UniqueId 
{
    constructor(id?:string) 
    {
        super(id);
    }
}