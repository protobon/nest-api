import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/auth.dto';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { Env } from 'src/common/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signup(user: UserDto) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.userService.create(user);
  }

  async login(credentials: LoginDto): Promise<{ access_token: string, refresh_token: string }> {
    const user = await this.userService.findByEmail(credentials.email);
    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    const refresh_token = uuidv4();
    await this.updateRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(email: string, refreshToken: string): Promise<{ access_token: string, refresh_token: string }> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException("Wrong email");
      }
      if (user.refreshTokenExpirationDate < new Date() || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
        throw new UnauthorizedException("Wrong or expired refresh token");
      }

      const new_access_token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
      const new_refresh_token = uuidv4();
      await this.updateRefreshToken(user.id, new_refresh_token);

      return {
        access_token: new_access_token,
        refresh_token: new_refresh_token,
      }
    } catch {
      throw new UnauthorizedException("Refresh token invalid");
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + Env.REFRESH_TOKEN_EXPIRE_IN_DAYS);
    
    return this.userService.updateRefreshToken(userId, hashedRefreshToken, expirationDate);
  }
}
