import { Inject, Injectable } from "@nestjs/common";
import { CustomerRepositoryPort } from "../../application/ports/customer.repository";
import { DRIZZLE, DrizzleDB } from "../../../shared/infrastructure/database/postgres/drizzle.provider";
import { Customer } from "../../domain/entities/customer.entity";
import { customers } from "../../../shared/infrastructure/database/postgres/schema";
import { CustomerId } from "../../domain/value-objects/customer-id.vo";
import { Email } from "../../domain/value-objects/customer-email.vo";
import { eq } from "drizzle-orm";

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepositoryPort
{
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {

    }

    async save(customer: Customer): Promise<void> {
        const data = DrizzleCustomerRepository.toPersistence(customer);
        await this.db.insert(customers).values(data).onConflictDoUpdate({
            target: customers.id,
            set: {
                email: data.email,
                firstName: data.firstName,
                isActive: data.isActive,
                lastName: data.lastName,
                phone: data.phone,
                updatedAt: data.updatedAt
            }
        })
    }


    async findById(customerId: CustomerId): Promise<Customer | null> {
        const customer = await this.db.select().from(customers).where(eq(customers.id,customerId.getValue()));
        if(customer.length === 0) return null;
        return DrizzleCustomerRepository.toDomain(customer[0]);
    }

    async findByEmail(email: Email): Promise<Customer | null> {
        const customer = await this.db.select().from(customers).where(eq(customers.email,email.getValue()));
        if(customer.length === 0) return null;
        return DrizzleCustomerRepository.toDomain(customer[0]);
    }


    async findAll(): Promise<Customer[]> {
        const cs = await this.db.select().from(customers);
        return cs.map(DrizzleCustomerRepository.toDomain);
    }

    async delete(id: CustomerId): Promise<void> {
        await  this.db.delete(customers).where(eq(customers.id,id.getValue()));
    }


    private static toPersistence(customer:Customer) : typeof customers.$inferSelect 
    {
        return {
            id:customer.getId().getValue(),
            createdAt:customer.getCreatedAt(),
            updatedAt: customer.getUpdatedAt(),
            email: customer.getEmail().getValue(),
            firstName: customer.getFirstName(),
            lastName: customer.getLastName(),
            isActive: customer.getIsActive(),
            phone: customer.getPhone()
        }
    }

    private static toDomain(customer: typeof customers.$inferSelect ): Customer 
    {
        return Customer.reconsitute({
            id: new CustomerId(customer.id),
            email: Email.create(customer.email),
            createdAt: customer.createdAt,
            updateAt: customer.updatedAt,
            firstName: customer.firstName,
            isActive: customer.isActive,
            lastName: customer.lastName,
            phone: customer.phone
        });
    }
}