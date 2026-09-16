import { IsString } from "class-validator";

export class ShipOrderDto
{
    @IsString()
    trackingNumber!: string;
}