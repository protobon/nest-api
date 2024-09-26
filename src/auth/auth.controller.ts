import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from 'src/dto/auth.dto';
import { UserDto } from 'src/dto/user.dto';
import { Public } from './auth.guard';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() user: UserDto) {
        return this.authService.signup(user);
    }

    @Post('login')
    async login(@Body() credentials: LoginDto) {
        return this.authService.login(credentials);
    }

    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refresh(refreshTokenDto.email, refreshTokenDto.token);
    }
}
