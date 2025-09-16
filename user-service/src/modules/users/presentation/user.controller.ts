import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "../application/user.service";
import { CreateUserDto } from "../application/dto/create-user.dto";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    async create(@Body() dto: CreateUserDto){
        return this.userService.createUser(dto);
    }

    @Get(':id')
    async get(@Param('id') id: string){
        return this.userService.getUser(id);
    }

    @Get()
    async getAll(){
        return this.userService.getAllUser();
    }
}