import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) { }

  async register(createAuthDto: CreateUserDto): Promise<{ token: string }> {
    try {
      const { email, password } = createAuthDto;

      const existingUser = await this.authRepository.findByEmail(email);
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.authRepository.create(email, hashedPassword);

      const token = this.generateToken(newUser.id);

      return { token };
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  }

  async login(dto: LoginUserDto): Promise<{ token: string }> {
    try {
      const { email, password } = dto;

      const existingUser = await this.authRepository.findByEmail(email);
      if (!existingUser) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      const passwordMatches = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatches) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      const token = this.generateToken(existingUser.id);
      return { token };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  private generateToken(userId: number): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: '1w' });
  }
}
