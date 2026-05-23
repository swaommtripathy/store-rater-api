import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.usersService.create({
        ...dto,
        password: hashedPassword,
      });

      // Return response without password
      const { password, ...result } = user;
      return {
        message: 'User registered successfully',
        user: result,
      };
    } catch (error: any) {
      if (error.message.includes('Email already exists')) {
        throw new BadRequestException('Email already registered');
      }
      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const secretKey = this.configService.get<string>('JWT_SECRET') || 'super_secret_key_123';
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload, { secret: secretKey });

    return {
      message: 'Login successful',
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}