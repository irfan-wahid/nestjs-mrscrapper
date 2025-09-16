import { User } from "./user.entity";

export interface IUserRepository {
    create(user: User): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    update(id: string, user: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}