import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UserResponseDto } from './dto/auth.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GatewayService {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) { }

  register(dto: CreateUserDto): Observable<UserResponseDto> {
    try {
      return this.authClient
        .send<UserResponseDto>('register', dto)
        .pipe(
          catchError((error) => {
            if (error instanceof HttpException) {
              return throwError(error.getResponse());
            }
            return throwError(error);
          }),
          map((response) => response as UserResponseDto),
        );
    } catch (error) {
      throw new Error(error)
    }
  }

  login(dto: LoginUserDto): Observable<UserResponseDto> {
    try {
      return this.authClient
        .send<UserResponseDto>('login', dto)
        .pipe(
          catchError((error) => {
            console.error('Error in login request:', error);

            if (error instanceof HttpException) {
              return throwError({
                statusCode: error.getStatus(),
                message: error.getResponse(),
              });
            }

            return throwError(error);
          }),
          map((response) => response as UserResponseDto),
        );
    }
    catch (error) {
      throw new Error(error)
    }
  }
}
