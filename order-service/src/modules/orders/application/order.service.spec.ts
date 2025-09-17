import { Test, TestingModule } from "@nestjs/testing";
import { OrderService } from "./order.service"
import { KafkaConsumer } from "../infra/kafka/kafka.consumer";
import { RedisService } from "../infra/redis/redis.service";
import { Order } from "../domain/order.entity";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OrderService', () => {
    let service: OrderService;

    const mockRepo = {
        create: jest.fn().mockResolvedValue({
            id: '1a6c4c37-a673-47a0-b9ff-5321e875790f',
            userId: "03a89d8b-c5e6-4d37-a474-35d8bdb34267",
            product: 'pensil',
            price: 5000,
            status: 'PENDING',
            createdAt: '2025-09-16T09:04:48.334Z'
        }),
        findByUserId: jest.fn().mockResolvedValue({
            id: '1a6c4c37-a673-47a0-b9ff-5321e875790f',
            userId: "03a89d8b-c5e6-4d37-a474-35d8bdb34267",
            product: 'pensil',
            price: 5000,
            status: 'PENDING',
            createdAt: '2025-09-16T09:04:48.334Z'
        }),
    }

    const mockRedis = {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                { provide: 'IOrderRepository', useValue: mockRepo },
                { provide: RedisService, useValue: mockRedis },
            ]
        }).compile();

        service = module.get<OrderService>(OrderService);
    });

    it('should create an order', async() => {
        mockedAxios.get.mockResolvedValue({
            data: { data: { id: "03a89d8b-c5e6-4d37-a474-35d8bdb34267" } },
            status: 200,
            statusText: "OK",
            headers: {},
            config: { url: "http://localhost:3000/users/03a89d8b-c5e6-4d37-a474-35d8bdb34267" },
        });

        const result = await service.createOrder({ 
                userId: "03a89d8b-c5e6-4d37-a474-35d8bdb34267",
                product: "pensil",
                price: 5000
        })

        expect(result).toEqual({
            code: 201,
            error_message: null,
            data: {
            id: "1a6c4c37-a673-47a0-b9ff-5321e875790f",
            userId: "03a89d8b-c5e6-4d37-a474-35d8bdb34267",
            product: "pensil",
            price: 5000,
            status: "PENDING",
            createdAt: "2025-09-16T09:04:48.334Z"
            }
        });

        expect(mockRepo.create).toHaveBeenCalled();
        expect(mockedAxios.get).toHaveBeenCalled();
    })

    it('should return order by user id', async() => {
        const result = await service.getOrderByUserId('1a6c4c37-a673-47a0-b9ff-5321e875790f');
        expect(result).toEqual({
            code: 201,
            error_message: null,
            data: {
                id: "1a6c4c37-a673-47a0-b9ff-5321e875790f",
                userId: "03a89d8b-c5e6-4d37-a474-35d8bdb34267",
                product: "pensil",
                price: 5000,
                status: "PENDING",
                createdAt: "2025-09-16T09:04:48.334Z"
            }
        });
        
        expect(mockRedis.get).toHaveBeenCalledWith('userId:1a6c4c37-a673-47a0-b9ff-5321e875790f');
        expect(mockRepo.findByUserId).toHaveBeenCalled();
    })
})