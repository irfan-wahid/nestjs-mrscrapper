import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../domain/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../database/user.entity";
import { Repository } from "typeorm";
import { User } from "../../domain/user.entity";

@Injectable()
export class UserRepository implements IUserRepository{
    constructor(
        @InjectRepository(UserEntity)
        private readonly repo: Repository<UserEntity>,
    ) {}

    async create(user: User): Promise<User>{
        const entity = this.repo.create(user);
        await this.repo.save(entity);

        return user;
    }

    async findById(id: string): Promise<User | null> {
        const entity = await this.repo.findOne({ where: {id} });
        if(!entity){
            return null
        }

        return new User(entity.name, entity.email, entity.id, entity.createdAt);
    }

    async findAll(): Promise<User[]> {
        const entities = await this.repo.find();
        return entities.map(e => new User(e.name, e.email, e.id, e.createdAt));
    }

    async update(id: string, user: Partial<User>): Promise<User | null> {
        await this.repo.update(id, user);
        const updated = await this.repo.findOne({ where: { id } });
        if (!updated) {
            return null;
        }
        
        return new User(updated.name, updated.email, updated.id, updated.createdAt);
    }

    async delete(id: string): Promise<boolean>{
        const result = await this.repo.delete(id);
        return result.affected !== 0;
    }
}