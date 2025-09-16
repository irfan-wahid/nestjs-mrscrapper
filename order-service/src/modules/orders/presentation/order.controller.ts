import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateOrderDto } from "../application/dto/create-order.dto";
import { OrderService } from "../application/order.service";
import { Order } from "../domain/order.entity";

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

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() user: Partial<Order>
    ) {
        return this.orderService.updateOrder(id, user);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.orderService.deleteOrder(id);
    }
}