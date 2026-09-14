import { UniqueId } from "../../../shared/domain/value-objects/unique-Id.vo";

export class OrderId extends UniqueId
{
    constructor(id?:string)
    {
        super(id);
    }
}