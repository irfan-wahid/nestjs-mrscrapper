import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { RedisService } from '../infra/redis/redis.service';
import { KafkaProducer } from '../infra/kafka/kafka.producer';

describe('UserService', () => {
  let service: UserService;

  const mockRepo = {
    create: jest.fn().mockResolvedValue({ 
      "name": "test",
      "email": "test@gmail.com",
      "id": "1b7c9355-69ab-46e5-86f4-5794edeb1542",
      "createdAt": "2025-09-16T10:03:19.198Z"
    }),
    findById: jest.fn().mockResolvedValue({ 
      "name": "test",
        "email": "test@gmail.com",
        "id": "1b7c9355-69ab-46e5-86f4-5794edeb1542",
        "createdAt": "2025-09-16T10:03:19.198Z"
    }),
  };

  const mockKafkaProducer = {
    sendMessage: jest.fn().mockResolvedValue(true),
  };

  const mockRedis = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ //Mendaftarkan dependency
        UserService,
        { provide: 'IUserRepository', useValue: mockRepo }, //IUserRepository diganti dengan mockRepo
        { provide: KafkaProducer, useValue: mockKafkaProducer }, //KafkaProducer diganti dengan mockKafkaProducer
        { provide: RedisService, useValue: mockRedis }, //RadisService diganti dengan mockRedis
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create an user', async () => {
    const result = await service.createUser({ 
      name: 'John', email: 'john@gmail.com' 
    });

    expect(result).toEqual({
      code: 201,
      error_message: null,
      data: {
        name: "test",
        email: "test@gmail.com",
        id: "1b7c9355-69ab-46e5-86f4-5794edeb1542",
        createdAt: "2025-09-16T10:03:19.198Z" 
      },
    });
    expect(mockRepo.create).toHaveBeenCalled(); //memastikan service memang mencoba membuat user di repository.
    expect(mockKafkaProducer.sendMessage).toHaveBeenCalled();
  });

  it('should return user by id', async () => {
    const result = await service.getUser('c81328bd-cb0f-4632-ac13-29b74130a176');
    expect(result).toEqual({ 
      code: 201,
      error_message: null,
      data: {
        name: "test",
        email: "test@gmail.com",
        id: "1b7c9355-69ab-46e5-86f4-5794edeb1542",
        createdAt: "2025-09-16T10:03:19.198Z" 
      },
    });
    expect(mockRedis.get).toHaveBeenCalledWith('user:c81328bd-cb0f-4632-ac13-29b74130a176'); //apakah fungsi mockRepo.findById pernah dipanggil dengan parameter user:1?
    expect(mockRepo.findById).toHaveBeenCalled(); //apakah fungsi mockRepo.findById pernah dipanggil?
  });
});
