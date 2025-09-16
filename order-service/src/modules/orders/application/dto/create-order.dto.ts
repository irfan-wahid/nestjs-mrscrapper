import { IsNotEmpty, isNotEmpty, IsOptional } from "class-validator"

export class CreateOrderDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    product: string;
    
    @IsNotEmpty()
    price: number;

    @IsOptional()
    status?: string;
}