import { UniqueId } from "../../../shared/domain/value-objects/unique-Id.vo";

export class PaymentId extends UniqueId
{
    constructor(id?: string)
    {
        super(id);
    }
}