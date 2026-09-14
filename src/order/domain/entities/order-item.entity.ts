import { ProductId } from "../../../product/domain/value-objects/product-id.vo";
import { Entity } from "../../../shared/domain/entity";
import { DomainException } from "../../../shared/domain/exceptions/domain.exception";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { UniqueId } from "../../../shared/domain/value-objects/unique-Id.vo";

interface OrderItemsProps
{
    id: UniqueId;
    productId: string;
    productName: string;
    unitPrice: Money;
    quantity: number;
    discount: Money| null;
}

export class OrderItem extends Entity
{
    private readonly _productId: string;
    private readonly _productName: string;
    private readonly _unitPrice: Money;
    private _quantity: number;
    private _discount: Money| null;

    private constructor(props:OrderItemsProps)
    {
        super(props.id);
        this._productId = props.productId;
        this._productName = props.productName;
        this._unitPrice = props.unitPrice;
        this._quantity = props.quantity;
        this._discount = props.discount;
    }


    static create(
        productId:string ,
        productName:string,
        unitPrice: Money,
        quantity: number
    )
    {
        if(quantity <=0 )
            return new DomainException('quantity must be >0')
        
        return new OrderItem({
            id: new UniqueId(),
            productId: productId,
            productName,
            unitPrice,
            discount:null,
            quantity
        });
    }

    static  recontitute(props: OrderItemsProps) : OrderItem
    {
        return new OrderItem(props);
    }

    updateQuantity(quantity:number)
    {
        if(quantity<=0)
            return new DomainException('quantity must be >0')
        this._quantity=quantity;
    }
    
    applyDiscount(discount:Money)
    {
        const lineTotal = this._unitPrice.multiply(this.quantity);
        if(discount.isGreateThan(lineTotal)) 
            throw new DomainException('quantity must be >0')
        this._discount = discount;
    }

    removeDiscount()
    {
        this._discount = null;
    }

    getSubtotal()
    {
        const lineTotal = this._unitPrice.multiply(this.quantity);
        if(this._discount)
            return lineTotal.subtract(this._discount);
        return lineTotal;
    }
    get productId(){return this._productId}
    get productName(){return this._productName}
    get unitPrice(){ return  this._unitPrice}
    get quantity(){return this.quantity}
    get discount(): Money | null {return this.discount}


}


