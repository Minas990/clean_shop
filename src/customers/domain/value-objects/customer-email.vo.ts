import { DomainException } from "../../../shared/domain/exceptions/domain.exception";

export class  Email {
    private readonly value:string;
    private static readonly EMAIL_PATTERN=
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._]+\.[a-zA-Z]{2,}$/

    private constructor(value:string) {
        this.value = value;
    }

    static create(value:string) : Email
    {
        const trim = value.trim().toLocaleLowerCase();
        if(!trim || !Email.EMAIL_PATTERN.test(value)) throw new DomainException('invalid email');
        return new Email(trim);
    }

    getValue()
    {
        return this.value;
    }

    equals(other:Email)
    {
        return this.value === other.value;
    }

    toString() : string {
        return this.value;
    }
}