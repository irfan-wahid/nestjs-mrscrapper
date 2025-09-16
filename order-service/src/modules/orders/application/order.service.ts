import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IOrderRepository } from "../domain/order.repository";
import { RedisService } from "../infra/redis/redis.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "../domain/order.entity";
import axios from "axios"
import { ApiResponse } from "shared/interfaces/api-response.interface";
import { error, success } from "../../../../shared/utils/response.helper";

@Injectable()
export class OrderService {
    constructor(
        @Inject('IOrderRepository') private readonly orderRepository: IOrderRepository,
        private readonly redisService: RedisService,
    ){}

    async createOrder(dto: CreateOrderDto): Promise<ApiResponse<Order>> {
        try {
            const res = await axios.get(`http://localhost:3000/users/${dto.userId}`, {
                validateStatus: () => true,
            });

            const userData = (res.data as any).data;

            if (!userData) {
            return error(404, 'User not found');
            }

            const order = new Order(dto.userId, dto.product, dto.price, dto.status);
            const created = await this.orderRepository.create(order);

            return success(created);
        } catch (err) {
            console.error(err);
            return error(500, 'Gagal membuat order, silakan coba lagi.');
        }
    }

    async getOrderByUserId(id: string): Promise<ApiResponse<Order>> {
        try{
            const cached = await this.redisService.get(`userId:${id}`);
            if(cached){
                console.log("cache hit");
                return success(JSON.parse(cached));
            }

            const order = await this.orderRepository.findByUserId(id);
            if(!order){
                return error(404, 'Data order tidak ditemukan.');
            }

            await this.redisService.set(`userId:${id}`, JSON.stringify(order), 60);

            return success(order);
        }catch(err){
            console.error(err)
            return error(500, 'Gagal mendapatkan data, silakan coba lagi.');
        }
    }

    async getAllOrder(): Promise<ApiResponse<Order[]>>{
        try{
            const data = await this.orderRepository.findAll();

            return success(data);
        }catch(err){
            console.error(err)
            return error(500, 'Gagal mendapatkan data, silakan coba lagi.');
        }
    }
}

