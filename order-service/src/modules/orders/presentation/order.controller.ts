import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateOrderDto } from "../application/dto/create-order.dto";
import { OrderService } from "../application/order.service";

@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ){}

    @Post()
    async create(@Body() dto: CreateOrderDto){
        return this.orderService.createOrder(dto);
    }

    @Get(':userId')
    async get(@Param('userId') userId: string){
        return this.orderService.getOrderByUserId(userId);
    }

    @Get()
    async getAll(){
        return this.orderService.getAllOrder();
    }
}