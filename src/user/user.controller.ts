import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { UpdateUserDto } from 'src/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<User> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}