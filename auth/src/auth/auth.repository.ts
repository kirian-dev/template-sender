import { Repository } from 'typeorm';
import { User } from "./entities/user.entity"
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return this.userRepository.findOne({ where: { email } })
    } catch (error) {
      throw new Error(error)
    };
  }

  async create(email: string, password: string): Promise<User | undefined> {
    try {
      const newUser = this.userRepository.create({
        email: email,
        password: password,
      });

      return this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(error)
    }

  }
}
