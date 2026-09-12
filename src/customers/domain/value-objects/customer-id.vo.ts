import { UniqueId } from "../../../shared/domain/value-objects/unique-Id.vo";

export class CustomerId extends UniqueId
{
    constructor(id?:string)
    {
        super(id);
    }
}