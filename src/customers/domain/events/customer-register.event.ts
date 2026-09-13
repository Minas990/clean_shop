export class CustomerRegisterEvent {
    constructor(
        public readonly customerId : string,
        public readonly email: string,
        public readonly fullName: string
    ) {}
}