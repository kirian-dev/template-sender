import { Controller, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('register')
  async register(@Body() createAuthDto: CreateUserDto): Promise<{ token: string }> {
    try {
      const token = await this.authService.register(createAuthDto);
      return token;
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('login')
  async login(@Body() dto: LoginUserDto): Promise<{ token: string }> {
    try {
      const token = await this.authService.login(dto);
      return token;
    } catch (error) {
      return error;
    }
  }
}
