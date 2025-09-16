import { v4 as uuidv4 } from 'uuid';

export class User {
    constructor(
        public name: string,
        public email: string,
        public readonly id: string = uuidv4(),
        public readonly createdAt: Date = new Date(),
    ) {}
}