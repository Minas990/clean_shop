import { UniqueId } from "./value-objects/unique-Id.vo";

export abstract class Entity<T extends UniqueId = UniqueId> 
{
    constructor(protected readonly id:T)
       {

    }

    getId()
    {
        return this.id;
    }

    equals(other: Entity<T>): boolean
    {
        if(other === null || other === undefined) return false;
        if(this == other) return true;
        return this.id.equals(other.getId());
    }
    
    
}