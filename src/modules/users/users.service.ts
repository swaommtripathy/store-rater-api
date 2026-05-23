import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email: userData.email } });
    if (existing) throw new ConflictException('Email already exists');

    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async delete(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}