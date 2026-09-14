import { DomainException } from "../exceptions/domain.exception";

export class Money 
{
    private constructor(
        private readonly amount: number,
        private readonly currency: string
    ) {}

    static create(amount: number, currency: string = 'USD'): Money 
    {
        if(amount < 0 ) throw new DomainException('Amount cannot be negative');
        const normalizedAmount = Math.round(amount * 100) / 100; // Round to 2 decimal places
        return new Money(normalizedAmount, currency);
    }

    static zero(currency:string = 'USD' ) : Money
    {
        return new Money(0,currency);
    }

    multiply(factor: number): Money
    {
        if(factor < 0 ) 
             throw new DomainException('factor must be >= 0')
        return new Money(this.amount*factor,this.currency);
    }

    subtract(other:Money):Money
    {
        this.assertSameCurrency(other);
        const res = this.amount - other.amount;
        if(res < 0)
             throw new DomainException('res must be >0 while subtracting')
        return new Money(res,this.currency);
    }

    add(other:Money):Money
    {
        this.assertSameCurrency(other);
        const res = this.amount + other.amount;
        return new Money(res,this.currency);
    }


    isGreateThan(money:Money): boolean
    {
        this.assertSameCurrency(money);
        return this.amount >= money.amount;
    }

    getAmount(): number
    {
        return this.amount;
    }

    getCurrency(): string
    {
        return this.currency;
    }

    toCents() {
        return Math.round(this.amount * 100);
    }

    private assertSameCurrency(other:Money){
        if(other.getCurrency() !== this.getCurrency()) 
            throw new DomainException('comparing 2 diffrent currency is currently forbidden');
        return true;
    }
}