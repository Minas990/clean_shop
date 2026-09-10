export class Money 
{
    private constructor(
        private readonly amount: number,
        private readonly currency: string
    ) {}

    static create(amount: number, currency: string = 'USD'): Money 
    {
        if(amount < 0 ) throw new Error('Amount cannot be negative');
        const normalizedAmount = Math.round(amount * 100) / 100; // Round to 2 decimal places
        return new Money(normalizedAmount, currency);
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
}