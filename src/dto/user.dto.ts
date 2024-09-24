import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    name: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
    password: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}