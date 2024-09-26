import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserDto, UpdateUserDto } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('+password +refreshToken +refreshTokenExpirationDate');
  }

  async create(user: UserDto): Promise<User> {
    const emailInUse = await this.userModel.findOne({ email: user.email })
    if (emailInUse) {
      throw new BadRequestException("Email already in use")
    }

    const newUser = await new this.userModel(user).save();
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

  async updateRefreshToken(id: string, refreshToken: string, refreshTokenExpirationDate: Date): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      id,
      { $set: { 
        refreshToken,
        refreshTokenExpirationDate,
        }
      },
    ).exec()
  }

  async delete(id: string): Promise<void> {
    await this.userModel.deleteOne({id}).exec();
  }
}