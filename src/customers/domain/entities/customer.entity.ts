import { AggregateRoot } from "../../../shared/domain/aggregate-root";
import { Email } from "../value-objects/customer-email.vo";
import { CustomerId } from "../value-objects/customer-id.vo";

interface CustomerProp {
    id:CustomerId;
    email:Email;
    firstName:string;
    lastName:string;
    isActive:boolean;
    phone:string | null;
    createdAt:Date;
    updateAt:Date;
}


export class Customer extends AggregateRoot 
{
    
    private readonly _id: CustomerId;
    private _email: Email;
    private _firstName: string;
    private _lastName:string;
    private _isActive: boolean;
    private _phone: string | null;
    private readonly _createdAt: Date;
    private _updatedAt: Date;
    
    private constructor(props: CustomerProp) 
    {
        super();
        this._id = props.id;
        this._email = props.email;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updateAt;
        this._firstName = props.firstName;
        this._lastName = props.lastName;
        this._isActive = props.isActive;
        this._phone = props.phone;
    }

    static register(email:Email , firstName:string,lastName:string,phone:string|null): Customer 
    {
        const id = new CustomerId();
        const now = new Date();
        return new Customer({
            createdAt:now,
            updateAt: now,
            email,
            firstName,
            lastName,
            phone,
            id,
            isActive:true
        });
    }

    static reconsitute(props: CustomerProp) : Customer
    {
        return new Customer(props);
    }

    getFullName() : string {
        return `${this._firstName} ${this._lastName}`;
    }

    getId() {
        return  this._id;
    }

    getFirstName() {
        return this._firstName;
    }

    getLastName() {
        return this._lastName;
    }

    getCreatedAt()
    {
        return this._createdAt;
    }

    getUpdatedAt()
    {
        return this._updatedAt;
    }

    getEmail()
    {
        return this._email;
    }

    getPhone() 
    {
        return this._phone;
    }

    getIsActive() 
    {
        return this._isActive   ;
    }
}