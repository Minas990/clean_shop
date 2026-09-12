import { Customer } from "../../domain/entities/customer.entity";

export class CustomerResponseDto 
{
    id!: string  ;
    email!:string;
    firstName!:string;
    lastName!:string;
    fullName!:string;
    isActive!:boolean;
    phone!:string | null;
    createdAt!:Date;
    updatedAt!:Date;

    static fromDomain(customer: Customer) : CustomerResponseDto 
    {
        const dto = new CustomerResponseDto();
        dto.id = customer.getId().getValue();
        dto.email = customer.getEmail().getValue();
        dto.phone = customer.getPhone();
        dto.firstName = customer.getFirstName();
        dto.lastName =customer.getLastName();
        dto.createdAt = customer.getCreatedAt();
        dto.updatedAt= customer.getUpdatedAt();
        dto.isActive = customer.getIsActive();
        dto.fullName= customer.getFullName();
        return dto;
    }
}