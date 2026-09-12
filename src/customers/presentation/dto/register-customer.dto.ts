import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class RegisterCustomerDto 
{
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email!:string;

    
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName!:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName!:string;

    @IsOptional()
    @IsPhoneNumber()
    phone!: string | null;
}