import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { CreateUserDto, LoginUserDto, UserResponseDto } from './dto/auth.dto';
import { Observable } from 'rxjs';

@Controller()
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) { }

    @Post('auth/register')
    @HttpCode(201)
    register(@Body() dto: CreateUserDto): Observable<UserResponseDto> {
        return this.gatewayService.register(dto);
    }

    @Post('auth/login')
    @HttpCode(200)
    login(@Body() dto: LoginUserDto): Observable<UserResponseDto> {
        return this.gatewayService.login(dto);
    }
}
