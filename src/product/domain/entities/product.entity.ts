import { AggregateRoot } from "../../../shared/domain/aggregate-root";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { ProductId } from "../value-objects/product-id.vo";
import { Sku } from "../value-objects/sku.vo";

export interface ProductProps 
{
    id: ProductId;
    name: string;
    description: string;
    price:Money
    sku:Sku;
    stock: number;
    isActive: boolean;
    lowStockThreshold: number;
    createdAt: Date;
    updatedAt: Date;
}

export class Product extends AggregateRoot
{
    private _id: ProductId;
    private _name: string;
    private _description: string;
    private _sku:Sku;
    private _stock: number;
    private _isActive: boolean;
    private _lowStockThreshold: number;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _price: Money;

    private constructor( props: ProductProps)
    {
        super();
        this._id = props.id;
        this._name = props.name;
        this._description = props.description;
        this._price = props.price;
        this._sku = props.sku;
        this._stock = props.stock;
        this._isActive = props.isActive;
        this._lowStockThreshold = props.lowStockThreshold;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    public static create(
        name: string,
        description: string,
        price: number,
        currency: string,
        stock: number,  
        sku:string
    ): Product
    {
        Product.validateName(name);
        Product.validateStock(stock);

        const now = new Date();
        return new Product({
            id: new ProductId(),
            name,
            description,
            price: Money.create(price, currency),
            sku:  Sku.create(sku),
            stock,
            isActive: true,
            lowStockThreshold: 5,
            createdAt: now,
            updatedAt: now
        });
    }

    get id(): ProductId
    {
        return this._id;
    }

    get name(): string
    {
        return this._name;
    }

    get description(): string
    {
        return this._description;
    }

    get price(): Money
    {
        return this._price;
    }

    get sku(): Sku
    {
        return this._sku;
    }

    get stock(): number
    {
        return this._stock;
    }

    get isActive(): boolean
    {
        return this._isActive;
    }

    get lowStockThreshold(): number
    {
        return this._lowStockThreshold;
    }

    get createdAt(): Date
    {
        return this._createdAt;
    }

    get updatedAt(): Date
    {
        return this._updatedAt;
    }



    static reconsitute(props: ProductProps): Product
    {
        return new Product(props);
    }

    private static validateName(name: string)
    {
        if(name.length < 3 || name.length > 100)
        {
            throw new Error("Name must be between 3 and 100 characters");
        }
    }

    private static validateStock(stock: number)
    {
        if(stock < 0)
        {
            throw new Error("Stock must be greater than or equal to 0");
        }
    }
}