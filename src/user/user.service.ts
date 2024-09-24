import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserDto, UpdateUserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async create(user: UserDto): Promise<User> {
    const { name, email, password } = user;

    const emailInUse = await this.userModel.findOne({email: email})
    if (emailInUse) {
      throw new BadRequestException("Email already in use")
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new this.userModel({
      name,
      email,
      password: hashedPassword
    }).save();
    const userObject = newUser.toObject();
    delete userObject.password;
    return userObject;
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    const { name } = user;
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: { name } },
      { new: true }
    ).exec();

    return updatedUser.toObject();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.deleteOne({id}).exec();
  }
}