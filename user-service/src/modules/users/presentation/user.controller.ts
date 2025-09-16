import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "../application/user.service";
import { CreateUserDto } from "../application/dto/create-user.dto";
import { User } from "../domain/user.entity";

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

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() user: Partial<User>
    ) {
        return this.userService.updateUser(id, user);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}