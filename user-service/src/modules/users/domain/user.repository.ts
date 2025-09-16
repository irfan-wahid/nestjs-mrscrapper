import { User } from "./user.entity";

export interface IUserRepository {
    create(user: User): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
}