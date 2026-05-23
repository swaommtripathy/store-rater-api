import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(120, { message: 'Name cannot exceed 120 characters' })
  name!: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(16, { message: 'Password cannot exceed 16 characters' })
  password!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of: admin, user, store_owner' })
  role?: UserRole;
}
