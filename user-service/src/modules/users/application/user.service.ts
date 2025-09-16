import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IUserRepository } from "../domain/user.repository";
import { KafkaProducer } from "../infra/kafka/kafka.producer";
import { User } from "../domain/user.entity";
import { RedisService } from "../infra/redis/redis.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiResponse } from "shared/interfaces/api-response.interface";
import { error, success } from "../../../../shared/utils/response.helper";

@Injectable()
export class UserService {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        private readonly kafkaProducer: KafkaProducer,
        private readonly redisService: RedisService,
    ){}

    async createUser(dto: CreateUserDto): Promise<ApiResponse<User>> {
        try{
            const user = new User(dto.name, dto.email);
            const createdUser = await this.userRepository.create(user);
            await this.kafkaProducer.sendMessage('user.created', createdUser);
            return success(createdUser);
        }catch(err){
            console.error(err);
            return error(500, 'Gagal membuat user, silakan coba lagi.');
        }
    }

    async getUser(id: string): Promise<ApiResponse<User>> {
        try{
            const cached = await this.redisService.get(`user:${id}`);
            if(cached){
                console.log("hit cache")
                return JSON.parse(cached);
            }

            const user = await this.userRepository.findById(id);
            if(!user){
                return error(404, 'User not found.');
            }

            await this.redisService.set(`user:${id}`, JSON.stringify(user), 60);

            return success(user);
        }catch(err){
            console.error(err);
            return error(500, 'Gagal mendapatkan data, silakan coba lagi.');
        }
    }

    async getAllUser(): Promise<ApiResponse<User[]>> {
        try{
            const data = await this.userRepository.findAll();

            return success(data);
        }catch(err){
            console.error(err);
            return error(500, 'Gagal mendapatkan data, silakan coba lagi');
        }
    }

    async updateUser(id: string, user: Partial<User>): Promise<ApiResponse<User>> {
        try {
            const updated = await this.userRepository.update(id, user);
            if (!updated) {
                return error(404, 'User not found.');
            }

            return success(updated);
        } catch (err) {
            console.error(err);
            return error(500, 'Gagal merubah data, silakan coba lagi');
        }
    }

    async deleteUser(id: string): Promise<ApiResponse<User>> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                return error(404, 'User not found.');
            }

            const deleted = await this.userRepository.delete(id);
            if (!deleted) {
                return error(400, 'User gagal dihapus.');
            }

            return success(user);
        } catch (err) {
            console.error(err);
            return error(500, 'Gagal menghapus data, silakan coba lagi');
        }
    }
}