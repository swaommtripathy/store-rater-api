import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
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
}