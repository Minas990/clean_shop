import { DomainException } from "../../../shared/domain/exceptions/domain.exception";

interface ShippingAddresProps
{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}


export class ShippingAddress
{
    private readonly _street: string;
    private readonly _city: string;
    private readonly _state: string;
    private readonly _zipCode: string;
    private readonly _country: string;

    private constructor(props: ShippingAddresProps)
    {
        this._street = props.street;
        this._city = props.city;
        this._state = props.state;
        this._zipCode = props.zipCode;
        this._country = props.country;
    }


    static create(props: ShippingAddresProps):ShippingAddress
    {
        Object.keys(props).forEach((key) => {

            if(typeof key === 'string') 
            {
                props[key] = props[key].trim();
                if(!props[key])
                    throw new DomainException(`${key} cannot be empty`);
            }
        });
        
        if(props.country.length !== 2)
                throw new DomainException(`country code must be exactly 2 characters`);
        return new ShippingAddress({
            ...props,
            country: props.country.toUpperCase()
        });
    }

    
    get street()  {return this._street}
    get city()  {return this._city}
    get country()  {return this._country}
    get zipcode()  {return this._zipCode}
    get state() {return this._state} 

    equals(other: ShippingAddress)
    {
        let ok = true;
        Object.keys(this).forEach((key) => {
            if(typeof key === 'string') 
            {
                if(this[key] != other[key])
                {
                    ok = false;
                }
            }    
        });
        return ok;
    }

}