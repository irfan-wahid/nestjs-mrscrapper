import { IsNotEmpty, isNotEmpty, IsOptional } from "class-validator"
import { OrderStatus } from "../../domain/order-status.enum";

export class CreateOrderDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    product: string;
    
    @IsNotEmpty()
    price: number;

    @IsOptional()
    status?: OrderStatus;
}