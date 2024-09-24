import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService 
  ) {}

  async signup(user: UserDto) {
    return this.userService.create(user);
  }

  async login(credentials: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(credentials.email);
    if (user) {
      const passwordMatch = await bcrypt.compare(credentials.password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException("Wrong password");
      }
    } else {
      throw new UnauthorizedException("Email not found");
    }
    const payload = { sub: user.id, email: user.email }
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
